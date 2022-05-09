ARG READ_TOKEN

FROM node:14.17-stretch-slim

# Set Workdir
WORKDIR /var/www/cezoom-tracker

# Copy files to app path
COPY . /var/www/cezoom-tracker

#Install dependencies
RUN apt-get update && \
    apt-get install -y libcurl3 && \ 
    apt-get install -y chromium && \
    apt-get install -y libatk-bridge2.0-0 libgtk-3.0 && \
    apt-get -y install git && \
    git config --global url."https://gitlab-ci-token:Qmuo8VY3ekbJZykpHMNy@gitlab.com/".insteadOf https://gitlab.com/ && \
    npm install

# Copy Enviroment Variables
RUN cp .env.example .env

EXPOSE 4000
CMD [ "node", "src/index.js" ]