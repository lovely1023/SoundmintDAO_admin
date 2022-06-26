const mongoose = require("mongoose");

const MintWhitelistSchema = new mongoose.Schema({
    address: {
        type: String,
        required: true,
    },
    number: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("whitelist", MintWhitelistSchema);