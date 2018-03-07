FROM node:latest

RUN mkdir -p /opt/app

ENV APP=/opt/app

ENV npm_config_tmp=/tmp

WORKDIR $APP

ADD package.json $APP/

RUN npm install --global webpack

RUN rm -rf node_modules && npm cache verify && rm -rf ~/tmp/*

ADD . $APP

RUN npm install
