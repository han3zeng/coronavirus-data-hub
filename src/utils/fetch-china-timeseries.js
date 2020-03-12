const rp = require('request-promise');
const _get = require('lodash/get');
const csvtojson = require('csvtojson');
const path = require('path');
const fs = require('fs');
const logger = require('./create-logger');

const _ = {
  get: _get
};

const fileName = 'china-coronavirus-timeseries';
const targetDirectory = path.resolve(process.cwd(), './dist');
const fileExtension = 'json';

const countrySet = new Set(['Mainland China', 'Hong Kong', 'Macau', 'China']);
const keyTimestampMap = {};
const timeSeriesMap = {};
const milliSecondsInADay = 24 * 60 * 60 * 1000;

const columnKey = {
  province: 0,
  country: 1,
  firstConfirmed: 2,
  dateStart: 4
};

const dateTimeTuncate = (dateTimeString) => {
  if (dateTimeString && typeof dateTimeString === 'string') {
    try {
      return dateTimeString.split(' ')[0];
    } catch (e) {
      return null;
    }
  }
  return null;
};

const dateStringToTimeStamp = (dateString) => {
  if (dateString && typeof dateString === 'string') {
    try {
      return new Date(dateString).getTime();
    } catch (e) {
      return null;
    }
  }
  return null;
};

const pipe = (...fns) => initialState => fns.reduce((acc, fn) => fn(acc), initialState);

const dateTimeProcessor = pipe(dateTimeTuncate, dateStringToTimeStamp);

const firstRowHandler = (row) => {
  const firstTimestamp = dateTimeProcessor(row[columnKey.dateStart]);
  const lastTimestamp = dateTimeProcessor(row[row.length - 1]);
  const totalDays = ((lastTimestamp - firstTimestamp) / milliSecondsInADay) + 1;
  for (let i = columnKey.dateStart; i < row.length; i += 1) {
    // timeSeriesMap.set(dateTimeProcessor(row[i]), {
    //   dateString: dateTimeTuncate(row[i]),
    //   data: [],
    // });
    keyTimestampMap[i] = {
      timestamp: dateTimeProcessor(row[i]),
      dateString: dateTimeTuncate(row[i]),
    };
  }
  return totalDays;
};

const rowsHandler = (row) => {
  for (let i = columnKey.dateStart; i < row.length; i += 1) {
    const { timestamp, dateString } = keyTimestampMap[i];
    if (!timeSeriesMap[timestamp]) {
      timeSeriesMap[timestamp] = {
        dateString,
        data: {
          [row[columnKey.province]]: +row[i],
        },
      };
    } else {
      const previousData = timeSeriesMap[timestamp];
      timeSeriesMap[timestamp] = {
        ...previousData,
        data: {
          ...previousData.data,
          [row[columnKey.province]]: +row[i],
        },
      };
    }
  }
};

const johnHopkinsTimeSeries = (rows) => {
  let totalDays;
  rows.forEach((row, index) => {
    if (index === 0) {
      firstRowHandler(row);
      totalDays = timeSeriesMap.size;
    } else if (countrySet.has(row[columnKey.country])) {
      rowsHandler(row);
    }
  });
  return timeSeriesMap;
};


function main () {
  const url = 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_19-covid-Confirmed.csv';
  let headerRow = [];
  rp(url)
    .then((rawData) => {
      csvtojson({
        noheader: false,
        output: 'csv',
        trim: true
      })
        .fromString(rawData)
        .on('header', (header) => {
          headerRow = header;
        })
        .then((dataRows) => {
          let timeSeriesMap = {};
          try {
            timeSeriesMap = johnHopkinsTimeSeries([headerRow, ...dataRows]);
          } catch (e) {
            logger.log({
              level: 'error',
              message: 'fail to comiple rows in johnHopkinsTimeSeries function'
            });
          }
          fs.writeFile(`${targetDirectory}/${fileName}.${fileExtension}`, JSON.stringify(timeSeriesMap, null, 2), (err) => {
            if (err) {
              logger.log({
                level: 'error',
                message: `fail to write file: ${fileName}: ${err}`
              });
            } else {
              logger.log({
                level: 'info',
                message: `write file ${fileName} successfully`
              });
            }
          });
        })
        .catch(() => {
          logger.log({
            level: 'error',
            message: 'fail to transform csv to json from fetch-china-timeseries'
          });
        });
    })
    .catch((e) => {
      logger.log({
        level: 'error',
        message: `can not fetch data from covid-19 github %${e}`
      });
    });
}

module.exports = {
  fetchTimeseries: main
};
