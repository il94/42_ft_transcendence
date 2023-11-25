FROM node:16

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/

RUN npm install

COPY . .

RUN npm run build

CMD [ "npm", "run", "start:migrate:dev" ]
