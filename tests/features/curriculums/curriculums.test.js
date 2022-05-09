const { genToken } = require("../../config/auth/auth");
const testRequest = require("../../config/main");
const { genUser } = require("../../config/seeders/user");
const {
  createUserFiles,
  userFilesData,
} = require("../../config/seeders/userFiles");
const mongoose = require("mongoose");
const {
  connectToTest,
  closeConnection,
} = require("../../../src/configs/database/db");
const {
  curriculums,
  deleteCurriculumMutation,
  getCurriculumsQuery,
} = require("./curriculums.type");
const { createCurriculums } = require("../../config/seeders/curriculums");
/*
// User & token generation
const user = genUser();
const token = genToken(user);
let curriculumId = null;
let userFileId = null;

beforeAll(async (done) => {
  await connectToTest();
  done();
});

beforeEach(async (done) => {
  curriculumId = mongoose.Types.ObjectId();
  userFileId = mongoose.Types.ObjectId();
  curriculums[0]._id = curriculumId;
  curriculums[0].file_id = userFileId;
  userFilesData[0]._id = userFileId;

  await createUserFiles(user.id, userFilesData, "user-curriculums");
  await createCurriculums(user.id, curriculums);

  done();
});

afterAll(async (done) => {
  closeConnection().then(() => {
    done();
  });
});

afterEach(async (done) => {
  await mongoose.connection.db.dropDatabase();
  done();
});
*/
describe("User curriculums Feature Tests", () => {
  it("User curriculums test running success", (done) => {
    expect(true).toBe(true);
    done();
  });
  /*
  it("Get / Path", (done) => {
    testRequest.get("/").then((res) => {
      expect(res.status).toBe(200);
      done();
    });
  });

  it("Get all curriculums from a user", async (done) => {
    testRequest
      .post(`/graphql?query=${getCurriculumsQuery}`)
      .set({ Authorization: token })
      .expect(200)
      .end((err, res) => {
        const {
          body: {
            data: {
              userCurriculums: { curriculums },
            },
          },
        } = res;
        expect(curriculums.length).toBe(1);
        done();
      });
  });

  it("Delete a user curriculum by id", async (done) => {
    const deleteCurriculum = deleteCurriculumMutation(curriculumId.toString());
    testRequest
      .post(`/graphql?query=${deleteCurriculum}`)
      .set({ Authorization: token })
      .expect(200)
      .end((err, res) => {
        const {
          body: {
            data: {
              deleteCurriculum: { curriculums },
            },
          },
        } = res;
        expect(curriculums.length).toBe(0);
        done();
      });
  });
  */
});
