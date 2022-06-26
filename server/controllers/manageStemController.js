const ManageStem = require("../models/ManageStem");
const { createAlchemyWeb3 } = require('@alch/alchemy-web3');
const web3 = createAlchemyWeb3(
    process.env.ALCHEMY_API,
);
require('dotenv').config();
const LiveMintABI = require("../artifacts/contracts/live-mint.json");
const WAValidator = require("wallet-address-validator");
const {procTokensOfOwner, getTokenData} = require("../utils/alchemy");

const getNFTs = async (req, res) => {
    try {
        const { walletAddress } = req.params;
        if (!walletAddress) {
            return res.status(401).json({ error: true, message: 'Wallet address is required' });
        }

        const valid = WAValidator.validate(walletAddress, 'ETH');
        if (!valid) {
            return res.status(408).json({ error: true, message: 'Invalid ethereum wallet address' });
        }

        const stem = await ManageStem.find({ address: walletAddress })
        if (stem.length === 0) {
            const tokenContract = new web3.eth.Contract(LiveMintABI, process.env.LIVE_MINT_CONTRACT_ADDRESS);
            const tokens = await tokenContract.methods.tokensOfOwner(walletAddress).call();    
            const data = await getTokenData(tokenContract, tokens);

            let managestem = new ManageStem({})
            managestem.address = walletAddress;
            managestem.nfts = JSON.stringify(data);
            managestem.createdAt = Date.now();
            managestem.updatedAt = Date.now();

            managestem.save().then((result) => {
                res.json({ message: 'Successed', result: result.nfts });
            });
        } else {
            res.json({ message: 'Successed', result: JSON.parse(stem[0].nfts) });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const updateNFTs = async (req, res) => {
    try {
        const { walletAddress } = req.params;
        if (!walletAddress) {
            return res.status(500).json({ error: true, message: 'Wallet address is required' });
        }
        const valid = WAValidator.validate(walletAddress, 'ETH');
        if (!valid) {
            return res.status(500).json({ error: true, message: 'Invalid ethereum wallet address' });
        }
        const result = await procTokensOfOwner(walletAddress)
        if (result.value === 0) {
            res.status(200).json({ 
                message: 'Success update',
                data: result.data
            });
        } else {
            res.status(500).json({ message: 'Failed tokensOfOwner' });
        }
    } catch {

    }
}

const clearNFTs = async (req, res) => {
    ManageStem.deleteMany({}).then(function () {
        return res.status(200).json({ message: 'All NFT data successfully deleted' });
    }).catch(function (error) {
        res.status(500).json({ message: error.message });
    });
}

module.exports = {
    getNFTs,
    updateNFTs,
    clearNFTs
}