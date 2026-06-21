# Yo Frontend

大学生向け友達マッチングアプリ「Yo」のフロントエンドです。

## 必要な環境
- Node.js 18 以上
- yo-backend が localhost:3000 で起動していること

## セットアップ

```bash
git clone https://github.com/step-futoukou/yo-frontend.git
cd yo-frontend
npm install
npm run dev
```

ブラウザで http://localhost:5173 を開いてください。

## バックエンドの起動（別ターミナルで）

```bash
git clone https://github.com/step-futoukou/yo-backend.git
cd yo-backend
npm install
node server.js
```

## 画面一覧

| 画面 | ファイル | 接続API |
|------|---------|---------|
| ユーザー登録 | src/screens/Register.jsx | POST /api/users |
| ホーム・マッチング | src/screens/Home.jsx | POST /api/matching/find |
| 待ち合わせ調整 | src/screens/Meeting.jsx | /api/meetings/* |
| ミッション | src/screens/Mission.jsx | /api/meetings/:id/confirm |
| 事後レビュー | src/screens/Review.jsx | POST /api/reviews |

## API共通ファイル

src/api.js にすべてのAPI呼び出し関数をまとめています。
バックエンドのURLは BASE_URL で管理しています。

本番環境では .env ファイルを作成してください：

```
VITE_API_URL=https://your-backend-url.com/api
```

api.js の BASE_URL は以下のように環境変数対応になっています：

```js
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
```

## フォルダ構成

```
src/
├── api.js          # API共通関数
├── App.jsx         # 画面遷移管理
├── main.jsx        # エントリーポイント
└── screens/
    ├── Register.jsx
    ├── Home.jsx
    ├── Meeting.jsx
    ├── Mission.jsx
    └── Review.jsx
```

## 今後の開発

- [ ] React Native への移行
- [ ] Firebase FCM によるプッシュ通知
- [ ] プロフィール編集画面の接続
- [ ] デプロイ（Vercel / Netlify 推奨）
