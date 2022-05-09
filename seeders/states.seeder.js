import { Seeder } from "mongoose-data-seed";
import StatesJson from "../.resources/states.json";
import State from "../src/configs/database/models/State";

class StatesSeeder extends Seeder {
  async shouldRun() {
    return State.countDocuments()
      .exec()
      .then((count) => count === 0);
  }

  async run() {
    return State.insertMany(StatesJson);
  }
}

export default StatesSeeder;
