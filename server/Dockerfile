FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3001

ENV NODE_ENV=production
ENV PORT=3001

# Run seed script first, then start server
CMD ["sh", "-c", "node seedExercises.js && node seedEquipment.js && node index.js"]
