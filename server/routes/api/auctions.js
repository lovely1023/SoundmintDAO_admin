const express = require("express");
const router = express.Router();
const { check } = require("express-validator");

const auth = require("../../middleware/auth");

const { createAuction,
  getAll,
  getAllAuctions,
  updateAuction,
  deleteAuction,
  updateMintVisibility
} = require('../../controllers/auctionsController');


// Public routes //

// @route   GET api/auctions/all
// @desc    Get all accounts auctions 
router.get("/all", getAllAuctions);

// Private routes //

// @route    POST api/auctions
// @desc     Add auction
router.post("/", auth,
  check("metadata", "MetaData URI is invalid").isURL(),
  createAuction
);

// @route   GET api/auctions
// @desc    Get auctions by account
router.get("/", auth, getAll);

// @route    POST api/auctions/update
// @desc     Update auction
router.post("/update", auth, updateAuction);

// @route    POST api/auctions/delete
// @desc     Delete auction
router.post("/delete", auth, deleteAuction);

// @route   PUT api/auctions/updateMintVisibility
// @desc    Update auctions Mint Visibility
router.put("/updateMintVisibility", auth, updateMintVisibility);


module.exports = router;
