const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const { MONGO_DB_URL } = require("../../utils/constants");

let instance = null;

const connect = async function () {
  try {
    return mongoose.connect(MONGO_DB_URL);
  } catch (error) {
    console.log("CLOSE CONNECTION :" + error);
    mongoose.connection.close();
  }
};

const connectToTest = async () => {
  instance = await MongoMemoryServer.create();
  const mem_uri = await instance.getUri();
  return mongoose.connect(mem_uri);
};

const closeConnection = async () => {
  await mongoose.connection.close();
  await instance.stop();
};

mongoose.connection.on(
  "error",
  console.error.bind(console, "connection error:")
);

mongoose.connection.once("open", function () {
  console.log("Connected");
});

module.exports = { connect, connectToTest, closeConnection };
