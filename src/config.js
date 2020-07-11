const defaultConfig = {
  type: "line", // 折れ線チャート
  data: {
    datasets: [],
  },
  options: {
    title: {
      display: true,
    },
    scales: {
      xAxes: [
        {
          type: "realtime", // 横軸はリアルタイム時間軸
          time: {
            unit: "minute", // 1分間隔でグリッドラインを表示
          },
        },
      ],
      yAxes: [
        {
          ticks: {
            beginAtZero: true,
            sampleSize: 5,
          },
        },
      ],
    },
    plugins: {
      streaming: {
        duration: 180000, // 180000ミリ秒（5分）のデータを表示
        refresh: 5000, // 5000ミリ秒でデータを更新
        frameRate: 5, // チャートのfpsは5
      },
    },
  },
};

const RECEIVED_TRAFFIC = deepCopy({}, defaultConfig);
const SENT_TRAFFIC = deepCopy({}, defaultConfig);
const PACKET_LOSS_RATE = deepCopy({}, defaultConfig);
const ROUND_TRIP_TIME = deepCopy({}, defaultConfig);

RECEIVED_TRAFFIC.data.datasets = [
  {
    label: "audio",
    data: [],
    backgroundColor: "rgba(0, 0, 0, 0)",
    borderColor: "rgba(255, 99, 132, 0.5)",
    pointRadius: 1,
  },
  {
    label: "video",
    data: [],
    backgroundColor: "rgba(0, 0, 0, 0)",
    borderColor: "rgba(54, 162, 235, 0.5)",
    pointRadius: 1,
  },
];
RECEIVED_TRAFFIC.options.title.text = "受信ビットレート(Kbps)";

SENT_TRAFFIC.data.datasets = [
  {
    label: "audio",
    data: [],
    backgroundColor: "rgba(0, 0, 0, 0)",
    borderColor: "rgba(255, 99, 132, 0.5)",
    pointRadius: 1,
  },
  {
    label: "video",
    data: [],
    backgroundColor: "rgba(0, 0, 0, 0)",
    borderColor: "rgba(54, 162, 235, 0.5)",
    pointRadius: 1,
  },
];
SENT_TRAFFIC.options.title.text = "送信ビットレート(Kbps)";

PACKET_LOSS_RATE.data.datasets = [
  {
    label: "audio",
    data: [],
    backgroundColor: "rgba(0, 0, 0, 0)",
    borderColor: "rgba(255, 99, 132, 0.5)",
    pointRadius: 1,
  },
  {
    label: "video",
    data: [],
    backgroundColor: "rgba(0, 0, 0, 0)",
    borderColor: "rgba(54, 162, 235, 0.5)",
    pointRadius: 1,
  },
];
PACKET_LOSS_RATE.options.title.text = "パケットロス(%)";

ROUND_TRIP_TIME.data.datasets = [
  {
    label: "audio",
    data: [],
    backgroundColor: "rgba(0, 0, 0, 0)",
    borderColor: "rgba(255, 99, 132, 0.5)",
    pointRadius: 1,
  },
  {
    label: "video",
    data: [],
    backgroundColor: "rgba(0, 0, 0, 0)",
    borderColor: "rgba(54, 162, 235, 0.5)",
    pointRadius: 1,
  },
  {
    label: "STUN",
    data: [],
    backgroundColor: "rgba(0, 0, 0, 0)",
    borderColor: "rgba(54, 254, 125, 0.5)",
    pointRadius: 1,
  },
];
ROUND_TRIP_TIME.options.title.text = "RTT(s)";

export const config = {
  RECEIVED_TRAFFIC,
  SENT_TRAFFIC,
  PACKET_LOSS_RATE,
  ROUND_TRIP_TIME,
};

function deepCopy(src, dst) {
  return Object.assign(src, JSON.parse(JSON.stringify(dst)));
}
