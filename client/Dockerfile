# 1. Stage – Angular build
FROM node:20 AS build
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

RUN npm run build --prod


# 2. Stage – Nginx serve
FROM nginx:alpine

# Angular build result to nginx folder
COPY --from=build /app/dist/client/browser /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
