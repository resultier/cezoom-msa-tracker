const Country = require("../configs/database/models/Country");
const State = require("../configs/database/models/State");

const StatesService = {
  getAllStates: async function () {
    return State.find().exec();
  },
  getStateById: async function (id) {
    return State.findById(id).exec();
  },
  getStateByCountryAndName: async function (country, name) {
    const countryModel = await Country.findOne({ name: country }).exec();
    return State.findOne({ country_code: countryModel.alpha2Code, name: name });
  },
  getStateByCountryCode: async function (codes) {
    return State.find({ country_code: { $in: codes } }).exec();
  },
};

module.exports = StatesService;
