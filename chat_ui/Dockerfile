# Build stage (use Node 22)
FROM node:22-alpine as build

WORKDIR /app
RUN npm install -g npm@11.12.1

COPY package*.json ./
RUN npm install
RUN npm audit fix --force
RUN npm i

COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html

COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh
EXPOSE 80 

ENTRYPOINT ["/entrypoint.sh"]
