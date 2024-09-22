# receipt-scanner
レシートの写真から家計簿を生成してくれるアプリ

## マイグレーションの方法
`prisma`で`env.local`を参照できるように、以下のコマンドを実行<br>
`./node_modules/.bin/dotenv -e .env.local -- npx prisma migrate dev`