#!/bin/bash

sudo pm2 stop  scorecard-3006


# start server
cd /home/ec2-user/igp-scorecard-api
sudo pm2 start src/index.js --name scorecard-3006