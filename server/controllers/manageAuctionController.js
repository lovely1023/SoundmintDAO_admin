const ManageAuction = require("../models/ManageAuction");
var Web3 = require('web3');

const getAllManageAuction = async (req, res) => {
    try {
        const auction = await ManageAuction.find({})
        if (auction.length === 0) {
            let manageAuction = new ManageAuction({})
            manageAuction.save().then((result) => {
                res.json({ result: result, message: 'Blank record successfully created.' });
            });
        } else {
            res.json({ result: auction });
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
            let manageAuction = await ManageAuction.findOne({ _id });
            if (!manageAuction) {
                return res
                    .status(400)
                    .json({ message: "Live Mint details not found" });
            }
            manageAuction.liveMintStartTime = liveMintStartTime;
            manageAuction.liveMintEndTime = liveMintEndTime;
            manageAuction.updatedAt = Date.now();

            manageAuction.save().then(() => {
                res.json({ message: "Live Mint details successfully updated" });
            });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const updateGenesisAuctionDetail = async (req, res) => {
    try {
        const { _id, genesisAuctionStartTime, genesisAuctionEndTime } = req.body;

        if (!_id) {
            res.json({ message: 'Id is required' });
        } else if (!genesisAuctionStartTime || !genesisAuctionEndTime) {
            res.json({ message: 'Provide both start and end time' })
        } else {
            let manageAuction = await ManageAuction.findOne({ _id });
            if (!manageAuction) {
                return res
                    .status(400)
                    .json({ message: "Genesis Auction details not found." });
            }
            manageAuction.genesisAuctionStartTime = genesisAuctionStartTime;
            manageAuction.genesisAuctionEndTime = genesisAuctionEndTime;
            manageAuction.updatedAt = Date.now();

            manageAuction.save().then(() => {
                res.json({ message: "Genesis Auction details successfully updated" });
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
            let manageAuction = await ManageAuction.findOne({ _id });
            if (!manageAuction) {
                return res
                    .status(400)
                    .json({ message: "Pre sale details not found." });
            }
            manageAuction.preSaleStartTime = preSaleStartTime;
            manageAuction.preSaleEndTime = preSaleEndTime;
            manageAuction.updatedAt = Date.now();

            manageAuction.save().then(() => {
                res.json({ message: "Pre sale details successfully updated" });
            });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const updateSwitch = async (req, res) => {
    try {
        const { _id, operation, isMinting, isPrivateSale, isPublicSale, isPreSale } = req.body;

        let manageAuction = await ManageAuction.findOne({ _id });

        if (!manageAuction) {
            res.status(400).json({ message: "Genesis Auction details not found." });
        } else if (operation === 'minting' && isMinting !== undefined) {
            manageAuction.isMinting = isMinting;
            manageAuction.updatedAt = Date.now();

            manageAuction.save().then(() => {
                res.json({ message: 'Minting successfully updated' })
            });
        } else if (operation === 'privatesale' && isPrivateSale !== undefined) {
            manageAuction.isPrivateSale = isPrivateSale;
            manageAuction.updatedAt = Date.now();

            manageAuction.save().then(() => {
                res.json({ message: 'Private sale successfully updated' })
            });
        } else if (operation === 'publicsale' && isPublicSale !== undefined) {
            manageAuction.isPublicSale = isPublicSale;
            manageAuction.updatedAt = Date.now();

            manageAuction.save().then(() => {
                res.json({ message: 'Public sale successfully updated' })
            });
        } else if (operation === 'presale' && isPreSale !== undefined) {
            manageAuction.isPreSale = isPreSale;
            manageAuction.totalSupply = 0;
            manageAuction.updatedAt = Date.now();

            manageAuction.save().then(() => {
                res.json({ message: 'Pre sale successfully updated' })
            });
        } else {
            res.status(500).json({ message: 'Something went wrong!' })
        }
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong!' });
        console.log('updateSwitch=>', error.message);
    }
}

const updateTotalSupply = async (req, res) => {
    try {
        const { _id, totalSupply } = req.body;

        let manageAuction = await ManageAuction.findOne({ _id });

        if (!manageAuction) {
            res.status(400).json({ message: "Genesis Auction details not found." });
        } else {
            manageAuction.totalSupply = totalSupply;
            manageAuction.updatedAt = Date.now();

            manageAuction.save().then(() => {
                res.json({ message: 'TotalSupply successfully updated' })
            });
        }
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong!' });
        console.log('updateSwitch=>', error.message);
    }
}


module.exports = {
    getAllManageAuction,
    updateLiveMintDetail,
    updateGenesisAuctionDetail,
    updatePresaleDetail,
    updateSwitch,
    updateTotalSupply
}