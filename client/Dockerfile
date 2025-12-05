# client/Dockerfile
# build stage
FROM node:20-alpine AS build
WORKDIR /app
# csak a függőségeket másoljuk először (kevesebb cache törés)
COPY client/package*.json ./
RUN npm ci --silent
COPY client/ .
RUN npm run build -- --configuration=production

# runtime stage - serve with nginx
FROM nginx:stable-alpine
# töröljük az alap nginx tartalmat
RUN rm -rf /usr/share/nginx/html/*
COPY --from=build /app/dist /usr/share/nginx/html
# opcionálisan egy custom nginx conf-ot másolhatsz
COPY nginx/client.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
