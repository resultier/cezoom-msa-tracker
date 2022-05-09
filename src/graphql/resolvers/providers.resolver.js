const ProviderService = require("../../services/ProviderService");

module.exports = {
  Query: {
    providers: (_source, { keywords, state }, { user: { id } }) => {
      return ProviderService.getAllProviders(id, keywords, state);
    },
    provider: (_source, { providerId }, { user: { id } }) => {
      return ProviderService.getProvider(id, providerId);
    },
    providerStatistics: (_source, {}, { user: { id } }) => {
      return ProviderService.getProviderStatistics(id);
    },
  },
  Mutation: {
    addProvider: (_souce, { input }, { user: { id } }) => {
      input.user_id = id;
      return ProviderService.addProvider(input);
    },
    updateProvider: (_source, { input }, { user: { id } }) => {
      input.user_id = id;
      return ProviderService.updateProvider(input);
    },
    deleteProvider: (_source, { id }, { user: { id: user_id } }) => {
      return ProviderService.deleteProvider(id, user_id);
    },
    inactiveProvider: (_source, { id }, { user: { id: user_id } }) => {
      return ProviderService.inactiveProvider(id, user_id);
    },
  },
};
