# next.config.js has always set `output: 'standalone'`, but the previous build
# deleted .next/standalone and shipped `next start` with the full production
# node_modules instead. This uses the standalone bundle it was already
# producing: a much smaller image, which on a single-node home cluster is the
# difference between a rollout that takes seconds and one that takes minutes.

FROM --platform=linux/amd64 node:24-alpine AS deps
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile && yarn cache clean

FROM --platform=linux/amd64 node:24-alpine AS build
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN yarn build

# next/image is used in three pages, and Next's optimizer needs sharp at
# runtime. Standalone output only contains what file tracing found, so assert
# it landed rather than discovering it as a 500 on the first optimized image.
RUN test -d .next/standalone/node_modules/sharp \
  || { echo "ERROR: sharp missing from standalone output."; \
       echo "Add it via outputFileTracingIncludes in next.config.js."; exit 1; }

FROM --platform=linux/amd64 node:24-alpine AS production
WORKDIR /app

ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0

# 1001:1001 matches the runAsUser/runAsGroup that charts/web applies in the
# gitops repo; a mismatch there fails the pod, not the build.
RUN addgroup -g 1001 -S nodejs && adduser -u 1001 -S nextjs -G nodejs

# standalone ships its own minimal node_modules and server.js. static/ and
# public/ are not traced, so they are copied alongside.
COPY --from=build --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=build --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=build --chown=nextjs:nodejs /app/public ./public

USER nextjs
EXPOSE 3000

CMD ["node", "server.js"]
