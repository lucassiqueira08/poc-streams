const moment = require("moment");
const { helper } = require("../utils/helper.js");

const CNPJ_0TPX = Math.floor(1e9 + Math.random() * 9e10);
const CNPJ_XPTO = Math.floor(1e9 + Math.random() * 9e10);

const buildHeader = ({ fileType, fileId, fileOperationDate }) => {
  const dateFormat = (date) => moment(date).format("YYYYMMDD");
  const fileDate = moment();

  return [
    { start: 0, end: 1, value: "10" },
    { start: 2, end: 11, value: fileId.toString() },
    { start: 12, end: 16, value: fileType },
    { start: 17, end: 17, value: "" },
    { start: 18, end: 57, value: "fullNamePagarme" },
    { start: 58, end: 71, value: CNPJ_0TPX },
    { start: 72, end: 72, value: "" },
    { start: 73, end: 80, value: dateFormat(fileDate) },
    { start: 81, end: 88, value: dateFormat(fileOperationDate) },
    { start: 89, end: 89, value: "" },
    { start: 90, end: 129, value: "fullNameTapso" },
    { start: 130, end: 143, value: CNPJ_XPTO },
    { start: 144, end: 175, value: "Receivables" },
    { start: 176, end: 313, value: "" },
    { start: 314, end: 319, value: 1 },
    { start: 320, end: 321, value: helper.EOL },
  ];
};

const build = ({ fileType, fileId, fileOperationDate }) => {
  const lineContent = buildHeader({
    fileType,
    fileId,
    fileOperationDate,
  });

  return helper.generateLineFromFields(lineContent);
};

module.exports = {
  buildHeader,
  build,
};
