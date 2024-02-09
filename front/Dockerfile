FROM node:latest

WORKDIR /app

COPY package*.json ./

RUN npm install --force

COPY . .

# RUN npm run build

CMD ["npm", "run", "dev"]