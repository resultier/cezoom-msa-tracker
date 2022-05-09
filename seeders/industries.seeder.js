import { Seeder } from "mongoose-data-seed";
import IndustriesJson from "../.resources/industries.json";
import Industry from "../src/configs/database/models/Industry";

class IndustriesSeeder extends Seeder {
  async shouldRun() {
    return Industry.countDocuments()
      .exec()
      .then((count) => count === 0);
  }

  async run() {
    return Industry.insertMany(IndustriesJson);
  }
}

export default IndustriesSeeder;
