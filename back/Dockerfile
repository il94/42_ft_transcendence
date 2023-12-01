FROM node:16

WORKDIR /app

COPY package*.json ./
COPY prisma ./

RUN npm install

COPY . .

RUN npm run build

#RUN npx prisma migrate dev

CMD [ "npm", "run", "start:migrate:dev" ]
