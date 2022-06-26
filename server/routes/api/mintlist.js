const express = require("express");
const router = express.Router();

const { uploadMintlist, getAllMintlist, getLivemintWhitelist, getMerkleProofs, 
        getMerkleRoot, deleteMintAddress, deleteAllMintAddresses, getNftIdListByAccount }
    = require('../../controllers/mintlistController');
const auth = require("../../middleware/auth");


// Public routes //

// @route   GET api/mintlist/getAllAllowed
router.get("/getAllAllowed", getAllMintlist);

// @route   GET api/mintlist/getNftIdListByAccount
router.get("/getNftIdListByAccount/:walletAddress", auth, getNftIdListByAccount);

//  @route   GET api/mintlist/getMerkleProofs
router.get("/getMerkleProofs/:walletAddress", getMerkleProofs);

//  @route   GET api/mintlist/getMerkleRoot
router.get("/getMerkleRoot", getMerkleRoot);

// @route   GET api/mintlist/getLivemintWhitelist
router.get("/getLivemintWhitelist", getLivemintWhitelist);

// Private routes //

// @route   POST api/mintlist/uploadMint
router.post("/uploadMint", auth, uploadMintlist);

// @route   DELETE api/mintlist/deleteMintAddress
router.delete("/deleteMintAddress", auth, deleteMintAddress);

// @route   DELETE api/mintlist/deleteAllMintAddresses
router.delete("/deleteAllMintAddresses", auth, deleteAllMintAddresses);


module.exports = router;