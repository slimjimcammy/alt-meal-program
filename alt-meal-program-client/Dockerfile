FROM node:14 as build

WORKDIR /alt-meal-program-client

RUN npm run build

EXPOSE 3000

CMD ["serve", "-s", "build"]
