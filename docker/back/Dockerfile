FROM node:12-alpine

RUN apk add --update \
    python make g++

RUN mkdir -p /app

COPY ./ /app

WORKDIR /app

RUN rm -Rf .git

RUN rm -Rf node_modules

RUN npm i

FROM node:12-alpine
RUN mkdir -p /app
COPY --from=0 /app /app
WORKDIR /app

ENV ENV=production
ENV NODE_ENV=production

EXPOSE 3000

ENTRYPOINT [ "sh", "/app/core-docker/back/docker-entrypoint.sh" ]