const StatesService = require("../../services/StatesService");

module.exports = {
  Query: {
    states: () => {
      return StatesService.getAllStates();
    },
    state: (_source, { id }) => {
      return StatesService.getStateById(id);
    },
    stateByCountryAndName: (_source, { country, name }) => {
      return StatesService.getStateByCountryAndName(country, name);
    },
    stateByCountry: (_source, { codes }, context) => {
      return StatesService.getStateByCountryCode(codes);
    },
  },
};
