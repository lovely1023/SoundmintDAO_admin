const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");

const { 
    getStatusLiveMintFromContract, 
    updateDBLiveMintStatus,
    getAllManageLiveMintDB, 
    updateLiveMintDetail,
    updateGenesisLiveMintDetail, 
    updatePresaleDetail, 
    updateSwitch, 
    updateTotalSupply,
    getMintingState,
    getPreSaleState,
    getPublicSaleState,
    getSalePriceETH,
    getSalePriceAPE,
    getTotalCount,
    getSupplyCount,
    getPurchasedCount,
    getLivemintPageStatus,
    updatePurchasedCount }
    = require('../../controllers/manageLiveMintController');


// Private routes //
// @route   GET api/livemint/getAllDB
router.get("/getAllDB", getAllManageLiveMintDB);









// @route   GET api/livemint/getAll
router.get("/getAll/:walletAddress", getStatusLiveMintFromContract);
router.get("/getAll", getStatusLiveMintFromContract);

// @route   GET api/livemint/getStatusLiveMintFromContract
router.get("/getStatusLiveMintFromContract", getStatusLiveMintFromContract);

// @route   GET api/livemint/getMintingState
router.get("/getMintingState", getMintingState);
// @route   GET api/livemint/getPreSaleState
router.get("/getPreSaleState", getPreSaleState);
// @route   GET api/livemint/getPublicSaleState
router.get("/getPublicSaleState", getPublicSaleState);
// @route   GET api/livemint/getSalePriceETH
router.get("/getSalePriceETH", getSalePriceETH);
// @route   GET api/livemint/getSalePriceAPE
router.get("/getSalePriceAPE", getSalePriceAPE);
// @route   GET api/livemint/getTotalCount
router.get("/getTotalCount", getTotalCount);
// @route   GET api/livemint/getSupplyCount
router.get("/getSupplyCount", getSupplyCount);
// @route   GET api/livemint/getPurchasedCount
router.get("/getPurchasedCount/:walletAddress", getPurchasedCount);
// @route   PUT api/livemint/updatePurchasedCount
router.put("/updatePurchasedCount/:walletAddress", updatePurchasedCount);
// @route   GET api/livemint/getLivemintPageStatus
router.get("/getLivemintPageStatus", getLivemintPageStatus);


// @route   GET api/livemint/updateDBLiveMintStatus
router.put("/updateDBLiveMintStatus", auth, updateDBLiveMintStatus);

// @route   PUT api/livemint/updateLiveMint
router.put("/updateLiveMint", auth, updateLiveMintDetail);

// @route   PUT api/livemint/updateGenesisLiveMint
router.put("/updateGenesisLiveMint", auth, updateGenesisLiveMintDetail);

// @route   PUT api/livemint/updatePresale
router.put("/updatePresale", auth, updatePresaleDetail);

// @route   PUT api/livemint/updateSwitch
router.put("/updateSwitch", auth, updateSwitch);

// @route   PUT api/livemint/updateTotalSupply
router.put("/updateTotalSupply", updateTotalSupply);

//


module.exports = router;