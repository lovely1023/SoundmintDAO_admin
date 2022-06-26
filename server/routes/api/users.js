const express = require("express");
const router = express.Router();

const { check } = require("express-validator");

const { registerUser } = require('../../controllers/usersController')

const { MerkleTree } = require("merkletreejs");
const keccak256 = require("keccak256");

const MintWhitelist = require('../../models/MintWhitelist');
const WAValidator = require("wallet-address-validator");

// @route    POST api/users
// @desc     Register user
// @access   Public
router.post(
  "/",
  check("name", "Name is required").notEmpty(),
  check("email", "Please include a valid email").isEmail(),
  check("account", "Wallet account is required").notEmpty(),
  registerUser
);

// @route    GET api/users/merkleroot

router.get('/:walletAddress', async (req, res) => {
  const { walletAddress }= req.params;
  valid = WAValidator.validate(walletAddress, 'ETH');
  console.log("====user==merkelroot=", walletAddress);
  console.log("====user==merkelroot=", req.params);
  console.log(valid)
  if(!valid) {
    res.json({ message: 'Invalidate address', merkleRoot: "", isUpdated: false });
    return
  }

  try {
    const allMints = await MintWhitelist.find({})
      .select("-__v")
      .select("-_id")
      .select("-number")
      .select("-createdAt");

    const whitelistArray = allMints.map(({ address }) => address)

    const leaves = whitelistArray.map(x => keccak256(x));
    const merkleTree = new MerkleTree(leaves, keccak256, { sortPairs: true });

    const hashedAddress = keccak256(walletAddress);
    let hexProof = merkleTree.getHexProof(hashedAddress);
    let proof = merkleTree.getProof(hashedAddress);
    // console.log("root--", merkleTree.getRoot().toString('hex'));
    console.log("proofs--", hexProof);

    // Check proof
    let v = merkleTree.verify(hexProof, hashedAddress, merkleTree.getRoot().toString('hex'))
    console.log(v)

    if (hexProof.length == 0) {
      mintaddress = new MintWhitelist({
        address: walletAddress,
        number: whitelistArray.length + 1,
        createdAt: Date.now()
      });
  
      mintaddress.save().then(() => {
        console.log("success added")
      });      

      res.json({ message: 'You are registered in the WhiteList', merkleRoot: "0x" + merkleTree.getRoot().toString('hex'), isUpdated: true });
    } else {
      res.json({ message: 'You are on the WhiteList already', merkleRoot: "0x" + merkleTree.getRoot().toString('hex'), isUpdated: false });
    }
  } catch (error) {
    res.status(500).json({ message: error.message, isValidUser: false });
  }
})

module.exports = router;
