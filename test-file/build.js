const { addIndex, join, map, flatten } = require("ramda");

const sendFile = require("../utils/send");
const createFile = require("../utils/createFile");
const buildHeader = require("../utils/build-header-register");
const buildTrailer = require("./build-trailer");
const { helper: { logMemory } } = require("../utils/helper");
const { buildObject: buildBodyObject } = require("./build-body");

const { helper: { commonLogger } } = require('../utils/helper')
const logger = commonLogger('TEST-FILE')

const mapIndexed = addIndex(map);

const getObjects = async (db, _fileOperationDate) => {
  // Devolve 7 milhões de registros - 7832545
  const objectsArr = await db.query("Select * From tripdata limit 1500000");
  return flatten(objectsArr);
};

const buildFile = async (objects, fileOperationDate, options) => {
  logger.info({
    message: "Create file...",
  });
  const file = await createFile.create(fileOperationDate, "XPTO");

  logMemory();
  logger.info({
    message: "File is being built...",
    file: "test",
  });

  const headerContent = buildHeader.build({
    fileType: "XPTO",
    fileId: file.id,
    fileOperationDate,
  });

  let bodyObjects = mapIndexed(buildBodyObject(fileOperationDate), objects);
  logMemory();

  const trailerContent = buildTrailer.build(bodyObjects);

  let bodyContent = "";

  // eslint-disable-next-line no-restricted-syntax
  for (const obj of bodyObjects) {
    bodyContent = bodyContent.concat(obj.contentLine);
  }

  logMemory();
  bodyObjects = null;

  file.content = join("", [headerContent, bodyContent, trailerContent]);

  bodyContent = null;

  logger.info({
    message: "File built",
    file: "xpto",
  });
  logMemory();

  if (options.env === "prod") {
    logger.info({
      message: "Uploading file...",
      file: "xpto",
    });
    logMemory();
    await sendFile.upload(file);
    logger.info({
      message: "File successfully uploaded",
      file: "xpto",
    });
    logMemory();
  }

  return file;
};

const build = async (
  db,
  fileOperationDate,
  chunkSize,
  options = { env: "prod" }
) => {
  console.time("EXEC");

  logger.info({
    message: "Loading objects...",
    file: "test",
  });
  const objects = await getObjects(db, fileOperationDate);
  logMemory();
  logger.info({
    message: "Start creating files...",
    file: "test",
    totalFiles: Math.ceil(objects.length / chunkSize),
  });

  while (objects.length > 0) {
    const objectsChunk = objects.splice(0, chunkSize);
    // eslint-disable-next-line no-await-in-loop
    await buildFile(objectsChunk, fileOperationDate, options);
  }
  console.timeEnd("EXEC");
  return null;
};

module.exports = {
  build,
};
