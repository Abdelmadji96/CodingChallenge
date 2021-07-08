const mongoose = require("mongoose");
const Text = mongoose.model("Text", {
  content: String,
  language: String,
});
module.exports = { Text };
