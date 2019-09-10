FROM node:8.16.1-alpine

WORKDIR /app

COPY package*.json ./

RUN yarn install && yarn add http-server

ENV NODE_ENV=production

COPY . .

COPY entrypoint.sh /

RUN && yarn run build

EXPOSE 8082

ENTRYPOINT ["/entrypoint.sh"]

CMD ["http-server", "dist", "-p", "8082"]
