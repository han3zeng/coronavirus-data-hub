const rp = require('request-promise');
const _get = require('lodash/get');
const fs = require('fs');


const _ = {
  get: _get
};

const zeroPadding = (number) => {
  let strNumber = String(number);
  if (strNumber.length < 2) {
    strNumber = `0${strNumber}`;
  }
  return strNumber;
};

const getUrl = ({
  timestamp = Date.now()
}) => {
  // 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_daily_reports/03-01-2020.csv';
  const urlBase = 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_daily_reports';
  const fileExtension = 'csv';
  const dateObject = new Date(timestamp);
  const date = zeroPadding(dateObject.getUTCDate());
  const month = zeroPadding(dateObject.getUTCMonth() + 1);
  const year = zeroPadding(dateObject.getUTCFullYear());
  return `${urlBase}/${month}-${date}-${year}.${fileExtension}`;
};

const fetchData = ({
  timestamp,
  interval,
  count = 10
}) => {
  return rp(getUrl({ timestamp }))
    .then((response) => {
      return response;
    })
    .catch((error) => {
      if (count === 0) {
        throw new Error('reach max default count');
      }
      if (_.get(error, 'statusCode', null) === 404) {
        return fetchData({
          timestamp: timestamp - interval,
          interval,
          count: count - 1
        });
      } else {
        throw new Error(_.get(error, 'body', 'default fetch error message by myself'));
      }
    });
};

const compileData = (rawData) => {
  const data = rawData.split('\n');
  const res = {};
  data.forEach((rawEntity, index) => {
    if (!rawEntity || index === 0) {
      return;
    }
    const regexp = /(?:[^,"]+|"[^"]*")+/g;
    if (rawEntity[0] === ',') {
      rawEntity = `dummy ${rawEntity}`
    }
    const entity = rawEntity.match(regexp);
    const countryName = _.get(entity, '[1]', '').toLowerCase();
    const confirmed = +_.get(entity, '[3]', 0);
    const deaths = +_.get(entity, '[4]', 0);
    const recovered = +_.get(entity, '[5]', 0);
    if (countryName) {
      if (res[countryName]) {
        res[countryName] = {
          confirmed: res[countryName].confirmed + confirmed,
          deaths: res[countryName].deaths + deaths,
          recovered: res[countryName].recovered + recovered
        };
      } else {
        res[countryName] = {
          confirmed,
          deaths,
          recovered
        };
      }
    }
  });
  console.log(res);
};

const main = async () => {
  const interval = 24 * 60 * 60 * 1000;
  const currentTimestamp = Date.now() + interval * 4;

  try {
    const data = await fetchData({
      timestamp: currentTimestamp,
      interval
    });
    compileData(data);
  } catch (e) {
    console.log('e: ', e);
  }
};

module.exports = {
  fetchLatest: main
};
