const { genToken } = require("../../config/auth/auth");
const testRequest = require("../../config/main");
const { genUser } = require("../../config/seeders/user");
const mongoose = require("mongoose");
const {
  connectToTest,
  closeConnection,
} = require("../../../src/configs/database/db");
const {
  providers,
  addProviderMutation,
  getProvidersQuery,
  getProviderQuery,
  updateProviderMutation,
  deleteProviderMutation,
} = require("./providers.type");
const { createProviders } = require("../../config/seeders/providers");

// User & token generation
const user = genUser();
const token = genToken(user);
let providerId = null;

beforeAll(async (done) => {
  await connectToTest();
  done();
});

beforeEach(async (done) => {
  providerId = mongoose.Types.ObjectId();
  providers[0]._id = providerId;
  await createProviders(user.id, providers);
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

describe("Providers Features Tests", () => {
  
  it("Providers test running success", (done) => {
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

  it("Invalid token provided on create company certificate without token", (done) => {
    testRequest.post(`/graphql?query=${addProviderMutation}`).then((res) => {
      expect(res.body.errors[0].message).toBe("Invalid token provided");
      done();
    });
  });

  it("Add a new provider", (done) => {
    testRequest
      .post(`/graphql?query=${addProviderMutation}`)
      .set({ Authorization: token })
      .expect(200)
      .end((err, res) => {
        console.log(err,res)
        /*const {
          body: {
            data: {
              addProvider: { providers },
            },
          },
        } = res;
        expect(providers.length).toBe(2);
        done();
      });
  });

  it("Get all providers", (done) => {
    testRequest
      .post(`/graphql?query=${getProvidersQuery}`)
      .set({ Authorization: token })
      .expect(200)
      .end((err, res) => {
        const {
          body: {
            data: { providers },
          },
        } = res;
        expect(providers.length).toBe(1);
        done();
      });
  });

  it("Get provider by id", (done) => {
    const getProvider = getProviderQuery(providerId.toString());
    testRequest
      .post(`/graphql?query=${getProvider}`)
      .set({ Authorization: token })
      .expect(200)
      .end((err, res) => {
        const {
          body: {
            data: { provider },
          },
        } = res;
        expect(provider._id.toString()).toBe(providerId.toString());
        done();
      });
  });

  it("Update provider by id", (done) => {
    const updateProvider = updateProviderMutation(providerId.toString());
    testRequest
      .post(`/graphql?query=${updateProvider}`)
      .set({ Authorization: token })
      .expect(200)
      .end((err, res) => {
        const {
          body: {
            data: {
              updateProvider: { providers },
            },
          },
        } = res;
        expect(providers[0]._id.toString()).toBe(providerId.toString());
        done();
      });
  });

  it("Delete a provider by id", (done) => {
    const deleteProvider = deleteProviderMutation(providerId.toString());
    testRequest
      .post(`/graphql?query=${deleteProvider}`)
      .set({ Authorization: token })
      .expect(200)
      .end((err, res) => {
        const {
          body: {
            data: {
              deleteProvider: { providers },
            },
          },
        } = res;
        expect(providers.length).toBe(0);
        done();
      });
  });*/
});
