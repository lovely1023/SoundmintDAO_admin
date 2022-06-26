

const MemberEmail = require("../models/MemberEmail");

const getAllEmail = async (req, res) => {
    try {
        const memberEmails = await MemberEmail.find({}).sort('-createdAt').select("-__v")
        res.json({ result: memberEmails });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


const addMemberEmail = async (req, res) => {
    try {
        const { email, account } = req.body;

        // Validate if email exist in our database
        const oldEmail = await MemberEmail.findOne({ email: email.toLowerCase() });

        if (oldEmail) {
            return res.status(409).json({ isSuccess: false, message: "Member Exists" });
        }

        // Create member email in our database
        await MemberEmail.create({
            email: email.toLowerCase(),
            account
        });

        res.json({ isSuccess: true, message: "Thank you! Your submission has been received!" });
    } catch (error) {
        res.status(500).json({ isSuccess: false, message: "Error" });
    }
}


module.exports = {
    getAllEmail,
    addMemberEmail
}