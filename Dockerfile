FROM node:22-alpine AS frontend-build

WORKDIR /app

RUN corepack enable && corepack prepare yarn@1.22.22 --activate

COPY mimawiki_frontend/package.json mimawiki_frontend/yarn.lock ./
RUN yarn install --frozen-lockfile --network-timeout 600000

COPY mimawiki_frontend/ ./
RUN yarn build

FROM node:22-alpine AS backend-build

WORKDIR /app

RUN corepack enable && corepack prepare yarn@1.22.22 --activate

COPY mimawiki_backend/package.json mimawiki_backend/yarn.lock ./
RUN yarn install --frozen-lockfile --network-timeout 600000

COPY mimawiki_backend/ ./
RUN yarn build
RUN yarn install --frozen-lockfile --production=true --network-timeout 600000

FROM node:22-alpine

RUN apk add --no-cache nginx

WORKDIR /app/backend

COPY deploy/nginx.conf /etc/nginx/http.d/default.conf
COPY --from=frontend-build /app/dist /usr/share/nginx/html
COPY --from=backend-build /app/dist ./dist
COPY --from=backend-build /app/node_modules ./node_modules
COPY --from=backend-build /app/package.json ./package.json

EXPOSE 3000

CMD ["sh", "-c", "PORT=3001 node /app/backend/dist/main.js & nginx -g 'daemon off;'"]
