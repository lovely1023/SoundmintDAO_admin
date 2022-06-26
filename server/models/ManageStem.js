const mongoose = require("mongoose");

const ManageStemSchema = new mongoose.Schema({
    address: {
        type: String,
        require: true,
        default: null
    },
    nfts: {
        type: String,
        require: true,
        default: null,
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    }
});

module.exports = mongoose.model("manage_stem", ManageStemSchema);