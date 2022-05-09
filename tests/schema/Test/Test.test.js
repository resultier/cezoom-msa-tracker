const EasyGraphQLTester = require("easygraphql-tester");
const { array: testSchema } = require("../../../src/graphql/typeDef");

describe("Test Tests", () => {
  let tester;

  beforeEach(() => {
    tester = new EasyGraphQLTester(testSchema);
  });

  it("Test test running success", (done) => {
    expect(true).toBe(true);
    done();
  });

  /*it("Get all Test", (done) => {
    const query = `
    {
        tests {
          _id
          version
        }
    }      
    `;
    tester.test(true, query);
    done();
  });

  it("Get a test  by id", (done) => {
    const query = `
    {
        test(id:1){
          version
          _id
        }
    }
    `;
    tester.test(true, query);
    done();
  });

  it("Get a test by user id", (done) => {
    const query = `
    {
        testsByUser(id: 1) {
          test {
            _id
            version
          }
          user {
            id
            email
          }
        }
      }      
    `;
    tester.test(true, query);
    done();
  });

  it("Get a test by course id", (done) => {
    const query = `{
        testsByCourse(id: 1) {
            version
        }
      }      
    `;
    tester.test(true, query);
    done();
  });*/
});
