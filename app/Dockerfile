FROM node:16-alpine

WORKDIR /homes/app
COPY package.json .
COPY yarn.lock .
RUN yarn
COPY . .
RUN yarn build

CMD ["yarn", "start"]