# Base Stage
FROM node:20.15.1-alpine AS base

# Dependencies Stage - 依存関係のインストール
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# package.jsonとpackage-lock.jsonをコピー
COPY package*.json ./
# 全ての依存関係をインストール（devDependenciesを含む）
RUN npm ci && npm cache clean --force

# Builder Stage - アプリケーションのビルド
FROM base AS builder
WORKDIR /app

# depsステージからnode_modulesをコピー（キャッシュ最適化）
COPY --from=deps /app/node_modules ./node_modules

# ソースコードをコピー
COPY . .

# Prismaクライアントを生成
RUN npx prisma generate

# Next.jsアプリケーションをビルド
# 環境変数はビルド時に必要に応じて渡す
RUN npm run build

# Runner Stage - 本番環境で実行
FROM base AS runner
WORKDIR /app

# セキュリティのため非rootユーザーを作成
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# 必要なファイルのみをコピー
COPY --from=builder /app/next.config.mjs ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json

# Next.jsの静的ファイルをコピー（適切な権限で）
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Prismaの関連ファイルをコピー
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

# Prisma CLIをコピー（マイグレーション実行に必要）
COPY --from=builder /app/node_modules/.bin ./node_modules/.bin
COPY --from=builder /app/node_modules/prisma ./node_modules/prisma

# エントリーポイントスクリプトをコピー
COPY docker/prod/entrypoint.sh ./
RUN chmod +x entrypoint.sh

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV NODE_ENV=production
ENV HOSTNAME="0.0.0.0"

# エントリーポイントスクリプトで起動
ENTRYPOINT ["/app/entrypoint.sh"]
