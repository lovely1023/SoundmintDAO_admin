const express = require("express");
const router = express.Router();

const { 
    getNFTs,
    updateNFTs,
    clearNFTs }
    = require('../../controllers/manageStemController');

// Private routes //
// @route   GET api/livemint/getPurchasedCount
router.get("/getNFTs/:walletAddress", getNFTs);
// @route   PUT api/livemint/updatePurchasedCount
router.put("/updateNFTs/:walletAddress", updateNFTs);
// @route   DELETE api/mintlist/deleteAllMintAddresses
router.delete("/clearNFTs", clearNFTs);
//

module.exports = router;