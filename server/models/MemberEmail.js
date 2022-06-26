const mongoose = require("mongoose");

const MemberEmailSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    account: {
        type: String,
        default: null
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("member_email", MemberEmailSchema);