const mongoose = require("mongoose");

const ManageLiveMintSchema = new mongoose.Schema({
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
    genesisLiveMintStartTime: {
        type: String,
        require: true,
        default: null
    },
    genesisLiveMintEndTime: {
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
    isDisplayLiveMintPage: {
        type: Boolean,
        required: true,
        default: false
    },
    salePriceETH: {
        type: Number,
        required: true,
        default: 0
    },
    salePriceAPE: {
        type: Number,
        required: true,
        default: 0
    },
    supplyCount: {
        type: Number,
        required: true,
        default: 0
    },
    totalCount: {
        type: Number,
        required: true,
        default: 0
    },
    owner: {
        type: String,
        require: true,
        default: null
    },
    presaleMintedQty: {
        type: Number,
        require: true,
        default: null
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

module.exports = mongoose.model("manage_livemint", ManageLiveMintSchema);