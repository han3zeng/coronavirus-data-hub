const fs = require('fs');
const path = require('path');

const { fetchLatest } = require('./utils/fetch-latest-api');
const { fetchTimeseries } = require('./utils/fetch-china-timeseries');

const targetDirectory = path.resolve(process.cwd(), './dist');

if (!fs.existsSync(targetDirectory)) {
  fs.mkdir(targetDirectory, { recursive: true }, (err) => {
    if (err) throw err;
  });
}

fetchLatest();
fetchTimeseries();
