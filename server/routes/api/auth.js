const express = require("express");
const router = express.Router();

const { check } = require("express-validator");

const auth = require("../../middleware/auth");

const { getUserById, getUserByAccount, authenticateUser } = require('../../controllers/authController');

// @route    GET api/auth
// @desc     Get user by id
// @access   Private
router.get("/", auth, getUserById);

// @route    GET api/auth/:account
// @desc     Get user by account
// @access   Private
router.get("/:account", auth, getUserByAccount);

// @route    POST api/auth
// @desc     Authenticate user & get token
// @access   Public
router.post(
  "/",
  check("account", "Wallet account is required").exists(),
  authenticateUser
);


module.exports = router;
