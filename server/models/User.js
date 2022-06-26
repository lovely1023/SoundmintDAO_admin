const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  account: {
    type: String,
    require: true,
    unique: true,
  },
  role: {
    type: String,
    default: 'user',
    enum: ["user", "admin", "superadmin"]
  },
  token: { type: String },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("user", UserSchema);
