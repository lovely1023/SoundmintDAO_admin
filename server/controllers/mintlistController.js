const fs = require('fs');
const path = require('path');
const multer = require('multer');
const { parse } = require('fast-csv');
const { MerkleTree } = require("merkletreejs");
const keccak256 = require("keccak256");

const MintWhitelist = require('../models/MintWhitelist');

let storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, file.originalname)
})

let upload = multer({
    storage,
    limits: { fileSize: 1000000 * 100 }
}).single('csvFile');


function getUniqueListBy(arr, key) {
    return [...new Map(arr.map(item => [item[key], item])).values()]
}

function getDuplicateListBy(arr, key) {
    return arr
        .map(e => e[key])
        .map((e, i, final) => final.indexOf(e) !== i && i)
        .filter(obj => arr[obj])
        .map(e => arr[e][key])
}

const uploadMintlist = async (req, res) => {
    try {

        //Store file
        upload(req, res, async (err) => {

            //Validate request
            if (!req.file) {
                return res.json({ error: 'All fields are required.' })
            } else if (err) {
                return res.status(500).send({ error: err.message })
            } else if (req.file.mimetype !== 'text/csv') {
                return res.json({ error: 'Only csv file allowed.' })
            }

            //Read csv file 
            let rows = [];
            const filePath = path.resolve(req.file.destination, req.file.originalname);
            fs.createReadStream(filePath)
                .pipe(parse({ headers: true }))
                .on('error', error => res.status(500).json({ error }))
                .on('data', row => {
                    //Validate row header
                    if (row.number && row.address) {
                        rows.push(row);
                    }
                })
                .on('end', rowCount => {
                    //Remove file
                    fs.unlinkSync(filePath);

                    //Remove all existing addresses
                    MintWhitelist.deleteMany({}).then(function () {
                        console.log("Data deleted"); // Success

                        if (rows.length > 0) {
                            let lowercaseRows = rows.map(x => Object.fromEntries(Object.entries(x).map(
                                ([key, value]) => [key, typeof value == 'string' ? value.toLowerCase() : value])));

                            const uniqueAddresses = getUniqueListBy(lowercaseRows, 'address')

                            const duplicateAddresses = getDuplicateListBy(lowercaseRows, 'address')

                            //Bulkinsert data
                            MintWhitelist.insertMany(uniqueAddresses).then(function () {
                                const duplicateMessage = duplicateAddresses.length === 0 ? ', No duplicate address found' : `, ${duplicateAddresses.length} duplicate records removed`
                                return res.status(200).json({ message: `Mintlist successfully uploaded ${duplicateMessage}` });
                            }).catch(function (error) {
                                res.status(500).json({ error });
                            });
                        }
                    }).catch(function (error) {
                        res.status(500).json({ error });
                    });
                });
        })
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
}

const getAllMintlist = async (req, res) => {
    try {
        const allMints = await MintWhitelist.find({})
            .select("-__v");
        res.json(allMints);        
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getNftIdListByAccount = async (req, res) => {
    const { walletAddress } = req.params;
    try {
        const allMints = await MintWhitelist.find({address: walletAddress})
                .select("-__v")
                .select("-_id")
                .select("-createdAt");
        res.json(allMints);        
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getMerkleProofs = async (req, res) => {
    const { walletAddress } = req.params;

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

        if (hexProof.length == 0) {
            res.json({ isValidUser: false, message: 'You are not in the WhiteList' });
        } else {
            res.json({ isValidUser: true, merkleProof: hexProof });
        }
    } catch (error) {
        res.status(500).json({ message: error.message, isValidUser: false });
    }
}

const getMerkleRoot = async (req, res) => {
    try {
        const allMints = await MintWhitelist.find({})
            .select("-__v")
            .select("-_id")
            .select("-number")
            .select("-createdAt");

        const whitelistArray = allMints.map(({ address }) => address)

        const buf2hex = x => '0x' + x.toString('hex');

        const leaves = whitelistArray.map(x => keccak256(x));

        const tree = new MerkleTree(leaves, keccak256, { sortPairs: true });
        const root = tree.getRoot();
        const merkleRoot = buf2hex(root);

        if (merkleRoot) {
            res.json({ merkleRoot: merkleRoot, isMerkleRoot: true })
        } else {
            res.json({ message: 'MerkleRoot not available for this whitelist', isMerkleRoot: false })
        }
    } catch (error) {
        res.status(500).json({ message: error.message, ismerkleRoot: false });
    }
}

const getLivemintWhitelist = async (req, res) => {
    try {
        const allMints = await MintWhitelist.find({})
            .select("-__v")
            .select("-_id")
            .select("-number")
            .select("-createdAt");

        const whitelistArray = allMints.map(({ address }) => address)
        res.json(whitelistArray);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const deleteMintAddress = async (req, res) => {
    const { _id } = req.body;

    try {
        //Return if req body has no id attribute
        if (!_id) {
            return res.status(400).json({ message: "Provide id with request body" });
        }

        const response = await MintWhitelist.deleteOne({ _id });

        //Return if deleted count is zero
        if (response.deletedCount === 0) {
            return res.status(400).json({ message: "Mint address not found!" });
        }

        //Return mint list on sucess 
        const allMints = await MintWhitelist.find({})
            .select("-__v");
        return res.json(allMints);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const deleteAllMintAddresses = async (req, res) => {
    MintWhitelist.deleteMany({}).then(function () {
        return res.status(200).json({ message: 'All mint addresses successfully deleted' });
    }).catch(function (error) {
        res.status(500).json({ message: error.message });
    });
}

module.exports = {
    uploadMintlist,
    getAllMintlist,
    getLivemintWhitelist,
    getMerkleProofs,
    getMerkleRoot,
    deleteMintAddress,
    deleteAllMintAddresses,
    getNftIdListByAccount
}