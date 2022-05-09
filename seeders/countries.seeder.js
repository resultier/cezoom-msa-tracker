import { Seeder } from "mongoose-data-seed";
import CountriesJson from "../.resources/countries.json";
import Country from "../src/configs/database/models/Country";

class CountriesSeeder extends Seeder {
  async shouldRun() {
    return Country.countDocuments()
      .exec()
      .then((count) => count === 0);
  }

  async run() {
    return Country.insertMany(
      CountriesJson.map((item) => {
        return {
          ...item,
          flag: `https://flagcdn.com/256x192/${item.alpha2Code.toLowerCase()}.png`,
        };
      })
    );
  }
}

export default CountriesSeeder;
