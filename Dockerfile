FROM node:22-alpine as dependencies
WORKDIR /app
COPY package*.json ./
RUN npm ci

FROM node:22-alpine as build
WORKDIR /app
COPY . .
COPY --from=dependencies /app/node_modules ./node_modules
RUN npm run build

FROM node:22-alpine as prod
WORKDIR /app
COPY . ./
COPY --from=build /app/dist ./dist
RUN npm ci --omit-dev
EXPOSE 3000
CMD ["node", "server.js"]
