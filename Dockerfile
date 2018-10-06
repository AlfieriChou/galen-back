FROM docker.io/node:8.11.4-alpine

RUN mkdir /home/app/
WORKDIR /home/app/
ADD . /home/app/

RUN cd /home/app/ && npm install

EXPOSE 4000

CMD npm start
