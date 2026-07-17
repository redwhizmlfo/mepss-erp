# Etapa de construcción
FROM node:22-alpine AS builder

WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el código fuente y prisma
COPY prisma ./prisma/
COPY tsconfig.json ./
COPY src ./src/

# Generar cliente de Prisma
RUN npx prisma generate

# Compilar TypeScript
RUN npm run build

# Etapa de producción
FROM node:22-alpine AS runner

WORKDIR /app

# Establecer entorno de producción
ENV NODE_ENV=production

# Copiar dependencias de producción y build
COPY package*.json ./
RUN npm install --omit=dev

# Copiar build, prisma y archivos necesarios
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

# Exponer el puerto
EXPOSE ${PORT:-4000}

# Comando de inicio real de producción
CMD ["npm", "run", "start"]
