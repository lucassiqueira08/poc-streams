const builder = require("./build");

const logger = {
  info: ({ message, ...rest }) => console.log({ message, ...rest, name: "FIDC-TEST-FILE" }),
};

const run = async (db, {
  file_date: fileDate = new Date().toISOString().slice(0, 10),
  maxLines = 1000000,
}) => {
  logger.info({
    message: "Starting fidc/test-file"
  });
  
  await builder.build(db, fileDate, maxLines);

  logger.info({
    message: "[FIDC] TEST file was sent!",
    file_date: fileDate,
  });
};


module.exports = { run }