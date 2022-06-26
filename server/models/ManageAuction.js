const mongoose = require("mongoose");

const ManageAuctionSchema = new mongoose.Schema({
    liveMintStartTime: {
        type: String,
        require: true,
        default: null
    },
    liveMintEndTime: {
        type: String,
        require: true,
        default: null,
    },
    genesisAuctionStartTime: {
        type: String,
        require: true,
        default: null
    },
    genesisAuctionEndTime: {
        type: String,
        require: true,
        default: null
    },
    preSaleStartTime: {
        type: String,
        require: true,
        default: null
    },
    preSaleEndTime: {
        type: String,
        require: true,
        default: null
    },
    isMinting: {
        type: Boolean,
        required: true,
        default: false
    },
    isPrivateSale: {
        type: Boolean,
        required: true,
        default: false
    },
    isPublicSale: {
        type: Boolean,
        required: true,
        default: false
    },
    isPreSale: {
        type: Boolean,
        required: true,
        default: false
    },
    totalSupply: {
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

module.exports = mongoose.model("manage_auction", ManageAuctionSchema);