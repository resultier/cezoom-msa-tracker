const EasyGraphQLTester = require("easygraphql-tester");

const { array: stateSchema } = require("../../../src/graphql/typeDef");

let tester;

beforeAll(async () => {
  tester = new EasyGraphQLTester(stateSchema);
});

describe("States Tests", () => {
  it("States test running success", (done) => {
    expect(true).toBe(true);
    done();
  });

  it("Get all states", (done) => {
    const query = `
    {
        states {
          name,
          country_code
        }
    }
    `;
    tester.test(true, query);
    done();
  });

  it("Get a state by country code", (done) => {
    const query = `
    {
        stateByCountry(codes:["DO"]){
          name,
          country_code,
          state_code
        }
    }
    `;
    tester.test(true, query);
    done();
  });
});
