FROM node:18-alpine AS build-stage

RUN npm i -g pnpm
RUN corepack enable

WORKDIR /wish-tree

COPY . .

RUN : \
  && pnpm fetch \
  && pnpm i -r --offline --frozen-lockfile \
  && pnpm api:build \
  && pnpm app:build \
  && pnpm prune --prod \
  ;

CMD ["pnpm", "api:start:prod"]
EXPOSE 7000
