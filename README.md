# receipt-scanner

## アプリ名

家計簿くん<br>

## 概要

レシート画像から家計簿を作成し、予算と出費を月毎に管理するアプリ

## 何のために作られたか

社会人となり一人暮らしを始めてから日々の出費に使うお金が増え、どのくらい出費したかを把握したいと思ったことがきっかけ<br>
初めは Google スプレッドシートを使用して家計簿を作成していたが、毎回表に木の句するのがめんどくさくなり、レシートの画像から家計簿を作成できたらいいのにと考えこのアプリを作成した。

## 技術スタック

| 技術                                                                        | バージョン                      | 用途                                   |
| --------------------------------------------------------------------------- | ------------------------------- | -------------------------------------- |
| [**Node.js**](https://nodejs.org/en/)                                       | v22.9.0                         | Javascript の実行環境                  |
| [**npm**](https://www.npmjs.com/)                                           | 10.8.3                          | Node.js のパッケージを管理する         |
| [**Next.js**](https://nextjs.org/)                                          | 14.2.13                         | React ベースのフレームワーク           |
| [**React**](https://ja.react.dev/)                                          | ^18                             | UI 構築ライブラリ                      |
| [**TypeScript**](https://www.typescriptlang.org/)                           | ^5                              | 型定義付き JavaScript                  |
| [**Prisma**](https://www.prisma.io/)                                        | ^5.19.1 (CLI), ^5.21.1 (Client) | データベース ORM ツール                |
| [**NextAuth.js**](https://next-auth.js.org/)                                | ^5.0.0-beta.25                  | 認証機能                               |
| [**@mui/material**](https://mui.com/)                                       | ^6.1.1                          | マテリアルデザインの UI コンポーネント |
| [**Day.js**](https://github.com/iamkun/dayjs/blob/dev/docs/ja/README-ja.md) | ^1.11.13                        | 日付操作ライブラリ                     |
| [**AWS SDK for JavaScript**](https://aws.amazon.com/jp/sdk-for-javascript/) | ^3.675.0                        | S3 などの AWS サービスとの連携         |
| [**Faker.js**](https://fakerjs.dev/)                                        | ^9.0.2                          | ダミーデータ生成ツール                 |

## 必要条件

- npm を使用した環境設定

  - 以下のコマンドで必要な環境を設定する
    `npm install`

- aws アカウントを作成し、IAM ユーザーを作成する
  - 作者は`AdministratorAccess`と`AWSCompromisedKeyQuarantineV3`をポリシーとして割り当てているが、S3 からデータのダウンロードとアップ絵オードができるポリシーがあれば良い。
  - S3 に`receipt-scanner`というバケットを作成し、[こちら](https://github.com/AyumuOgasawara/receipt-scanner-model/issues/28#issuecomment-2419930774)を参考にバケットポリシーを作成する。
- Google OAuth の設定
  - [こちら](https://next-auth.js.org/providers/google)を参考に`OAuth 2.0 クライアント ID`を作成し、以下を設定する
    - 承認済みの JavaScript 生成元：
      - 開発環境：http://localhost:3000
      - 本番環境：http://{YOUR_DOMAIN}
    - 承認済みのリダイレクト URI
      - 開発環境：http://localhost:3000/api/auth/callback/google
      - 本番環境：https://{YOUR_DOMAIN}/api/auth/callback/google
- 環境変数の設定<br>
  .env.default を参考に.env に設定する<br>
  | 環境変数 | 用途 |
  | ------------ | ------- |
  | DATABASE_URL | prisma と DB との連携 |
  | AWS_ACCESS_KEY_ID | IAM ユーザーの Access key ID |
  | AWS_SECRET_ACCESS_KEY | IAM ユーザーの Secret access key |
  | AUTH_GOOGLE_ID |　 OAuth 2.0 クライアントのクライアント ID |
  | AUTH_GOOGLE_SECRET |　 OAuth 2.0 クライアントのクライアント シークレット|
  | AUTH_SECRET |　 JWT をエンコードし、転送中のデータを暗号化するために使用される |
  | AUTH_TRUST_HOST | Auth の信頼されたホスト |
  | NEXTAUTH_URL | サイトの正規 URL|
  | PYTHON_API_SERVER | receipt-scanner-model のデプロイ url |

## 実行方法

- postgres を立ち上げる

  ```sh
  docker-compose -f docker/dev/compose.yml up
  ```

- レシートを解析する API を実行する<br>
  [こちら](https://github.com/AyumuOgasawara/receipt-scanner-model)を参考に`receipt-scanner-model`を立ち上げる

- prisma のマイグレーションと seeding を行う

  - schema.prisma ファイルのモデルを変更した際に、migration ファイルを生成せずにテーブルを変更する([詳細](https://www.prisma.io/docs/orm/prisma-migrate/workflows/prototyping-your-schema))
    ```sh
    npx prisma db push
    ```

  -　 seeding を行う([詳細](https://www.prisma.io/docs/orm/prisma-migrate/workflows/seeding))<br>
  予算などの seeding も行う場合は環境変数に`NODE_ENV=development`を追加する

  ```sh
  npx prisma db seed
  ```

  - seeding が成功しているかの確認
    ```sh
    npx prisma studio
    ```

- 以下のコマンドで実行することができる。<br>
  ```sh
  npm run dev
  ```

### ビルド方法

- 以下のコマンドでビルドすることができる<br>
  ```sh
  npm run build
  ```

### ビルドイメージの実行方法

- 以下のコマンドでビルドすることができる<br>
  ```
  npm run start
  ```

## ディレクトリ構成

```
receipt-scanner/
├── .next/
├── architecture/：設計に関するディレクトリ
├── docker/：Dockerに関連するディレクトリ
├── node_modules/
├── prisma/
│   ├── migrations/：マイグレーションファイルのディレクトリ
│   ├── schema.prisma：スキーマ
│   └── seed.ts：シーディングファイル
├── public/
├── src/
│   ├── _components/
│   │   ├── common/：共通で使用できるコンポーネント
│   │   ├── features/：各ページ特有のコンポーネント
│   │   └── layouts/：レイアウトに関するコンポーネント
│   ├── app/
│   │   ├── _actions/：サーバーアクション
│   │   ├── api/：Auth用のAPIディレクトリ
│   │   └── {page}/
│   │       └── page.tsx
│   ├── lib/
│   ├── utils/
│   ├── auth.ts
│   ├── middleware.ts
│   └── route.ts
├── .env
├── .env.default
├── .gitignore
├── package-lock.json
├── package.json
└── README.md
```

## デモ動画(なぜか解析が動いていないのでし今後修正する)

ログインから基本操作<br>
![2024-11-258 20 52-ezgif com-video-to-gif-converter](https://github.com/user-attachments/assets/7b8edf5f-2e04-48bd-953b-942a74e85b71)

出費が予算を超えた場合<br>
![2024-11-258 22 18-ezgif com-video-to-gif-converter](https://github.com/user-attachments/assets/9aa74aaf-9f9c-40a6-986b-b91ce79bfee1)

レシート解析<br>
![378206844-e742ff6f-6e27-412e-a441-c9df796cb38a-ezgif com-video-to-gif-converter](https://github.com/user-attachments/assets/839a25bb-14d2-4795-8cee-412a4bc69fd8)

