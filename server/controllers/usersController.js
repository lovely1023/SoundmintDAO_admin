const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const config = require("config");
const { validationResult } = require("express-validator");

const User = require("../models/User");

//Not-used
const registerUser = async (req, res) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { name, email, account } = req.body;

        // Validate if user exist in our database
        const oldUser = await User.findOne({ account });

        if (oldUser) {
            return res.status(409).send("Cannot register because user with this account is already exist");
        }

        // Create user in our database
        const user = await User.create({
            name,
            email: email.toLowerCase(),
            account,
            role: "user",
        });

        // Create token
        jwt.sign(
            { id: user.id, role: "user" },
            config.get("jwtSecret"),
            { expiresIn: "5 days" },
            (err, token) => {
                if (err) throw err;
                res.json({ token });
            }
        );
        // save user token
        user.token = token;
    } catch (error) {
        console.log(error);
    }
}


module.exports = { registerUser };