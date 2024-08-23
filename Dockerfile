FROM node

RUN apt-get update
COPY package.json .
RUN npm install
COPY . .
EXPOSE 8080

CMD ["node", "index.js"]
