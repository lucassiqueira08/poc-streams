const Promise = require('bluebird')
const fs = require('fs');
const logger = {
  info: ({ message, ...rest }) => console.log({ message, ...rest, name: "FIDC-TEST-FILE" }),
};
const putFile = (path, content) => {
  return new Promise((resolve, reject) => {
    const stream = fs.createWriteStream(path)

    stream.on('error', (err) => {
      reject(err)
    })

    stream.on('close', () => {
      resolve()
    })

    stream.write(content)
    stream.end()

    stream.on('finish', () => {
      logger.info({ message: "Write completed." });
    });
  })
}

exports.upload = (fidcFile, fakeUpload) => {
  return doUpload(fidcFile, fakeUpload)
    .then(uploadSuccess)
    .catch(uploadFailed(fidcFile))
    .return(fidcFile)
}

const doUpload = (fidcFile, fakeUpload) => {
  return new Promise((resolve, reject) => {
    const path = `./`
    const filePath = path + fidcFile.filename

    logger.info({ message: '[SFTP FIDC] Doing Upload....' });

    return putFile(filePath, fidcFile.content)
      .then(() => resolve(fidcFile))
      .catch(err => reject(err))
  })
}

const uploadSuccess = fidcFile => Promise.resolve({ status: 'sent' })

const uploadFailed = fidcFile => (error) => {
  console.log(`[SFTP FIDC] Error: ${error}`)
  return Promise.reject({ status: 'failed_send' })
}
