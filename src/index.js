import { config } from "./config.js";
import { RTCStatsMoment } from "rtcstats-wrapper";

const Chart = window.Chart;
const Peer = window.Peer;

const charts = new Map();
let timerId;

(async function main() {
  const localVideo = document.getElementById("js-local-stream");
  const localId = document.getElementById("js-local-id");
  const callTrigger = document.getElementById("js-call-trigger");
  const closeTrigger = document.getElementById("js-close-trigger");
  const remoteVideo = document.getElementById("js-remote-stream");
  const remoteId = document.getElementById("js-remote-id");
  const meta = document.getElementById("js-meta");
  const sdkSrc = document.querySelector("script[src*=skyway]");

  const chartArea = document.getElementById("js-chart");

  meta.innerText = `
    UA: ${navigator.userAgent}
  `.trim();

  const localStream = await navigator.mediaDevices
    .getUserMedia({
      audio: true,
      video: true,
    })
    .catch(console.error);

  // Render local stream
  localVideo.muted = true;
  localVideo.srcObject = localStream;
  localVideo.playsInline = true;
  await localVideo.play().catch(console.error);

  const peer = (window.peer = new Peer({
    key: "YOUR_SKYWAY_KEY",
    debug: 3,
  }));

  // New each charts for WebRTC stats
  for (const [key, value] of Object.entries(config)) {
    const ctx = document.createElement("canvas");
    ctx.id = "canvas_" + key;
    chartArea.appendChild(ctx);

    const chart = new Chart(ctx, value);
    charts.set(key, chart);
  }

  // Register caller handler
  callTrigger.addEventListener("click", () => {
    // Note that you need to ensure the peer has connected to signaling server
    // before using methods of peer instance.
    if (!peer.open) {
      return;
    }
    const mediaConnection = peer.call(remoteId.value, localStream);

    mediaConnection.on("stream", async (stream) => {
      // Render remote stream for caller
      remoteVideo.srcObject = stream;
      remoteVideo.playsInline = true;
      await remoteVideo.play().catch(console.error);

      // Update chart for stats
      timerId = _updateCharts(mediaConnection);
    });

    mediaConnection.once("close", () => {
      remoteVideo.srcObject.getTracks().forEach((track) => track.stop());
      remoteVideo.srcObject = null;

      // Stop drawing for stats
      clearInterval(timerId);
    });

    closeTrigger.addEventListener("click", () => {
      mediaConnection.close(true);

      clearInterval(timerId);
    });
  });

  peer.once("open", (id) => (localId.textContent = id));

  // Register callee handler
  peer.on("call", (mediaConnection) => {
    console.log(peer.id);
    mediaConnection.answer(localStream);

    mediaConnection.on("stream", async (stream) => {
      // Render remote stream for callee
      remoteVideo.srcObject = stream;
      remoteVideo.playsInline = true;
      await remoteVideo.play().catch(console.error);

      timerId = _updateCharts(mediaConnection);
    });

    mediaConnection.once("close", () => {
      remoteVideo.srcObject.getTracks().forEach((track) => track.stop());
      remoteVideo.srcObject = null;

      clearInterval(timerId);
    });

    closeTrigger.addEventListener("click", () => {
      mediaConnection.close(true);

      clearInterval(timerId);
    });
  });

  peer.on("error", console.error);

  async function _updateCharts(mc) {
    const moment = new RTCStatsMoment();
    const peerConnection = await mc.getPeerConnection();
    return setInterval(async () => {
      const stats = await peerConnection.getStats();
      moment.update(stats);
      const report = moment.report();

      for (const [key, chart] of charts) {
        switch (key) {
          case "RECEIVED_TRAFFIC":
            chart.data.datasets[0].data.push({
              t: new Date(),
              y: report.receive.audio.bitrate / 1024, // bps -> Kbps
            });
            chart.data.datasets[1].data.push({
              t: new Date(),
              y: report.receive.video.bitrate / 1024,
            });
            break;
          case "SENT_TRAFFIC":
            chart.data.datasets[0].data.push({
              t: new Date(),
              y: report.send.audio.bitrate / 1024,
            });
            chart.data.datasets[1].data.push({
              t: new Date(),
              y: report.send.video.bitrate / 1024,
            });
            break;
          case "PACKET_LOSS_RATE":
            chart.data.datasets[0].data.push({
              t: new Date(),
              y: report.receive.audio.fractionLost,
            });
            chart.data.datasets[1].data.push({
              t: new Date(),
              y: report.receive.video.fractionLost,
            });
            break;
          case "ROUND_TRIP_TIME":
            chart.data.datasets[0].data.push({
              t: new Date(),
              y: report.send.audio.rtt,
            });
            chart.data.datasets[1].data.push({
              t: new Date(),
              y: report.send.video.rtt,
            });
            chart.data.datasets[2].data.push({
              t: new Date(),
              y: report.candidatePair.rtt,
            });
            break;
          default:
            console.warn("No value!");
            break;
        }
        chart.update();
      }
    }, 5000);
  }
})();
