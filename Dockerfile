# Gunakan Node.js versi 20 berbasis Debian agar kompatibel dengan Prisma + OpenSSL
FROM node:20-bullseye

# Set working directory
WORKDIR /app

# Copy file package.json dan package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy semua file project
COPY . .

# Generate Prisma Client dan jalankan migrasi ke database
RUN npx prisma generate
RUN npx prisma migrate deploy

# Expose port untuk aplikasi
EXPOSE 8000

# Jalankan aplikasi
CMD ["npm", "start"]
