const CountriesService = require("../../services/CountriesService");

module.exports = {
  Query: {
    countries: () => {
      return CountriesService.getAllCountries();
    },
    country: (_source, { id }) => {
      return CountriesService.getCountryById(id);
    },
    presenterCountries: (_source, { id }) => {
      return CountriesService.getCountriesByPresenter(id);
    },
    employeeCountries: (_source, { id }) => {
      return CountriesService.getCountriesByEmployee(id);
    },
  },
  Mutation: {
    addCountriesPresenter: (_source, { data }, context) => {
      data.user_id = context.user.id;
      return CountriesService.createPresenterCountries(data);
    },
    addCountryPresenter: (_source, { data }, context) => {
      return CountriesService.addPresenterCountry(data, context.user);
    },
    updateCountryPresenter: (_source, { data }, context) => {
      return CountriesService.updateCountryPresenter(data, context.user);
    },
    deleteCountryPresenter: (_source, { country }, context) => {
      return CountriesService.deleteCountryPresenter(country, context.user);
    },
    addCountriesEmployee: (_source, { data }, context) => {
      data.user_id = context.user.id;
      return CountriesService.createEmployeeCountries(data);
    },
    addCountryEmployee: (_source, { data }, context) => {
      return CountriesService.addEmployeeCountry(data, context.user);
    },
    updateCountryEmployee: (_source, { data }, context) => {
      return CountriesService.updateCountryEmployee(data, context.user);
    },
    deleteCountryEmployee: (_source, { country }, context) => {
      return CountriesService.deleteCountryEmployee(country, context.user);
    },
  },
};
