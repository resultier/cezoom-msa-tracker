const EasyGraphQLTester = require("easygraphql-tester");
const { array: industrySchema } = require("../../../src/graphql/typeDef");

let tester;

beforeAll(async () => {
  tester = new EasyGraphQLTester(industrySchema);
});

describe("Industries Tests", () => {
  it("Industries test running success", (done) => {
    expect(true).toBe(true);
    done();
  });

  it("Get All industries", (done) => {
    const query = `
    {
      industries {
        _id
        name
      }
    }
    `;
    tester.test(true, query);
    done();
  });

  it("Get a userIndustriesByUser ", (done) => {
    const query = `
    {
      userIndustryLicenses {
        licences {
          _id
          profession {
            name
          },
          industry {
            name
          },
          state {
            name
          },
          country {
            name
          },
          detail {
            license_number,
            aquired_date,
            expiration_date,
            first_renewal,
            issue_date,
            licensed_by,
            graduation_date
            is_active,
            is_expired,
            is_renewed,
            file {
              buffer,
              size,
              type,
              name,
              alias
            }
          }
        },
        pagination {
          page,
          last_page
        }
      }
    }
    `;
    tester.test(true, query);
    done();
  });

  it("Get a industry", (done) => {
    const query = `
    {
      industry(id:"1") {
        _id
        name
      }
    }
    `;
    tester.test(true, query);
    done();
  });
});
