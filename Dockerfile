FROM node:19-alpine3.15 AS builder
WORKDIR /usr/src/app
COPY package*.json ./
# RUN npm install
RUN npm ci --only=production
COPY . .
CMD ["node", "src/index.js"]