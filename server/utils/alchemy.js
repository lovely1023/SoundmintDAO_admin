
const { createAlchemyWeb3 } = require('@alch/alchemy-web3');
const web3 = createAlchemyWeb3(
    process.env.ALCHEMY_API,
);
require('dotenv').config();
const https = require('https');
const LiveMintABI = require("../artifacts/contracts/live-mint.json");
const ethers = require("ethers");
const WAValidator = require("wallet-address-validator");
const ManageStem = require("../models/ManageStem");
const axios = require("axios");

const getLiveMintContractStatus = async (walletAddress) => {
    try {
        let waddress = walletAddress;
        //validate ethereum wallet address
        const valid = WAValidator.validate(walletAddress, 'ETH');
        if (!valid) {
            waddress = undefined;
        }

        const tokenContract = new web3.eth.Contract(LiveMintABI, process.env.LIVE_MINT_CONTRACT_ADDRESS);
        if (tokenContract) {
            let isMinting = await tokenContract.methods.isActive().call();
            let isPreSale = await tokenContract.methods.preSaleActive().call();
            let isPublicSale = await tokenContract.methods.publicSaleActive().call();
            let salePriceETH = ethers.utils.formatUnits(await tokenContract.methods.salePriceETH().call(), 18);
            let salePriceAPE = ethers.utils.formatUnits(await tokenContract.methods.salePriceAPE().call(), 18);

            let totalCount = parseInt(await tokenContract.methods.MAX_SUPPLY().call(), 10);
            let supplyCount = parseInt(await tokenContract.methods.totalSupply().call(), 10);
            let owner = await tokenContract.methods.owner().call();
            let presaleMintedQty = await tokenContract.methods.presaleMintedQty().call();
            let purchasedCount = -1;

            if (waddress) {
                purchasedCount = await tokenContract.methods.quantityPerWallet(waddress).call();
            }


            return {
                isMinting: isMinting,
                isPreSale: isPreSale,
                isPublicSale: isPublicSale,
                salePriceETH: salePriceETH,
                salePriceAPE: salePriceAPE,
                totalCount: totalCount,
                supplyCount: supplyCount,
                presaleMintedQty: presaleMintedQty,
                owner: owner,
                purchasedCount: purchasedCount < 0 ? "address fail" : purchasedCount
            };
        }
        else {
            return -1;
        }
    } catch (error) {
        return -2;
    }
}

const procTokensOfOwner = async (walletAddress) => {
    try {
        const tokenContract = new web3.eth.Contract(LiveMintABI, process.env.LIVE_MINT_CONTRACT_ADDRESS);
        const tokens = await tokenContract.methods.tokensOfOwner(walletAddress).call();
        const data = await getTokenData(tokenContract, tokens);
        const stem = await ManageStem.find({ address: walletAddress })
        if (stem.length === 0) {
            let managestem = new ManageStem({})
            managestem.address = walletAddress;
            managestem.nfts = JSON.stringify(data);
            managestem.createdAt = Date.now();
            managestem.updatedAt = Date.now();
            managestem.save();
        } else {
            stem[0].nfts = JSON.stringify(data);
            stem[0].updatedAt = Date.now();
            stem[0].save();
        }

        return {value: 0, data: data};
    } catch {
        return {value: -1, data: null};
    }
}

const getTokenData = async (contract, tokens) => {
    const tokenData = [];
    for (let i = 0; i < tokens.length; i++) {
        const uri = await contract.methods.tokenURI(tokens[i]).call();
        const resp = await axios({method: 'get', url: uri});
        tokenData.push(resp.data);
    }
    return tokenData;
}

module.exports = {
    getLiveMintContractStatus,
    procTokensOfOwner,
    getTokenData
}
