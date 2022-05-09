const { genToken } = require("../../config/auth/auth");
const testRequest = require("../../config/main");
const { genUser } = require("../../config/seeders/user");
const mongoose = require("mongoose");
const {
  connectToTest,
  closeConnection,
} = require("../../../src/configs/database/db");
const {
  companyDocuments,
  getCompanyDocumentsQuery,
  getCompanyDocumentQuery,
  addCompanyDocumentMutation,
  addCompanyDocumentReplyMutation,
  updateCompanyDocumentMutation,
  deleteCompanyDocumentMutation,
} = require("./company-documents.type");
const {
  createCompanyDocuments,
} = require("../../config/seeders/company-documents");

// User & token generation
const user = genUser();
const token = genToken(user);
let documentId = null;

beforeAll(async (done) => {
  await connectToTest();
  done();
});

beforeEach(async (done) => {
  documentId = mongoose.Types.ObjectId();
  companyDocuments[0]._id = documentId;
  await createCompanyDocuments(user.id, companyDocuments);

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

describe("Company Documents Feature Tests", () => {
  it("Company documents test running success", (done) => {
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

  it("Get all company documents", async (done) => {
    testRequest
      .post(`/graphql?query=${getCompanyDocumentsQuery}`)
      .set({ Authorization: token })
      .expect(200)
      .end((err, res) => {
        const {
          body: {
            data: {
              companyDocuments: { documents },
            },
          },
        } = res;
        expect(documents.length).toBe(1);
        done();
      });
  });

  it("Get company document by id", async (done) => {
    const getCompanyDocument = getCompanyDocumentQuery(documentId);
    testRequest
      .post(`/graphql?query=${getCompanyDocument}`)
      .set({ Authorization: token })
      .expect(200)
      .end((err, res) => {
        const {
          body: {
            data: {
              companyDocument: { documents },
            },
          },
        } = res;
        expect(documents[0].id.toString()).toBe(documentId.toString());
        done();
      });
  });

  it("Add a new company document", async (done) => {
    testRequest
      .post(`/graphql?query=${addCompanyDocumentMutation}`)
      .set({ Authorization: token })
      .expect(200)
      .end((err, res) => {
        const {
          body: {
            data: {
              addCompanyDocument: { documents },
            },
          },
        } = res;
        expect(documents.length).toBe(2);
        done();
      });
  });

  it("Add a new company document reply", async (done) => {
    const addDocumentReply = addCompanyDocumentReplyMutation(documentId);
    testRequest
      .post(`/graphql?query=${addDocumentReply}`)
      .set({ Authorization: token })
      .expect(200)
      .end((err, res) => {
        const {
          body: {
            data: {
              addCompanyDocumentReply: { documents },
            },
          },
        } = res;
        expect(documents[0].replies.length).toBe(1);
        done();
      });
  });

  it("Update a company document by id", async (done) => {
    const updateDocument = updateCompanyDocumentMutation(documentId);
    testRequest
      .post(`/graphql?query=${updateDocument}`)
      .set({ Authorization: token })
      .expect(200)
      .end((err, res) => {
        const {
          body: {
            data: {
              updateCompanyDocument: { documents },
            },
          },
        } = res;
        expect(documents[0].id.toString()).toBe(documentId.toString());
        done();
      });
  });

  it("Delete a company document by id", async (done) => {
    const deleteDocument = deleteCompanyDocumentMutation(documentId);
    testRequest
      .post(`/graphql?query=${deleteDocument}`)
      .set({ Authorization: token })
      .expect(200)
      .end((err, res) => {
        const {
          body: {
            data: {
              deleteCompanyDocument: { documents },
            },
          },
        } = res;
        expect(documents.length).toBe(0);
        done();
      });
  });*/
});
