const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");

const { getAllManageAuction, updateLiveMintDetail,
    updateGenesisAuctionDetail, updatePresaleDetail, updateSwitch, updateTotalSupply }
    = require('../../controllers/manageAuctionController');


// Private routes //

// @route   GET api/auction/getAll
router.get("/getAll", auth, getAllManageAuction);

// @route   PUT api/auction/updateLiveMint
router.put("/updateLiveMint", auth, updateLiveMintDetail);

// @route   PUT api/auction/updateGenesisAuction
router.put("/updateGenesisAuction", auth, updateGenesisAuctionDetail);

// @route   PUT api/auction/updatePresale
router.put("/updatePresale", auth, updatePresaleDetail);

// @route   PUT api/auction/updateSwitch
router.put("/updateSwitch", auth, updateSwitch);

// @route   PUT api/auction/updateTotalSupply
router.put("/updateTotalSupply", auth, updateTotalSupply);

//


module.exports = router;