# -----------------------
# 1. STAGE – Build
# -----------------------
FROM node:20 AS build

WORKDIR /app

# Dependency file-ok bemásolása
COPY package*.json ./
COPY tsconfig.json ./

# Dependencies telepítése
RUN npm install

# Teljes source bemásolása
COPY . .

# Typescript build → build/ mappába
RUN npm run build


# -----------------------
# 2. STAGE – Production
# -----------------------
FROM node:20-bullseye

WORKDIR /app

# Csak a szükséges fájlok copy
COPY --from=build /app/build ./build
COPY --from=build /app/node_modules ./node_modules
COPY package.json ./

EXPOSE 5000

CMD ["node", "build/src/index.js"]
