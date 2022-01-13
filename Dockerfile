FROM node:16

WORKDIR /usr/src/app

ENV NODE_ENV=production

COPY . .
RUN npm install

EXPOSE 5500
CMD [ "node", "src/app.js"]