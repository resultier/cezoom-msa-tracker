const supertest = require("supertest");
const createServer = require("../../src/configs/app/index");

const app = createServer();

const testRequest = supertest(app);

module.exports = testRequest;
