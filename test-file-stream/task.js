const builder = require("./build");

const { helper: { commonLogger } } = require('../utils/helper')
const logger = commonLogger('STREAM-TEST-FILE')

const run = async (
  db,
  {
    file_date: fileDate = new Date().toISOString().slice(0, 10),
    maxLines = 1000000,
  }
) => {
  logger.info({
    message: "Starting stream-test-file",
  });

  await builder.build(db, fileDate, maxLines);

  logger.info({
    message: "File was sent!",
    file_date: fileDate,
  });
};

module.exports = { run };
