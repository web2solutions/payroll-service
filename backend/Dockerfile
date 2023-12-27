FROM node:21

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY . .

RUN rm -rf node_modules && rm package-lock.json && rm database.sqlite3

RUN  npm i -g sqlite3 && npm install

EXPOSE 3001 6379

# CMD ["npm", "install"]
