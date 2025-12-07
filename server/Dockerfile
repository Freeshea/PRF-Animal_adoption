# 1. STAGE – Build
FROM node:20 AS build
WORKDIR /app

# Copy dependencies 
COPY package*.json ./
COPY tsconfig.json ./

RUN npm install

# Copy all
COPY . .

RUN npm run build

# 2. STAGE – Production
# Alpine is too light, bcrypt needed for login auth
FROM node:20-bullseye

WORKDIR /app

COPY --from=build /app/build ./build
COPY --from=build /app/node_modules ./node_modules
COPY package.json ./

EXPOSE 5000

CMD ["node", "build/src/index.js"]
