const { always, applySpec } = require("ramda");
const { helper } = require("../utils/helper.js");

const buildData = (bodyObjects) => {
  const totalDistinctSellerDocuments = (objects) => {
    const set = new Set();
    objects.forEach((obj) => set.add(obj.vendorid));
    return set.size;
  };

  const totalNetPrePayAmount = (data) =>
    data.reduce((acc, cur) => acc + cur.netPrePayAmount, 0);

  const totalFileLines = always(bodyObjects.length + 2);

  return applySpec({
    totalFileLines,
    totalNetPrePayAmount,
    totalDistinctSellerDocuments,
  })(bodyObjects);
};

const buildLine = (data, checksum) => [
  { start: 0, end: 1, value: "30" },
  { start: 2, end: 11, value: data.totalFileLines },
  { start: 12, end: 23, value: data.totalDistinctSellerDocuments },
  { start: 24, end: 24, value: "" },
  { start: 25, end: 38, value: data.totalNetPrePayAmount },
  { start: 39, end: 39, value: "" },
  { start: 40, end: 71, value: checksum },
  { start: 72, end: 313, value: "" },
  { start: 314, end: 319, value: data.totalFileLines },
  { start: 320, end: 321, value: helper.EOL },
];

const build = (data, _fileOperationDate) => {
  const lineContent = buildLine(data);
  return helper.generateLineFromFields(lineContent);
};

module.exports = {
  build,
  buildData,
};
