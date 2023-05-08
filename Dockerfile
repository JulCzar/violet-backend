FROM node:18.15-alpine3.16 as builder

ARG DATABASE_URL
ENV DATABASE_URL=$DATABASE_URL

WORKDIR /app

COPY . .

RUN yarn install
RUN yarn build

EXPOSE 8000

CMD ["yarn", "start"]