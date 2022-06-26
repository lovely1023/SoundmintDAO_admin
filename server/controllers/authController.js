const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const config = require("config");

const User = require("../models/User");


const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
}

const getUserByAccount = async ({ params: { account } }, res) => {
    try {
        const user = await User.find({ account: account });
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
}

const authenticateUser = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const adminAddress = process.env.ADMIN_ADDRESS;
        let adminAddressesArray = [];
        if (adminAddress) {
            adminAddressesArray = adminAddress.toLowerCase().split(',');
        }
        adminAddressesArray.push(config.get("sohamAddress"))

        if (!adminAddressesArray.includes(req.body.account.toLowerCase())) {
            return res
                .status(400)
                .json({ errors: [{ msg: "Your wallet doesn't have enough permission to perform this action" }] });
        }

        jwt.sign(
            { account: req.body.account },
            config.get("jwtSecret"),
            { expiresIn: "5 days" },
            (err, token) => {
                if (err) throw err;
                res.json({ token });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
}

module.exports = {
    getUserById,
    getUserByAccount,
    authenticateUser
}