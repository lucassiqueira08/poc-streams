const Sequelize = require("sequelize");
// const { run: runTestTask } = require("./test-file/task");
const { run: runTestTask } = require("./test-file-stream/task");

const db = new Sequelize({
  dialect: "sqlite",
  storage: "database/database.sqlite",
});

const syncDB = async () => {
  try {
    await db.sync();
  } catch (error) {
    console.log(error);
  }
};
syncDB().then(() => runTestTask(db, {}))

