FROM node:18-alpine3.17 AS builder
WORKDIR /usr/src/app
COPY . ./
RUN npm install -g pnpm && \
    pnpm i && \
    pnpm build:all
# RUN nx reset 
# RUN pnpm build:all

# Install dependencies only when needed
FROM node:18-alpine3.17 AS deps
WORKDIR /usr/src/app
COPY --from=builder /usr/src/app/dist/apps/rahat-ui/package.json ./
# COPY .npmrc ./
RUN yarn install --production && \
    yarn cache clean

FROM node:18-alpine3.17 AS runner
USER node
WORKDIR /usr/src/app
COPY --chown=node:node --from=builder /usr/src/app/dist/apps/rahat-ui/ ./
COPY --chown=node:node --from=deps /usr/src/app/node_modules ./node_modules
CMD [ "npm", "start" ]