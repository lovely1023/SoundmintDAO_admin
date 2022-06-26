const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");

const frontendAuth = require("../../middleware/frontendAuth");

const { getAllEmail, addMemberEmail }
    = require('../../controllers/memberEmailController');


// @route   GET api/memberemail/getAll
router.get("/getAll", auth, getAllEmail);


// @route   POST api/memberemail/addMember
//Remove this after auth will work well
router.post("/addMember", addMemberEmail);

// @route   POST api/memberemail/add
router.post("/add", frontendAuth, addMemberEmail);



module.exports = router;