const { validationResult } = require("express-validator");


const Auction = require("../models/Auction");


const getAll = async (req, res) => {
    try {
        const auctions = await Auction.find({})
            .select("-account")
            .select("-__v");
        res.json(auctions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const createAuction = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { title, desc, start, end, price, metadata, mintText } = req.body;

    try {
        let auction = await Auction.findOne({ metadata });
        if (auction) {
            return res
                .status(400)
                .json({ errors: [{ msg: "Metadata URL already exist." }] });
        }

        auction = new Auction({
            account: req.account,
            title,
            desc,
            start,
            end,
            price,
            metadata,
            mintText
        });

        auction.save().then(() => {
            res.json("Auction successfully created.");
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getAllAuctions = async (req, res) => {
    try {
        const auctions = await Auction.find()
            .select("-_id")
            .select("-__v");
        res.json(auctions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const updateAuction = async (req, res) => {
    const { title, desc, start, end, price, metadata, mintText, _id } = req.body;

    try {
        let auction = await Auction.findOne({ _id });

        if (!auction) {
            return res
                .status(400)
                .json({ errors: [{ msg: "Auction details not found." }] });
        }

        auction.title = title;
        auction.desc = desc;
        auction.start = start;
        auction.end = end;
        auction.price = price;
        auction.metadata = metadata;
        auction.mintText = mintText;

        auction.save().then(() => {
            res.json("Auction details successfully updated");
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const deleteAuction = async (req, res) => {
    const { _id } = req.body;

    try {
        let auction = await Auction.deleteOne({ _id });

        return res.json("Auction successfully deleted.");
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const updateMintVisibility = async (req, res) => {
    try {
        const { _id, isMintVisible } = req.body;

        let auction = await Auction.findOne({ _id });

        if (!auction) {
            return res
                .status(400)
                .json({ errors: [{ msg: "Auction details not found." }] });
        }

        auction.isMintVisible = isMintVisible ? false : true;

        auction.save().then(() => {
            res.json("Mint visibility successfully updated.");
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = {
    getAll,
    createAuction,
    getAllAuctions,
    updateAuction,
    deleteAuction,
    updateMintVisibility
}