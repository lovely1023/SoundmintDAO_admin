const ManageLiveMint = require("../models/ManageLiveMint");
const PurchaseLiveMint = require("../models/PurchaseLiveMint");

const { createAlchemyWeb3 } = require('@alch/alchemy-web3');
const web3 = createAlchemyWeb3(
    process.env.ALCHEMY_API,
);
require('dotenv').config();
const LiveMintABI = require("../artifacts/contracts/live-mint.json");
const ethers = require("ethers");
const WAValidator = require("wallet-address-validator");
const { getLiveMintContractStatus, procTokensOfOwner } = require("../utils/alchemy");

const getStatusLiveMintFromContract = async (req, res) => {
    const { walletAddress } = req.params;
    const contractRes = await getLiveMintContractStatus(walletAddress);

    if (contractRes === -1) {
        res.status(200).json({
            error: true,
            data: 'Failed to load contract'
        }); 
    } else if (contractRes === -2) {
        res.status(200).json({
            error: true,
            data: 'Internal server error'
        }); 
    }
    res.status(200).json({
        error: false,
        data: contractRes
    });    
}


const updateDBLiveMintStatus = async (req, res) => {
    const { walletAddress } = req.params;
    const contractRes = await getLiveMintContractStatus(walletAddress)

    if (contractRes === -1) {
        res.status(200).json({
            error: true,
            data: 'Failed to load contract'
        }); 
    } else if (contractRes === -2) {
        res.status(200).json({
            error: true,
            data: 'Internal server error'
        }); 
    }

    let manageLiveMint = await ManageLiveMint.find({});

    if (manageLiveMint.length === 0) {
        livemint = new ManageLiveMint({});
        livemint.isMinting = contractRes.isMinting;
        livemint.isPreSale = contractRes.isPreSale;
        livemint.isPublicSale = contractRes.isPublicSale;
        livemint.salePriceETH = contractRes.salePriceETH;
        livemint.salePriceAPE = contractRes.salePriceAPE;
        livemint.totalCount = contractRes.totalCount;
        livemint.supplyCount = contractRes.supplyCount;
        livemint.owner = contractRes.owner;
        livemint.presaleMintedQty = contractRes.presaleMintedQty;
        livemint.createdAt = Date.now();

        livemint.save().then((result) => {
            res.json({ result: result, message: 'The status of live mint created successfully.' });
        });
    } else {
        let id = manageLiveMint[0]._id.toString();
        let livemint = await ManageLiveMint.findOne({ _id: id });

        livemint.isMinting = contractRes.isMinting;
        livemint.isPreSale = contractRes.isPreSale;
        livemint.isPublicSale = contractRes.isPublicSale;
        livemint.salePriceETH = contractRes.salePriceETH;
        livemint.salePriceAPE = contractRes.salePriceAPE;
        livemint.totalCount = contractRes.totalCount;
        livemint.supplyCount = contractRes.supplyCount;
        livemint.owner = contractRes.owner;
        livemint.presaleMintedQty = contractRes.presaleMintedQty;
        livemint.updatedAt = Date.now();
        livemint.save().then((result) => {
            res.json({ result: result, message: 'The status of live mint updated successfully.' });
        });
    }
}

const getAllManageLiveMintDB = async (req, res) => {
    try {
        const liveMint = await ManageLiveMint.find({})
        if (liveMint.length === 0) {
            let manageLiveMint = new ManageLiveMint({})
            manageLiveMint.save().then((result) => {
                res.json({ result: result, message: 'Blank record successfully created.' });
            });
        } else {
            res.json({ result: liveMint });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const updateLiveMintDetail = async (req, res) => {
    try {
        const { _id, liveMintStartTime, liveMintEndTime } = req.body;

        if (!_id) {
            res.json({ message: 'Id is required' });
        } else if (!liveMintStartTime || !liveMintEndTime) {
            res.json({ message: 'Provide both start and end time' })
        } else {
            let manageLiveMint = await ManageLiveMint.findOne({ _id });
            if (!manageLiveMint) {
                return res
                    .status(400)
                    .json({ message: "Live Mint details not found" });
            }
            manageLiveMint.liveMintStartTime = liveMintStartTime;
            manageLiveMint.liveMintEndTime = liveMintEndTime;
            manageLiveMint.updatedAt = Date.now();

            manageLiveMint.save().then(() => {
                res.json({ message: "Live Mint details successfully updated" });
            });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const updateGenesisLiveMintDetail = async (req, res) => {
    try {
        const { _id, genesisLiveMintStartTime, genesisLiveMintEndTime } = req.body;

        if (!_id) {
            res.json({ message: 'Id is required' });
        } else if (!genesisLiveMintStartTime || !genesisLiveMintEndTime) {
            res.json({ message: 'Provide both start and end time' })
        } else {
            let manageLiveMint = await ManageLiveMint.findOne({ _id });
            if (!manageLiveMint) {
                return res
                    .status(400)
                    .json({ message: "Genesis LiveMint details not found." });
            }
            manageLiveMint.genesisLiveMintStartTime = genesisLiveMintStartTime;
            manageLiveMint.genesisLiveMintEndTime = genesisLiveMintEndTime;
            manageLiveMint.updatedAt = Date.now();

            manageLiveMint.save().then(() => {
                res.json({ message: "Genesis LiveMint details successfully updated" });
            });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const updatePresaleDetail = async (req, res) => {
    try {
        const { _id, preSaleStartTime, preSaleEndTime } = req.body;

        if (!_id) {
            res.json({ message: 'Id is required' });
        } else if (!preSaleStartTime || !preSaleEndTime) {
            res.json({ message: 'Provide both start and end time' })
        } else {
            let manageLiveMint = await ManageLiveMint.findOne({ _id });
            if (!manageLiveMint) {
                return res
                    .status(400)
                    .json({ message: "Pre sale details not found." });
            }
            manageLiveMint.preSaleStartTime = preSaleStartTime;
            manageLiveMint.preSaleEndTime = preSaleEndTime;
            manageLiveMint.updatedAt = Date.now();

            manageLiveMint.save().then(() => {
                res.json({ message: "Pre sale details successfully updated" });
            });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const updateSwitch = async (req, res) => {
    try {
        const { _id, operation, isMinting, isPrivateSale, isPublicSale, isPreSale, isDisplayLiveMintPage } = req.body;

        let manageLiveMint = await ManageLiveMint.findOne({ _id });
        if (!manageLiveMint) {
            res.status(400).json({ message: "Genesis LiveMint details not found." });
        } else if (operation === 'minting' && isMinting !== undefined) {
            manageLiveMint.isMinting = isMinting;
            manageLiveMint.updatedAt = Date.now();

            manageLiveMint.save().then(() => {
                res.json({ message: 'Minting successfully updated' })
            });
        } else if (operation === 'privatesale' && isPrivateSale !== undefined) {
            manageLiveMint.isPrivateSale = isPrivateSale;
            manageLiveMint.updatedAt = Date.now();

            manageLiveMint.save().then(() => {
                res.json({ message: 'Private sale successfully updated' })
            });
        } else if (operation === 'publicsale' && isPublicSale !== undefined) {
            manageLiveMint.isPublicSale = isPublicSale;
            manageLiveMint.updatedAt = Date.now();

            manageLiveMint.save().then(() => {
                res.json({ message: 'Public sale successfully updated' })
            });
        } else if (operation === 'presale' && isPreSale !== undefined) {
            manageLiveMint.isPreSale = isPreSale;
            manageLiveMint.totalSupply = 0;
            manageLiveMint.updatedAt = Date.now();

            manageLiveMint.save().then(() => {
                res.json({ message: 'Pre sale successfully updated' })
            });
        } else if (operation === 'livemintpage' && isDisplayLiveMintPage !== undefined) {
            manageLiveMint.isDisplayLiveMintPage = isDisplayLiveMintPage;
            manageLiveMint.updatedAt = Date.now();

            manageLiveMint.save().then(() => {
                res.json({ message: 'Live-mint page status successfully updated' })
            });
        }
        else {
            res.status(500).json({ message: 'Something went wrong!' })
        }
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong!' });
        console.log('updateSwitch=>', error.message);
    }
}

const updateTotalSupply = async (req, res) => {
    try {
        const { _id } = req.body;

        const tokenContract = new web3.eth.Contract(LiveMintABI, process.env.LIVE_MINT_CONTRACT_ADDRESS);
        total = parseInt(await tokenContract.methods.MAX_SUPPLY().call(), 10);
        supply = parseInt(await tokenContract.methods.totalSupply().call(), 10);

        let manageLiveMint = await ManageLiveMint.findOne({ _id });
        if (!manageLiveMint) {
            res.status(400).json({ message: "Genesis LiveMint details not found." });
        } else {
            manageLiveMint.supplyCount = supply;
            manageLiveMint.totalCount = total;
            manageLiveMint.updatedAt = Date.now();

            manageLiveMint.save().then(() => {
                res.json({ message: 'TotalSupply successfully updated', totalCount: manageLiveMint.totalCount, supplyCount: manageLiveMint.supplyCount })
            });
        }
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong!' });
        console.log('updateSwitch=>', error.message);
    }
}

const getMintingState = async (req, res) => {
    try {
        const liveMint = await ManageLiveMint.find({})
        if (liveMint.length === 0) {
            let manageLiveMint = new ManageLiveMint({})
            manageLiveMint.save().then((result) => {
                res.json({ result: result, message: 'Blank record successfully created.' });
            });
        } else {
            res.json({ result: liveMint[0].isMinting });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getPreSaleState = async (req, res) => {
    try {
        const liveMint = await ManageLiveMint.find({})
        if (liveMint.length === 0) {
            let manageLiveMint = new ManageLiveMint({})
            manageLiveMint.save().then((result) => {
                res.json({ result: result, message: 'Blank record successfully created.' });
            });
        } else {
            res.json({ result: liveMint[0].isPreSale });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getPublicSaleState = async (req, res) => {
    try {
        const liveMint = await ManageLiveMint.find({})
        if (liveMint.length === 0) {
            let manageLiveMint = new ManageLiveMint({})
            manageLiveMint.save().then((result) => {
                res.json({ result: result, message: 'Blank record successfully created.' });
            });
        } else {
            res.json({ result: liveMint[0].isPublicSale });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getSalePriceETH = async (req, res) => {
    try {
        const liveMint = await ManageLiveMint.find({})
        if (liveMint.length === 0) {
            let manageLiveMint = new ManageLiveMint({})
            manageLiveMint.save().then((result) => {
                res.json({ result: result, message: 'Blank record successfully created.' });
            });
        } else {
            res.json({ result: liveMint[0].salePriceETH });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getSalePriceAPE = async (req, res) => {
    try {
        const liveMint = await ManageLiveMint.find({})
        if (liveMint.length === 0) {
            let manageLiveMint = new ManageLiveMint({})
            manageLiveMint.save().then((result) => {
                res.json({ result: result, message: 'Blank record successfully created.' });
            });
        } else {
            res.json({ result: liveMint[0].salePriceAPE });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getLivemintPageStatus = async (req, res) => {
    try {
        const liveMint = await ManageLiveMint.find({})
        if (liveMint.length === 0) {
            let manageLiveMint = new ManageLiveMint({})
            manageLiveMint.save().then((result) => {
                res.json({ result: result, message: 'Blank record successfully created.' });
            });
        } else {
            res.json({ displayLiveMintPage: liveMint[0].isDisplayLiveMintPage });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getTotalCount = async (req, res) => {
    try {
        const liveMint = await ManageLiveMint.find({})
        if (liveMint.length === 0) {
            let manageLiveMint = new ManageLiveMint({})
            manageLiveMint.save().then((result) => {
                res.json({ result: result, message: 'Blank record successfully created.' });
            });
        } else {
            res.json({ result: liveMint[0].totalCount });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getSupplyCount = async (req, res) => {
    try {
        const liveMint = await ManageLiveMint.find({})
        if (liveMint.length === 0) {
            let manageLiveMint = new ManageLiveMint({})
            manageLiveMint.save().then((result) => {
                res.json({ result: result, message: 'Blank record successfully created.' });
            });
        } else {
            res.json({ result: liveMint[0].supplyCount });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


const getPurchasedCount = async (req, res) => {
    try {
        const { walletAddress } = req.params;
        if (!walletAddress) {
            return res.status(500).json({ error: true, message: 'Wallet address is required' });
        }

        const valid = WAValidator.validate(walletAddress, 'ETH');
        if (!valid) {
            return res.status(500).json({ error: true, message: 'Invalid ethereum wallet address' });
        }

        const liveMint = await PurchaseLiveMint.find({ address: walletAddress })
        if (liveMint.length === 0) {

            const tokenContract = new web3.eth.Contract(LiveMintABI, process.env.LIVE_MINT_CONTRACT_ADDRESS);
            const purchasedCount = await tokenContract.methods.quantityPerWallet(walletAddress).call();
            let manageLiveMint = new PurchaseLiveMint({})
            manageLiveMint.address = walletAddress;
            manageLiveMint.purchases = purchasedCount;
            manageLiveMint.createdAt = Date.now();
            manageLiveMint.updatedAt = Date.now();

            manageLiveMint.save().then((result) => {
                res.json({ result: manageLiveMint.purchasedCount });
            });
        } else {
            res.json({ result: liveMint[0].purchases });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const updatePurchasedCount = async (req, res) => {
    try {
        const { walletAddress } = req.params;
        if (!walletAddress) {
            return res.status(500).json({ error: true, message: 'Wallet address is required' });
        }

        const valid = WAValidator.validate(walletAddress, 'ETH');
        if (!valid) {
            return res.status(500).json({ error: true, message: 'Invalid ethereum wallet address' });
        }

        const tokenContract = new web3.eth.Contract(LiveMintABI, process.env.LIVE_MINT_CONTRACT_ADDRESS);
        const purchasedCount = await tokenContract.methods.quantityPerWallet(walletAddress).call();
        total = parseInt(await tokenContract.methods.MAX_SUPPLY().call(), 10);
        supply = parseInt(await tokenContract.methods.totalSupply().call(), 10);
        let presaleMintedQty = await tokenContract.methods.presaleMintedQty().call();

        console.log('total===', total)
        console.log('supply===', supply)

        procTokensOfOwner(walletAddress);

        const liveMint = await PurchaseLiveMint.find({ address: walletAddress })
        if (liveMint.length === 0) {
            let manageLiveMint = new PurchaseLiveMint({})
            manageLiveMint.address = walletAddress;
            manageLiveMint.purchases = purchasedCount;
            manageLiveMint.createdAt = Date.now();
            manageLiveMint.updatedAt = Date.now();

            manageLiveMint.save();
        } else {
            liveMint[0].purchases = purchasedCount;
            liveMint[0].updatedAt = Date.now();

            liveMint[0].save();
        }

        const manageLiveMint = await ManageLiveMint.find({ })
        if (manageLiveMint.length === 0) {
            let mLiveMint = new ManageLiveMint({})
            mLiveMint.totalCount = total;
            mLiveMint.supplyCount = supply;
            mLiveMint.presaleMintedQty = presaleMintedQty;

            mLiveMint.save();
        } else {
            manageLiveMint[0].totalCount = total;
            manageLiveMint[0].supplyCount = supply;
            manageLiveMint[0].presaleMintedQty = presaleMintedQty;

            manageLiveMint[0].save();
        }

        res.status(200).json({ 
            message: 'Success update',
            data: {
                supplyCount: supply,
                purchasedCount: purchasedCount,
                presaleMintedQty: presaleMintedQty
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = {
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
    updatePurchasedCount
}
