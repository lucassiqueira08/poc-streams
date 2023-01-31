const helper = '../utils/helper.js'
const moment = require('moment')

exports.buildHeader = (fileType, fidcFileId, fileDate) => {
  const razaoSocial = 'Pagarme Pagamentos SA'
  const companyCnpj = '18727053000174'

  const razaoSocialFidc = 'TAPSO FIDC NP'
  const companyCnpjFidc = '26287464000114'

  return [
    {
      start: 0,
      end: 1,
      value: '10'
    },
    {
      start: 2,
      end: 11,
      value: fidcFileId
    },
    {
      start: 12,
      end: 16,
      value: fileType
    },
    {
      start: 17,
      end: 24,
      value: moment().format('YYYYMMDD')
    },
    {
      start: 25,
      end: 54,
      value: ''
    },
    {
      start: 55,
      end: 94,
      value: razaoSocial
    },
    {
      start: 95,
      end: 108,
      value: companyCnpj
    },
    {
      start: 109,
      end: 148,
      value: razaoSocialFidc
    },
    {
      start: 149,
      end: 162,
      value: companyCnpjFidc
    },
    {
      start: 163,
      end: 191,
      value: ''
    },
    {
      start: 192,
      end: 193,
      value: helper.EOL
    }
  ]
}

exports.run = (fileType, fidcFileId, fileDate) => {
  const headerContent = exports.buildHeader(fileType, fidcFileId, fileDate)
  return helper.generateLineFromFields(headerContent)
}
