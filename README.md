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
バックエンドのURLは環境変数 `VITE_API_BASE_URL` で管理します（コードに直書きしない）。

```js
// /api は api.js が自動付与する。VITE_API_BASE_URL には /api を含めない。
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
const BASE_URL = `${API_BASE_URL}/api`;
```

- 開発時: 未設定なら `http://localhost:3000` にフォールバック（設定不要）。
- ローカルで上書きしたい場合は `.env.example` をコピーして `.env` を作成。
  `.env` は Git 管理外（`.gitignore` 済み）。

```bash
cp .env.example .env
```

## ビルド

```bash
npm run build      # dist/ に静的ファイルを生成
npm run preview    # 生成物をローカル確認
```

## Render へのデプロイ（Static Site）

フロントは Render の **Static Site** としてデプロイします（APIは別リポジトリの Web Service）。

1. 先に `yo-backend` を Web Service としてデプロイし、公開URL（例 `https://yo-backend.onrender.com`）を控える。
2. Render で **New + → Static Site** を選び、`yo-frontend` リポジトリを接続。
3. 設定:
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
4. **Environment Variables** に以下を設定（`/api` は付けない）:

   | Key | Value（例） |
   |---|---|
   | `VITE_API_BASE_URL` | `https://yo-backend.onrender.com` |

   > Vite の環境変数はビルド時に埋め込まれる。変更したら再デプロイが必要。
5. デプロイ後の公開URL（例 `https://yo-frontend.onrender.com`）を、
   バックエンドの `CORS_ORIGIN` に設定して再デプロイする。

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
- [x] デプロイ（Render Static Site）
