# 1. Build Base
FROM --platform=linux/amd64 node:24-alpine as BASE

WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile && yarn cache clean

# 2. Build Image
FROM --platform=linux/amd64 node:24-alpine as BUILD
WORKDIR /app
COPY --from=BASE /app/node_modules ./node_modules
COPY . .

RUN yarn add --dev typescript @types/node
RUN yarn build
RUN rm -rf node_modules
RUN yarn install --production --frozen-lockfile --ignore-scripts --prefer-offline
## prune dependencies to reduct node_modules size.
RUN apk --no-cache add curl
RUN curl -sf https://gobinaries.com/tj/node-prune | sh
RUN node-prune

## re-install required packages after node-prune
RUN yarn add googleapis@^107.0.0
RUN yarn add sharp@^0.31.3


# 3. Build Production
FROM --platform=linux/amd64 node:24-alpine AS PRODUCTION
WORKDIR /app

COPY --from=BUILD /app/package.json /app/yarn.lock ./
COPY --from=BUILD /app/node_modules ./node_modules
COPY --from=BUILD /app/.next ./.next
COPY --from=BUILD /app/public ./public
COPY --from=BUILD /app/next.config.js ./next.config.js
RUN rm -rf .next/standalone

EXPOSE 3000

CMD ["yarn", "start", "-p", "3000"]