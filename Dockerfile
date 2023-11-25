FROM node:18.18.0

WORKDIR /js-consumer

COPY package.json .
COPY package-lock.json .
RUN npm ci

COPY . .

EXPOSE 4000

CMD ["npm", "start"]