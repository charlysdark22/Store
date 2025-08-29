# Dockerfile para Tech Store Cuba
FROM node:18-alpine

# Crear directorio de trabajo
WORKDIR /app

# Copiar package.json files
COPY package*.json ./
COPY client/package*.json ./client/

# Instalar dependencias del backend
RUN npm ci --only=production

# Instalar dependencias del frontend
WORKDIR /app/client
RUN npm ci --only=production

# Volver al directorio principal
WORKDIR /app

# Copiar código fuente
COPY . .

# Construir el frontend
RUN npm run build

# Crear directorios necesarios
RUN mkdir -p uploads/products uploads/reviews/images uploads/reviews/videos

# Exponer puerto
EXPOSE 10000

# Variables de entorno por defecto
ENV NODE_ENV=production
ENV PORT=10000

# Comando para iniciar la aplicación
CMD ["npm", "start"]