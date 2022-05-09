const { genToken } = require("../../config/auth/auth");
const testRequest = require("../../config/main");
const { genUser } = require("../../config/seeders/user");
const mongoose = require("mongoose");
const {
  connectToTest,
  closeConnection,
} = require("../../../src/configs/database/db");
const {
  addCertificateMutation,
  getCertificatesQuery,
  certificates,
  getCertificateQuery,
  updateCertificateMutation,
} = require("./certificates.type");
const { createCertificates } = require("../../config/seeders/certificates");

// User & token generation
const user = genUser();
const token = genToken(user);
let certificateId = null;

beforeAll(async (done) => {
  await connectToTest();
  done();
});

beforeEach(async (done) => {
  certificateId = mongoose.Types.ObjectId();
  certificates[0]._id = certificateId;
  //await createCertificates(user.id, certificates);
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

describe("Company certificates Feature Tests", () => {
  it("Company certificates test running success", (done) => {
    expect(true).toBe(true);
    done();
  });

  /*it("Get / Path", (done) => {
    testRequest.get("/").then((res) => {
      expect(res.status).toBe(200);
      done();
    });
  });

  it("Invalid token provided on create company certificate without token", (done) => {
    testRequest.post(`/graphql?query=${addCertificateMutation}`).then((res) => {
      expect(res.body.errors[0].message).toBe("Invalid token provided");
      done();
    });
  });

  it("Add a new company certificate", (done) => {
    testRequest
      .post(`/graphql?query=${addCertificateMutation}`)
      .set({ Authorization: token })
      .expect(200)
      .end((err, res) => {
        const {
          body: {
            data: {
              addCertificate: { company_id },
            },
          },
        } = res;
        expect(company_id).toBe(user.id);
        done();
      });
  });

  it("Get all certificates from a company", async (done) => {
    testRequest
      .post(`/graphql?query=${getCertificatesQuery}`)
      .set({ Authorization: token })
      .expect(200)
      .end((err, res) => {
        const {
          body: {
            data: {
              certificates: { certificates },
            },
          },
        } = res;
        expect(certificates.length).toBe(1);
        done();
      });
  });

  /*it("Get a certificate by id", async (done) => {
    const getCertificate = getCertificateQuery(certificateId.toString());

    testRequest
      .post(`/graphql?query=${getCertificate}`)
      .set({ Authorization: token })
      .expect(200)
      .end((err, res) => {
        const {
          body: {
            data: {
              certificate: { _id },
            },
          },
        } = res;
        expect(_id.toString()).toBe(certificateId.toString());
        done();
      });
  });

  it("Update a certificate by id", async (done) => {
    const updateCertificate = updateCertificateMutation(
      certificateId.toString()
    );

    testRequest
      .post(`/graphql?query=${updateCertificate}`)
      .set({ Authorization: token })
      .expect(200)
      .end((err, res) => {
        const {
          body: {
            data: {
              updateCertificate: { certificates },
            },
          },
        } = res;
        expect(certificates[0]._id.toString()).toBe(certificateId.toString());
        done();
      });
  });*/
});
