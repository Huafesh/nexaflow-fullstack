FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Vite usa el puerto 5173 por defecto, pero configuramos para exponer
EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host"]
