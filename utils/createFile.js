const randomIntegerGenerator = () => Math.floor(1e9 + Math.random() * 9e10);

const create = (fileDate, fileType, fileCounter = 1, filenameINC) => {
  let type;
  let status;
  let filename;
  let fileKey;

  const randomNumber = randomIntegerGenerator();

  switch (fileType) {
    case "XPTO":
      type = "xpto";
      status = "waiting_send";

      filename = `070PGME-${fileDate}-XPTO-${randomNumber}-00${fileCounter}.rem`;
      break;
    case "OTPX":
      type = "otpx";
      status = "waiting_send";

      filename = `STREAM-0070PGME-${fileDate}-OPTX-${randomNumber}-00${fileCounter}.rem`;
      break;
    default:
      break;
  }

  return Promise.resolve({
    id: randomNumber,
    type,
    status,
    filename: filename || filenameINC,
    key: fileKey,
  });
};

module.exports = {
  create,
};
