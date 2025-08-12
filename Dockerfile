FROM node:20-bullseye

WORKDIR /app
ENV NODE_ENV=production     PORT=3000

RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
RUN npm install --omit=dev

COPY . .

EXPOSE 3000
CMD npx prisma migrate deploy && node server.js
