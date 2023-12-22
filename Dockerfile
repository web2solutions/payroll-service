FROM node:18.8.0

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY . .

RUN node -v && rm -rf node_modules && npm install --ignore-scripts


EXPOSE 3000 3001

# CMD ["npm", "install"]
