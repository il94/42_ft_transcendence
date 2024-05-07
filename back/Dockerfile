FROM node:lts

WORKDIR /app

COPY package*.json ./

RUN npm install

RUN npm install -g npm@10.4.0 prisma

COPY . .

COPY ./start.sh /usr/local/bin
RUN chmod +x /usr/local/bin/start.sh

ENTRYPOINT ["start.sh"]
