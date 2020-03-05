#!/bin/sh
nodePath=~/.nvm/versions/node/v13.9.0/bin/node
cd /home/ec2-user/code/coronavirus-data-hub
$nodePath /home/ec2-user/code/coronavirus-data-hub/src/index.js && $nodePath /home/ec2-user/code/coronavirus-data-hub/src/utils/upload-to-s3.js
