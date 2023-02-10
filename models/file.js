const mongoose = require("mongoose");

const File = new mongoose.Schema({
  path: {
    type: String,
    required: true,
  },
  orignalname: {
    type: String,
    required: true,
  },
  Password: String,
  downloadCount: {
    type: Number,
    required: true,
    default: 0,
  },
});

module.exports = mongoose.model("File", File);
