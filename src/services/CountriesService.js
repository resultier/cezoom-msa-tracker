const Country = require("../configs/database/models/Country");
const PresenterCountries = require("../configs/database/models/PresenterCountries");
const EmployeeCountries = require("../configs/database/models/EmployeeCountries");

const CountriesService = {
  getAllCountries: async function () {
    return Country.find().exec();
  },
  getCountryById: async function (id) {
    return Country.findById(id).exec();
  },
  getCountriesByPresenter: async function (id) {
    return PresenterCountries.findOne({ "user.id": id });
  },
  getCountriesByEmployee: async function (id) {
    return EmployeeCountries.findOne({ "user.id": id });
  },
  createPresenterCountries: async function (data) {
    const { user_id } = data;
    return PresenterCountries.findOneAndUpdate({ user_id }, data, {
      new: true,
      upsert: true,
    });
  },
  createEmployeeCountries: async function (data) {
    const { user_id } = data;
    return EmployeeCountries.findOneAndUpdate({ user_id }, data, {
      new: true,
      upsert: true,
    });
  },
  addPresenterCountry: async function (data, user) {
    const { id } = user;
    const { country } = data;
    const updatedCountry = await PresenterCountries.updateOne(
      { user_id: id },
      { $push: { countries: country } }
    );

    return updatedCountry.nModified === 1
      ? PresenterCountries.findOne({ user_id: id })
      : new Error(`Country not added`);
  },
  updateCountryPresenter: async function (data, user) {
    const { id } = user;
    const {
      country: {
        _id,
        name,
        alpha2Code,
        alpha3Code,
        region,
        flag,
        callingCodes,
      },
    } = data;
    const updatedCountry = await PresenterCountries.updateOne(
      { user_id: id, "countries._id": _id },
      {
        $set: {
          "countries.$.name": name,
          "countries.$.alpha2Code": alpha2Code,
          "countries.$.alpha3Code": alpha3Code,
          "countries.$.region": region,
          "countries.$.flag": flag,
          "countries.$.callingCodes": callingCodes,
        },
      }
    );

    return PresenterCountries.findOne({ user_id: id });
  },
  deleteCountryPresenter: async function (countryId, user) {
    const { id } = user;
    const { countries } = await PresenterCountries.findOne({ user_id: id });
    const updatedCountries = countries.filter(
      (country) => country._id.toString() !== countryId.toString()
    );

    return PresenterCountries.findOneAndUpdate(
      { user_id: id },
      { countries: updatedCountries },
      { new: true }
    );
  },
  addEmployeeCountry: async function (data, user) {
    const { id } = user;
    const { country } = data;
    const updatedCountry = await EmployeeCountries.updateOne(
      { user_id: id },
      { $push: { countries: country } }
    );

    return updatedCountry.nModified === 1
      ? EmployeeCountries.findOne({ user_id: id })
      : new Error(`Country not added`);
  },
  updateCountryEmployee: async function (data, user) {
    const { id } = user;
    const {
      country: {
        _id,
        name,
        alpha2Code,
        alpha3Code,
        region,
        flag,
        callingCodes,
      },
    } = data;
    await EmployeeCountries.updateOne(
      { user_id: id, "countries._id": _id },
      {
        $set: {
          "countries.$.name": name,
          "countries.$.alpha2Code": alpha2Code,
          "countries.$.alpha3Code": alpha3Code,
          "countries.$.region": region,
          "countries.$.flag": flag,
          "countries.$.callingCodes": callingCodes,
        },
      }
    );

    return EmployeeCountries.findOne({ user_id: id });
  },
  deleteCountryEmployee: async function (countryId, user) {
    const { id } = user;
    const { countries } = await EmployeeCountries.findOne({ user_id: id });
    const updatedCountries = countries.filter(
      (country) => country._id.toString() !== countryId.toString()
    );

    return EmployeeCountries.findOneAndUpdate(
      { user_id: id },
      { countries: updatedCountries },
      { new: true }
    );
  },
};

module.exports = CountriesService;
