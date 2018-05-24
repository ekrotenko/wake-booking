FROM node:carbon
MAINTAINER Eugene Krotenko <ekrotenko.ua@gmail.com>

WORKDIR /wake.booking

ADD . /wake.booking

RUN npm install sequelize-cli

CMD npm install -q --no-progress && \
    npm run migrate && \
    npm start
