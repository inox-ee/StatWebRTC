# JavaScript SPA(?) Templete

**HTML**, **JavaScript** で簡単な静的サイトを作りたいときのテンプレート。

## Netlify(<https://www.netlify.com/>)へのデプロイ

一瞬で終わる

1. `Continuous Deployment` で **Git** を選択
2. `Basic build setting` を以下のように設定

- Build command

```
yarn build
```

- Publish directory

```
public
```

