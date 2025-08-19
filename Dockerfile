FROM node:20-alpine AS builder

USER root

WORKDIR /app

RUN corepack enable

COPY . .

RUN pnpm install --frozen-lockfile && pnpm run build

FROM nginx:1.23.1-alpine AS server

WORKDIR /etc/nginx/html

RUN rm -rf ./*

COPY ./nginx.conf /etc/nginx/nginx.conf

COPY --from=builder /app/dist .

EXPOSE 80

ENTRYPOINT ["nginx", "-g", "daemon off;"]