const EasyGraphQLTester = require("easygraphql-tester");
const { array: licenseSchema } = require("../../../src/graphql/typeDef");

let tester;

beforeAll(async () => {
  tester = new EasyGraphQLTester(licenseSchema);
});

describe("Licenses Tests", () => {
  it("Licenses test running success", (done) => {
    expect(true).toBe(true);
    done();
  });

  it("Get All licenses", (done) => {
    const query = `
    {
      licenses {
        _id
        name
      }
    }
    `;
    tester.test(true, query);
    done();
  });

  it("Get a license", (done) => {
    const query = `
    {
      license(id:"1") {
        _id
        name
      }
    }
    `;
    tester.test(true, query);
    done();
  });
});
