const TestService = require("../../services/Test.service");

module.exports = {
  Query: {
    test: (_source, { id }, context) => {
      return TestService.getTest(id,context.user);
    },
    tests: (_source, { page, filters }, context) => {
      return TestService.getTests(page,undefined,undefined,undefined,filters,context.token);
    },
    testsByCompany: (_source, { page, filters }, context) => {
      return TestService.getTests(page,undefined,context.user.company,undefined,filters,context.token);
    },
    testsByUser: (_source, { page, filters }, context) => {
      return TestService.getTests(page,context.user.id,undefined,undefined,filters,context.token);
    },
    testsByIds: (_source, { user_id, ids }, context) => {
      return TestService.getUserTestsByIds(user_id,ids);
    },
    testAtendees: (_source, { _id, page, filters }, context) => {
      return TestService.getTestAtendees(_id,page,filters,context.token);
    },
    testAtendeeAnswers: (_source, { user_id, test_id }, context) => {
      return TestService.getTestAtendeeAnswers(user_id,test_id)
    },
    testAnalytics: (_source, { _id, page, filters }, context) => {
      return TestService.getTestAnalytics(_id,page,filters,context.token);
    }
  },
  Mutation: {
    test: (_source, { input }, context) => {
      return TestService.saveTest(input);
    },
    testQuestion: (_source, { input }, context) => {
      return TestService.saveTestQuestion(input);
    },
    answerTestQuestion: (_source, { input }, context) => {
      return TestService.answerTestQuestion(input,context.user);
    },
    finishTest: (_source, { id }, context) => {
      return TestService.finishTest(id,context.user);
    }
  }
};
