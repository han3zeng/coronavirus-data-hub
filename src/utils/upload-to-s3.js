const AWS = require('aws-sdk');
const fs = require('fs');
const path = require('path');
const BUCKET_NAME = 'tpts-public';
const logger = require('./create-logger');

const s3 = new AWS.S3({
  accessKeyId: '',
  secretAccessKey: ''
});

const targets = [
  {
    fileName: 'china-coronavirus-timeseries.json',
    path: path.resolve(__dirname, '../../dist/china-coronavirus-timeseries.json')
  },
  {
    fileName: 'latest-coronavirus-stats.json',
    path: path.resolve(__dirname, '../../dist/latest-coronavirus-stats.json')
  }
];

const uploadFile = (targets) => {
  targets.forEach((target, index) => {
    const { fileName, path } = target;
    const fileContent = fs.readFileSync(path);
    const params = {
      Bucket: BUCKET_NAME,
      Key: fileName,
      Body: fileContent,
      ContentType: 'application/json',
      ACL: 'public-read'
    };
    s3.putObject(params, function (err, data) {
      if (err) {
        logger.log({
          level: 'error',
          message: `fail to upload file - erroe messae: ${err}`
        });
      }
      logger.log({
        level: 'info',
        message: `File uploaded successfully. Etag: ${data.ETag}. file: ${fileName}`
      });
    });
  });
};

uploadFile(targets);
