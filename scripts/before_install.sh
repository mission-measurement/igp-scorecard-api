#!/bin/bash

# update server
#yum update -y
# get node into yum
#curl --silent --location https://rpm.nodesource.com/setup_6.x | bash -
# install node and npm in one line
#yum install -y nodejs

# install pm2 to restart node app
#npm i -g pm2
cd /home/ec2-user/igp-scorecard-api
sudo npm i -g puppeteer --unsafe-perm=true