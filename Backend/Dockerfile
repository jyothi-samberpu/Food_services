FROM node:18-alpine

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install --production

COPY . .

EXPOSE 4000

ENV NODE_ENV=production

CMD ["npm", "start"]
