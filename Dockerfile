FROM node:12.10.0-alpine as builder

ENV NODE_ENV=production

WORKDIR /app

COPY package*.json yarn.lock ./
RUN yarn install
COPY . .
RUN yarn run build

# production stage
FROM nginx:1.17.3-alpine as serve
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
