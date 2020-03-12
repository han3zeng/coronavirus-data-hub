const xlsx = require('node-xlsx');
const fs = require('fs');
const path = require('path');

const targetDirectory = path.resolve(__dirname, '../../assets');
const fileName = 'countries-em-map';
const fileExtension = 'json';

const countreisXLStoJSON = () => {
  const fileUrl = path.resolve(__dirname, '../../assets/countries-em-map-raw.xls');
  const xlsFile = fs.readFileSync(fileUrl);
  const parsedXLS = xlsx.parse(xlsFile);
  const { data } = parsedXLS[0];
  const res = {};
  data.forEach((row, index) => {
    if (index !== 0 && row.length === 5) {
      const simplifiedNamesEnglish = row[4].split('、');
      const officialNameEnglish = row[3];
      const simplifiedNamesMandarine = row[2].split('、')[0];
      simplifiedNamesEnglish.forEach((name, index) => {
        res[name.toLowerCase()] = simplifiedNamesMandarine;
      });
      res[officialNameEnglish.toLowerCase()] = simplifiedNamesMandarine;
    }
  });
  // exceptions
  res['mainland china'] = '中國';
  res.china = '中國';
  res['hong kong'] = '香港';
  // res.taiwan = '台灣';
  res['taiwan*'] = '台灣';
  res['korea, south'] = '韓國';
  res.macau = '澳門';
  res.others = '其他';
  res['cruise ship'] = '鑽石公主號';
  res['french guiana'] = '法屬圭亞那';
  res.martinique = '馬丁尼克（法國海外大區）';
  res.reunion = '留尼旺（法國海外大區';
  res['congo (kinshasa)'] = '剛果';
  fs.writeFile(`${targetDirectory}/${fileName}.${fileExtension}`, JSON.stringify(res, null, 2), (err) => {
    if (err) {
      console.log(`fail to write file: ${fileName}: ${err}`);
    } else {
      console.log(`write file ${fileName} successfully`);
    }
  });
};

(function main () {
  countreisXLStoJSON();
})();
