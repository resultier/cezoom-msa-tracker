const EasyGraphQLTester = require("easygraphql-tester");
const { array: deaLicenseSchema } = require("../../../src/graphql/typeDef");

let tester;

beforeAll(async () => {
  tester = new EasyGraphQLTester(deaLicenseSchema);
});

describe("Dea Licenses Tests", () => {
  it("Dea Licenses test running success", (done) => {
    expect(true).toBe(true);
    done();
  });

  it("Get All dea licenses", (done) => {
    const query = `
    {
      deaLicenses {
         dea_licenses {
          _id
         },
         pagination {
          page
          last_page
         }
      }
    }
    `;
    tester.test(true, query);
    done();
  });

  it("Get a license", (done) => {
    const query = `
    {
      deaLicense(id:"1") {
        _id
        name
      }
    }
    `;
    tester.test(true, query);
    done();
  });
});
