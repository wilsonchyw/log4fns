FROM node:19-slim
WORKDIR /app
COPY package.json ./
RUN npm install
RUN npm i -g nodemon