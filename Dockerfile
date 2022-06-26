FROM node:16-alpine AS builder
WORKDIR /app

COPY . .
RUN npm install --prefix ./server
RUN npm install --prefix ./client
RUN npm run build --prefix ./client

FROM nginx:alpine

RUN apk update && apk add bash
RUN apk add nodejs npm
RUN npm i -g pm2

COPY ./nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=builder /app/server/ ./
COPY --from=builder /app/client/build /usr/share/nginx/html


ARG ADMIN_ADDRESS
RUN env
ARG ALLOWED_CLIENTS
ARG MONGO_URI
ARG FRONTEND_SECRET
ARG LIVE_MINT_CONTRACT_ADDRESS
ARG ALCHEMY_API
RUN env

ENV ADMIN_ADDRESS=$ADMIN_ADDRESS
ENV ALLOWED_CLIENTS=$ALLOWED_CLIENTS
ENV MONGO_URI=$MONGO_URI
ENV FRONTEND_SECRET=$FRONTEND_SECRET
ENV LIVE_MINT_CONTRACT_ADDRESS=$LIVE_MINT_CONTRACT_ADDRESS
ENV ALCHEMY_API=$ALCHEMY_API

EXPOSE 80

CMD bash -c "nginx -g 'daemon off;' | pm2 start server.js"

