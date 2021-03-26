FROM node:12-alpine
COPY ./register /srv/ws/
ARG CACHE_SERVER_VERSION=6.4.0

LABEL org.label-schema.version=${CACHE_SERVER_VERSION}

RUN apk add --no-cache dumb-init
RUN npm install
RUN npm install pm2 -g

WORKDIR /srv/ws

COPY entrypoint.sh entrypoint.sh

RUN npm i -g unity-cache-server@${CACHE_SERVER_VERSION}

VOLUME [ "/srv/ws/cache" ]
EXPOSE 8126
ENTRYPOINT [ "sh", "/srv/ws/entrypoint.sh" ]
CMD [ "unity-cache-server" ]
