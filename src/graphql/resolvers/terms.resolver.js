const TermsService = require("../../services/Terms.service");

module.exports = {
  Query: {
    terms: (_source, {}, context) => {
      return TermsService.terms();
    },
  },
  Mutation: {
    updateTerms: (_source, { input }, context) => {
      return TermsService.UpdateTerms(input);
    },
  },
};
