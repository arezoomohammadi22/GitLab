FROM node:14

WORKDIR /app

COPY app/package*.json ./
RUN npm install

COPY app/ .

EXPOSE 8080

CMD ["npm", "start"]
