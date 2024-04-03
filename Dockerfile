##
# Production Dockerfile
##

###
# Base image declaration
###
FROM node:18.10-alpine AS base

ENV APPDIR /app

ARG PG_HOST
ENV PG_HOST ${PG_HOST}

ENV PG_DATABASE postgres
ENV PG_USER postgres

ARG PG_PASS
ENV PG_PASS ${PG_PASS}

ENV PG_PORT 5432
ENV PG_SSLMODE require 
ENV SERVER_PORT 8080

WORKDIR ${APPDIR}/shared

COPY shared/package*.json ./
RUN npm ci

COPY shared ./
RUN npm run build

###
# Client build stage
###
FROM base AS client-build

WORKDIR ${APPDIR}/client

COPY client/package*.json ./
RUN npm ci

COPY client ./
RUN npm run build

###
# Server build stage
###
FROM base AS server-build

WORKDIR ${APPDIR}/server

COPY server/package*.json ./
RUN npm ci

COPY server ./
RUN npm run build
RUN rm -r src

###
# Main image build
###
FROM base AS main

WORKDIR ${APPDIR}/server

COPY --from=server-build ${APPDIR}/server ./
COPY --from=client-build ${APPDIR}/client/dist ./static

EXPOSE 8080

ENV TZ=Europe/Helsinki
ENV NODE_ENV production

CMD npm run db-migrate:prod && npm start
