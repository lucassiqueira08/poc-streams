const fs = require('fs');
const { Transform, Writable, Readable } = require('stream')
const {
  addIndex,
  map,
} = require('ramda')
const Sequelize = require('sequelize');

const createFidcFile = require('../utils/createFile')
const buildHeader = require('../utils/build-header-registradora')

const { buildObject: buildBodyObject } = require('./build-body')

const mapIndexed = addIndex(map)

const build = async (db, fileOperationDate, chunkSize, options = { env: 'prod' }) => {
  console.time('EXEC')

  const fidcFile = await createFidcFile.create(fileOperationDate, 'PREP')
  const path = `./`
  const filePath = path + fidcFile.filename
  const writeStream = fs.createWriteStream(filePath)

  const headerContent = buildHeader.build({
    fileType: 'PREP',
    fidcFileId: fidcFile.id,
    fileOperationDate,
  })
  writeStream.write(headerContent)

  const sellerDocuments  = new Set()
  let totalNetPrePayAmount = 0
  let totalFileLines = 2

  let counter = 1;
  const stream = new Readable({
      async read(size) {
          const result = await db.query(
            `Select * From tripdata LIMIT 100000 OFFSET ${(counter - 1) * 1000000}`, { type: Sequelize.QueryTypes.SELECT });
          this.push(JSON.stringify(result));
          counter++;
          if (result.length === 0) {
              this.push(null);
          }
      }
  });

  stream
    .pipe(
      new Transform({
        transform(chunk, enc, cb) {
          const batches = JSON.parse(chunk)
          batches.forEach(obj => {
            sellerDocuments.add(obj.vendorid)
            const netPrePayAmount = obj.total_amount - obj.mta_tax - obj.extra
            totalNetPrePayAmount += netPrePayAmount
          })
          totalFileLines += batches.length
          cb(null, JSON.stringify(batches))
        }
      })
    )
    .pipe(
      new Transform({
        transform(chunk, enc, cb) {
          const batches = JSON.parse(chunk)
          const lines = mapIndexed((batch, index) => {
            const bodyObject = buildBodyObject(fileOperationDate)(batch, index)
            return bodyObject.contentLine
          }, batches);
          console.log(lines)
          cb(null, JSON.stringify(lines))
        }
      })
    )
    .pipe(
      new Writable({
        write(chunk, enc, cb) {
          writeStream.write(chunk)
          cb()
        }
      })
    )

  stream.on('finally', () => {
    const trailerContent = buildTrailer.build({
      totalFileLines,
      totalNetPrePayAmount,
      totalDistinctSellerDocuments
    })
    writeStream.write(trailerContent)
  })

  stream.on('end', () => console.timeEnd('EXEC'))
}

module.exports = {
  build,
}
