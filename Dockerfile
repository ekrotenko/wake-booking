FROM node:carbon
MAINTAINER Eugene Krotenko <ekrotenko.ua@gmail.com>

WORKDIR /wake.booking

RUN npm install -g -q nodemon

CMD npm install -q --no-progress && \
    npm start
