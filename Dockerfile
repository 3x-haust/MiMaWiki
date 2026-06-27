FROM node:22-alpine AS build

WORKDIR /app

RUN corepack enable && corepack prepare yarn@1.22.22 --activate

COPY mimawiki_frontend/package.json mimawiki_frontend/yarn.lock ./
RUN yarn install --frozen-lockfile

COPY mimawiki_frontend/ ./
RUN yarn build

FROM nginx:1.27-alpine

COPY deploy/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 3000

CMD ["nginx", "-g", "daemon off;"]
