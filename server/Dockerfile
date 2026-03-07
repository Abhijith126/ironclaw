FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3001

ENV NODE_ENV=production
ENV PORT=3001

# Server auto-seeds on startup if database is empty
CMD ["node", "index.js"]
