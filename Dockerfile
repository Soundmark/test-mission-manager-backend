FROM registry.tsintergy.com/tsintergy-public/node@sha256:365dd7f14b5d0035abfe7ce27012ec3302a4a93e00302bac5f2718c00b0bf520 AS builder
WORKDIR /app
# 拷贝 pnpm deploy 出来的纯净目录
COPY ./isolated/node_modules ./node_modules
COPY ./dist ./dist
RUN ls -al /app/dist/
CMD ["node", "dist/main.js"]
