const fs = require("fs");
const process = require("process");
const { Transform, Writable, Readable } = require("stream");
const Sequelize = require("sequelize");
const { addIndex, map } = require("ramda");

const { buildObject: buildBodyObject } = require("./build-body");
const createFile = require("../utils/createFile");
const buildHeader = require("../utils/build-header-register");
const buildTrailer = require("./build-trailer");
const { helper: { logMemory } } = require("../utils/helper");

const mapIndexed = addIndex(map);

const build = async (
  db,
  fileOperationDate,
  chunkSize,
  options = { env: "prod" }
) => {
  console.time("EXEC");

  const file = await createFile.create(fileOperationDate, "OTPX");
  const path = `./`;
  const filePath = path + file.filename;
  const writeStream = fs.createWriteStream(filePath);

  let headerContent = buildHeader.build({
    fileType: "OTPX",
    fileId: file.id,
    fileOperationDate,
  });
  writeStream.write(headerContent);
  headerContent = null;

  const sellerDocuments = new Set();
  let totalNetPrePayAmount = 0;
  let totalFileLines = 2;

  let counter = 1;
  const stream = new Readable({
    async read(size) {
      const result = await db.query(
        `Select * From tripdata LIMIT 150000 OFFSET ${(counter - 1) * 150000}`,
        { type: Sequelize.QueryTypes.SELECT }
      );
      this.push(JSON.stringify(result));
      counter++;
      logMemory()
      if (result.length === 0) {
        this.push(null);
      }
    },
  });

  stream
    .pipe(
      new Transform({
        transform(chunk, enc, cb) {
          const objects = JSON.parse(chunk);
          objects.forEach((obj) => {
            sellerDocuments.add(obj.vendorid);
            const netPrePayAmount = obj.total_amount - obj.mta_tax - obj.extra;
            totalNetPrePayAmount += netPrePayAmount;
          });
          totalFileLines = totalFileLines + objects.length;
          cb(null, JSON.stringify(objects));
        },
      })
    )
    .pipe(
      new Transform({
        transform(chunk, enc, cb) {
          const objects = JSON.parse(chunk);
          console.log(objects.length);
          logMemory()
          const lines = mapIndexed((batch, index) => {
            const bodyObject = buildBodyObject(fileOperationDate)(batch, index);
            return bodyObject.contentLine;
          }, objects);
          cb(null, JSON.stringify(lines));
        },
      })
    )
    .pipe(
      new Writable({
        write(chunk, enc, cb) {
          const lines = JSON.parse(chunk);
          logMemory()
          for (const line of lines) {
            writeStream.write(`${line}`);
          }
          cb();
        },
      })
    );

  stream.on("end", () => {
    const trailerContent = buildTrailer.build({
      totalFileLines,
      totalNetPrePayAmount,
      totalDistinctSellerDocuments: sellerDocuments.size,
    });
    writeStream.write(`\n ${trailerContent}`);
    console.log(sellerDocuments, totalNetPrePayAmount, totalFileLines);
    console.timeEnd("EXEC");
  });
};

module.exports = {
  build,
};
