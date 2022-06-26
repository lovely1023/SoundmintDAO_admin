const mongoose = require("mongoose");

const PurchaseLiveMintSchema = new mongoose.Schema({
    address: {
        type: String,
        require: true,
        default: null
    },
    purchases: {
        type: Number,
        required: true,
        default: 0
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

module.exports = mongoose.model("purchases_livemint", PurchaseLiveMintSchema);