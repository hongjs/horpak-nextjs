FROM node:16-alpine

WORKDIR /homes/app
COPY package.json .
COPY yarn.lock .
RUN yarn
COPY . .
RUN yarn build
RUN rm -f ./.env*

CMD ["yarn", "start"]