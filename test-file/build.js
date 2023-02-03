const {
  addIndex,
  join,
  map,
  flatten,
} = require('ramda')

const sendFidcFile = require('../utils/send')
const createFidcFile = require('../utils/createFile')
const buildHeader = require('../utils/build-header-registradora')
const buildTrailer = require('./build-trailer')
const { buildObject: buildBodyObject } = require('./build-body')

const logger = {
  info: ({ message, ...rest }) => console.log({ message, ...rest, name: "FIDC-TEST-FILE" }),
};

const mapIndexed = addIndex(map)

const getBatches = async (db, _fileOperationDate) => {
  // Devolve 7 milhões de registros - 7832545
  const batchesArr = await db.query('Select * From tripdata limit 1500000')
  return flatten(batchesArr)
}

const buildFile = async (batches, fileOperationDate, options) => {
  logger.info({
    message: 'Create fidcFile...',
  })
  const fidcFile = await createFidcFile.create(fileOperationDate, 'PREP')

  logger.info({
    message: 'File is being built...',
    file: 'test',
  })
  const headerContent = buildHeader.build({
    fileType: 'PREP',
    fidcFileId: fidcFile.id,
    fileOperationDate,
  })

  let bodyObjects = mapIndexed(
    buildBodyObject(fileOperationDate),
    batches
  )
  const trailerContent = buildTrailer.build(bodyObjects)

  let bodyContent = ''

  // eslint-disable-next-line no-restricted-syntax
  for (const obj of bodyObjects) {
    bodyContent = bodyContent.concat(obj.contentLine)
  }

  bodyObjects = null

  fidcFile.content = join(
    '',
    [headerContent, bodyContent, trailerContent]
  )

  bodyContent = null

  logger.info({
    message: 'File built',
    file: 'prep',
  })

  if (options.env === 'prod') {
    logger.info({
      message: 'Uploading file...',
      file: 'prep',
    })
    await sendFidcFile.upload(fidcFile)
    logger.info({
      message: 'File successfully uploaded',
      file: 'prep',
    })
  }

  return fidcFile
}

const build = async (db, fileOperationDate, chunkSize, options = { env: 'prod' }) => {
  console.time('EXEC')

  logger.info({
    message: 'Loading batches...',
    file: 'test',
  })
  const batches = await getBatches(db, fileOperationDate)

  logger.info({
    message: 'Start creating files...',
    file: 'test',
    totalFiles: Math.ceil(batches.length / chunkSize),
  })

  while (batches.length > 0) {
    const batchesChunk = batches.splice(0, chunkSize)
    // eslint-disable-next-line no-await-in-loop
    await buildFile(batchesChunk, fileOperationDate, options)
  }
  console.timeEnd('EXEC')
  return null
}

module.exports = {
  build,
}
