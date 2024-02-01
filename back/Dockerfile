FROM node:16

WORKDIR /app

COPY package*.json ./

RUN npm install
RUN npm install -g prisma

COPY . .

COPY ./start.sh /usr/local/bin
RUN chmod +x /usr/local/bin/start.sh

RUN prisma generate

RUN npm run build

ENTRYPOINT ["start.sh"]
