const { genToken } = require("../../config/auth/auth");
const testRequest = require("../../config/main");
const { genUser } = require("../../config/seeders/user");
const { createUserIndustry } = require("../../config/seeders/userIndustry");
const mongoose = require("mongoose");
const {
  connectToTest,
  closeConnection,
} = require("../../../src/configs/database/db");

beforeAll(async (done) => {
  await connectToTest();
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

describe("Industries Feature Tests", () => {
  it("Industries test running success", (done) => {
    expect(true).toBe(true);
    done();
  });

  it("Get / Path", (done) => {
    testRequest.get("/").then((res) => {
      expect(res.status).toBe(200);
      done();
    });
  });

  /*it("Invalid token provided on create UserIndustries without token", (done) => {
    const query = `
    mutation {
      addIndustryUserLicense(input: {
        _id: "123",
        name:"test-1",
        license: {
          _id:"123",
          name: "licencia - 1",
          state: {
            name: "Test - 1",
            country_code:"t",
            state_code:"t"
          },
          detail: {
            license_number:"123",
            aquired_date: 123,
            expiration_date: 123,
            first_renewal: true,
            issue_date: 123,
            licensed_by: "Google",
          }
        }
        }) {
          _id
        }
      }
    `;
    testRequest.post(`/graphql?query=${query}`).then((res) => {
      expect(res.body.errors[0].message).toBe("Invalid token provided");
      done();
    });
  });*/

  it("add license to existing user industry", async (done) => {
    const user = genUser();
    const token = genToken(user);
    const industries = [
      {
        name: "test-1",
        licenses: [
          {
            _id: mongoose.Types.ObjectId().toString(),
            name: "licencia - 1",
            state: {
              name: "Test - 1",
              country_code: "t",
              state_code: "t",
            },
            detail: {
              license_number: "123",
              aquired_date: 123,
              expiration_date: 123,
              first_renewal: true,
              issue_date: 123,
              licensed_by: "credentials",
            },
          },
        ],
      },
    ];

    const oldUserIndustries = await createUserIndustry(user.id, industries);
    const id = oldUserIndustries.industries[0]._id.toString();
    const license_id = mongoose.Types.ObjectId().toString();

    const query = `
    mutation {
        addIndustryUserLicense(input: {
          industry: {
            _id: "${id}",
            name:"test-1",
            license: {
              _id:"${license_id}",
              name: "licencia - 2",
              state: {
                name: "Test - 1",
                country_code:"t",
                state_code:"t"
              },
              detail: {
                license_number:"123",
                aquired_date: 123,
                expiration_date: 123,
                first_renewal: true,
                issue_date: 123,
                licensed_by: credentials,
              }
            }
          }
        }) {
          _id,
          user_id,
          industries {
            _id,
            name,
            licenses {
              _id,
              name
            }
          }
        }
      }
    `;

    testRequest
      .post(`/graphql?query=${query}`)
      .set({ Authorization: token })
      .expect(200)
      .end((err, res) => {
        done();
      });
  });
});
