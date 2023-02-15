const helper = "../utils/helper.js";
const moment = require("moment");

exports.buildHeader = (fileType, fileId, fileDate) => {
  const razaoSocial = "XPTO Pagamentos SA";
  const companyCnpj = "12345678910";

  const razaoSocial2 = "XPTO 2";
  const companyCnpj2 = "10987654321";

  return [
    {
      start: 0,
      end: 1,
      value: "10",
    },
    {
      start: 2,
      end: 11,
      value: fileId,
    },
    {
      start: 12,
      end: 16,
      value: fileType,
    },
    {
      start: 17,
      end: 24,
      value: moment().format("YYYYMMDD"),
    },
    {
      start: 25,
      end: 54,
      value: "",
    },
    {
      start: 55,
      end: 94,
      value: razaoSocial,
    },
    {
      start: 95,
      end: 108,
      value: companyCnpj,
    },
    {
      start: 109,
      end: 148,
      value: razaoSocial2,
    },
    {
      start: 149,
      end: 162,
      value: companyCnpj2,
    },
    {
      start: 163,
      end: 191,
      value: "",
    },
    {
      start: 192,
      end: 193,
      value: helper.EOL,
    },
  ];
};

exports.run = (fileType, fileId, fileDate) => {
  const headerContent = exports.buildHeader(fileType, fileId, fileDate);
  return helper.generateLineFromFields(headerContent);
};
