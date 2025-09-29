FROM node:20.19.4-slim
LABEL org.opencontainers.image.source=https://github.com/BroMineCorp/PaladiumClickerNextJS

WORKDIR /app

COPY . .
RUN npm ci


RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]
