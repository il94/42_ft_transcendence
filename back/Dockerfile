FROM node:16

WORKDIR /app

COPY package*.json ./
COPY prisma ./

RUN npm install

COPY . .

#RUN npm run build

COPY ./start.sh /usr/local/bin
RUN chmod +x /usr/local/bin/start.sh

ENTRYPOINT ["bash", "start.sh"]
