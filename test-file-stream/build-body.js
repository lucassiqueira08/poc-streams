const moment = require("moment");
const { helper } = require("../utils/helper.js");

const dateFormat = (date) => moment(date).format("YYYYMMDD");

const buildLine = ({ obj, index, netPrePayAmount, operationDate }) => {
  const countHeader = 2;
  const counterLine = countHeader + index;
  const operationDateFormatted = dateFormat(operationDate);

  const operationHash = `${operationDateFormatted} - ${obj.endorid * 33e4}`;
  const ruHash = `${operationDateFormatted} - ${obj.endorid * 56e4}`;

  return [
    { start: 0, end: 1, value: "20" },
    { start: 2, end: 15, value: obj.vendorid },
    { start: 16, end: 47, value: obj.passenger_count },
    { start: 48, end: 48, value: "" },
    { start: 49, end: 80, value: obj.pulocationid },
    { start: 81, end: 81, value: "" },
    { start: 82, end: 113, value: ruHash },
    { start: 114, end: 114, value: "" },
    { start: 115, end: 146, value: operationHash },
    { start: 147, end: 147, value: obj.trip_distance },
    { start: 148, end: 155, value: "" },
    { start: 156, end: 156, value: "" },
    { start: 157, end: 164, value: operationDateFormatted },
    { start: 165, end: 165, value: "" },
    { start: 166, end: 173, value: "" },
    { start: 174, end: 205, value: obj.tpep_dropoff_datetime },
    { start: 206, end: 206, value: obj.extra },
    { start: 207, end: 218, value: netPrePayAmount },
    { start: 219, end: 219, value: obj.total_amount },
    { start: 220, end: 220, value: 1 },
    { start: 221, end: 313, value: obj.fare_amount },
    { start: 314, end: 319, value: counterLine },
    { start: 320, end: 321, value: helper.EOL },
  ];
};

const buildObject = (operationDate) => (obj, index) => {
  const netPrePayAmount = obj.total_amount - obj.mta_tax - obj.extra;

  const line = buildLine({
    obj,
    index,
    netPrePayAmount,
    operationDate,
  });

  return {
    contentLine: helper.generateLineFromFields(line),
    netPrePayAmount,
    sellerDocument: obj.vendorid,
  };
};

module.exports = {
  buildObject,
};
