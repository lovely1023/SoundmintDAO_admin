const mongoose = require("mongoose");
require("mongoose-type-url");
const AuctionSchema = new mongoose.Schema({
  account: {
    type: String,
    require: true,
  },
  title: {
    type: String,
    require: true,
  },
  desc: {
    type: String,
    require: true,
  },
  start: {
    type: String,
    require: true,
  },
  end: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  mintText: {
    type: String,
    required: true,
  },
  isMintVisible: {
    type: Boolean,
    default: true,
    required: true,
  },
  metadata: {
    type: mongoose.SchemaTypes.Url,
    require: true,
    unique: true,
  },
});

module.exports = mongoose.model("auction", AuctionSchema);
