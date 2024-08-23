FROM node:20-alpine

RUN apk update && apk add git
COPY package.json .
RUN npm install
COPY . .
EXPOSE 8080

CMD ["node", "index.js"]
