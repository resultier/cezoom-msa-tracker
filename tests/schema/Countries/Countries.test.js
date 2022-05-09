const EasyGraphQLTester = require("easygraphql-tester");
const { array: countrySchema } = require("../../../src/graphql/typeDef");

let tester;

beforeAll(async () => {
  tester = new EasyGraphQLTester(countrySchema);
});

describe("Countries Tests", () => {
  it("Countries test running success", (done) => {
    expect(true).toBe(true);
    done();
  });

  it("Get all countries", (done) => {
    const query = `
    {
        countries{
          name
          flag
          alpha2Code
        }
      }
    `;
    tester.test(true, query);
    done();
  });

  it("Get a country", (done) => {
    const query = `
    {
      country(id:"1") {
        _id
        name
      }
    }
    `;
    tester.test(true, query);
    done();
  });
});
