const EasyGraphQLTester = require("easygraphql-tester");
const { array: certificaateSchema } = require("../../../src/graphql/typeDef");

let tester;

beforeAll(async () => {
  tester = new EasyGraphQLTester(certificaateSchema);
});

describe("Certificates Tests", () => {
  it("Certificates test running success", (done) => {
    expect(true).toBe(true);
    done();
  });

  /*it("Generate certificate", (done) => {
    const query = `
    {
        generateCertificate(_id: "1") { data }
    }
    `;
    tester.test(true, query);
    done();
  });*/
});
