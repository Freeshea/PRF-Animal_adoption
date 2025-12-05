# -----------------------
# 1. Stage – Angular build
# -----------------------
FROM node:20 AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

RUN npm run build --prod


# -----------------------
# 2. Stage – Nginx serve
# -----------------------
FROM nginx:alpine

# Angular build kimenete → nginx/html mappába
COPY --from=build /app/dist/client/browser /usr/share/nginx/html

# Custom nginx config (később létrehozzuk)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
