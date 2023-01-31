const cuid = require('cuid')

const randomIntegerGenerator = () => Math.floor(1e9 + (Math.random() * 9e10))

const create = (fileDate, fileType, fileCounter=1, filenameINC) => {
  let type
  let status
  let filename
  let fileKey

  const randomNumber = randomIntegerGenerator()

  switch (fileType) {
    case 'PPOS':
      type = 'remessa'
      status = 'waiting_send'

      filename = `FIDC-PGME-${fileDate}-PPOS-00${fileCounter}.rem`
      break
    case 'DREP':
      type = 'drep'
      status = 'waiting_send'

      filename = `0070PGME-${fileDate}-DREP-${randomNumber}-00${fileCounter}.rem`
      break
    case 'PAYP':
      type = 'pay'
      status = 'waiting_send'

      filename = `FIDC-PGME-${fileDate}-PAYP-001.rem`
      break
    case 'PREP':
      type = 'prep'
      status = 'waiting_send'

      filename = `0070PGME-${fileDate}-PREP-${randomNumber}-00${fileCounter}.rem`
      break
    case 'ACL':
      type = 'acl'
      status = 'waiting_send'

      fileKey = cuid.slug().slice(0, 7).toUpperCase()
      filename = `ACL-FIDC_TAPSO-${fileDate}-PG-${fileKey}-001.rem`
      break
    case 'DDET':
      type = 'ddet'
      status = 'waiting_send'

      filename = `0070PGME-${fileDate}-DDET-${randomNumber}-00${fileCounter}.rem`
      break
    case 'INC':
      type = 'retorno'
      status = 'validated'
      break
    default:
      break
  }

  return {
    id: randomNumber,
    type,
    status,
    filename: filename || filenameINC,
    key: fileKey,
  }
}


module.exports = {
  create,
}
