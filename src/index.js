const fs = require('fs');
const path = require('path');

const { fetchLatest } = require('./utils/fetch-latest-api');
const { fetchTimeseries } = require('./utils/fetch-china-timeseries');
const logger = require('./utils/create-logger');

try {
  (function createDirectories () {
    const distTargetDirectory = path.resolve(process.cwd(), './dist');
    const logsTargetDirectory = path.resolve(process.cwd(), './logs');

    const allDirs = [distTargetDirectory, logsTargetDirectory];

    allDirs.forEach((target) => {
      if (!fs.existsSync(target)) {
        fs.mkdir(target, { recursive: true }, (err) => {
          if (err) throw err;
        });
      }
    });
  })();

  fetchLatest();
  fetchTimeseries();
} catch (e) {
  logger.log({
    level: 'error',
    message: `top level - exception ${e}`
  });
};
