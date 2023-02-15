const Promise = require("bluebird");
const fs = require("fs");

const { helper: { commonLogger } } = require('../utils/helper')
const logger = commonLogger('SFTP')

const putFile = (path, content) => {
  return new Promise((resolve, reject) => {
    const stream = fs.createWriteStream(path);

    stream.on("error", (err) => {
      reject(err);
    });

    stream.on("close", () => {
      resolve();
    });

    stream.write(content);
    stream.end();

    stream.on("finish", () => {
      logger.info({ message: "Write completed." });
    });
  });
};

exports.upload = (file, fakeUpload) => {
  return doUpload(file, fakeUpload)
    .then(uploadSuccess)
    .catch(uploadFailed(file))
    .return(file);
};

const doUpload = (file, fakeUpload) => {
  return new Promise((resolve, reject) => {
    const path = `./`;
    const filePath = path + file.filename;

    logger.info({ message: "[SFTP FILE] Doing Upload...." });

    return putFile(filePath, file.content)
      .then(() => resolve(file))
      .catch((err) => reject(err));
  });
};

const uploadSuccess = () => Promise.resolve({ status: "sent" });

const uploadFailed = () => (error) => {
  console.log(`[SFTP FILE] Error: ${error}`);
  return Promise.reject({ status: "failed_send" });
};
