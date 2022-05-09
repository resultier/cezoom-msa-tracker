const mongoose = require("mongoose");
const { TopicSchema } = require("db-schema");

const Topic = mongoose.model("Topic", TopicSchema);

module.exports = Topic;
