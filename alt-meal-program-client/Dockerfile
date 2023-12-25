FROM node:14 as build

COPY build .

RUN npm install -g serve

EXPOSE 3000

CMD serve -s build
