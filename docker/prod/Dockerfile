# ビルド用
FROM node:20.15.1 AS build

WORKDIR /app

COPY ./package*.json /app

RUN npm install

COPY . .

RUN npm run build

# Production Stage
FROM node:20.15.1-slim

WORKDIR /app

COPY --from=build /app/package*.json /app/
COPY --from=build /app/node_modules /app/node_modules/
COPY --from=build /app/.next /app/.next/

EXPOSE 3000

# Start the Next.js application
CMD ["npm", "start"]

