import mongoose from "mongoose";
import CountriesSeeder from "./seeders/countries.seeder";
import IndustriesSeeder from "./seeders/industries.seeder";
import StatesSeeder from "./seeders/states.seeder";
import { MONGO_DB_URL } from "./src/utils/constants";

const mongoURL = MONGO_DB_URL || "mongodb://localhost:27017/assets";

/**
 * Seeders List
 * order is important
 * @type {Object}
 */
export const seedersList = {
  CountriesSeeder,
  StatesSeeder,
  IndustriesSeeder,
};
/**
 * Connect to mongodb implementation
 * @return {Promise}
 */
export const connect = async () =>
  await mongoose.connect(mongoURL, {
    useNewUrlParser: true,
  });
/**
 * Drop/Clear the database implementation
 * @return {Promise}
 */
export const dropdb = async () => mongoose.connection.db.dropDatabase();
