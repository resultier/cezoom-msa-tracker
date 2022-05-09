const AnalyticsService = require("../../services/analytics.service");

module.exports = {
  Query: {
    expirations: async (_source, {from, to}) => {
      return AnalyticsService.expirations(from, to);
    }
  }
};