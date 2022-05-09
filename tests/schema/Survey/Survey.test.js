const EasyGraphQLTester = require("easygraphql-tester");
const { array: surveySchame } = require("../../../src/graphql/typeDef");

let tester;

beforeAll(async () => {
  tester = new EasyGraphQLTester(surveySchame);
});

describe("Survey Tests", () => {
  it("Survey test running success", (done) => {
    expect(true).toBe(true);
    done();
  });

  /*it("Get all Survey", (done) => {
    const query = `
    {
        surveys {
          _id
          name
        }
    }      
    `;
    tester.test(true, query);
    done();
  });

  it("Get a survey by id", (done) => {
    const query = `
    {
        survey(id:1){
          name
          _id
        }
    }
    `;
    tester.test(true, query);
    done();
  });

  it("Get a survey by user id", (done) => {
    const query = `
    {
        surveysByUser(id: 1) {
          survey {
            _id
            name
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

  it("Get a survey by course id", (done) => {
    const query = `
    {
        surveysByCourse(id: 1) {
            name
            options {
              name
            }
        }
      }      
    `;
    tester.test(true, query);
    done();
  });*/
});
