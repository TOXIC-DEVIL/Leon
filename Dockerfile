FROM node

RUN apt-get update && apt-get install -y
COPY package.json .
RUN npm install
COPY . .
EXPOSE 8080

CMD ["node", "index.js"]
