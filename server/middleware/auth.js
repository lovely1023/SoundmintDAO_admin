const config = require("config");
const jwt = require("jsonwebtoken");

const isAuthenticated = (req, res, next) => {
  // Get wallet-address from header
  const walletAddress = req.header("wallet-address");

  // Check if not wallet-address
  if (!walletAddress) {
    return res.status(401).json({ msg: "No wallet-address, authorization denied" });
  }

  // Verify wallet-address
  try {
    const jwtDecoded = jwt.decode(walletAddress, { complete: true });

    jwt.verify(walletAddress, config.get("jwtSecret"), (error, decoded) => {

      const adminAddress = process.env.ADMIN_ADDRESS;
      let adminAddressesArray = [];
      if (adminAddress) {
        adminAddressesArray = adminAddress.toLowerCase().split(',');
      }
      adminAddressesArray.push(config.get("sohamAddress"))

      if (error || !adminAddressesArray.includes(jwtDecoded.payload.account.toLowerCase())) {
        return res.status(401).json({ msg: "Your wallet doesn't have enough permission to perform this action" });
      } else {
        req.account = decoded.account;
        next();
      }
    });
  } catch (err) {
    console.error("Something wrong with auth middleware");
    res.status(500).json({ msg: "Server Error" });
  }
};


module.exports = isAuthenticated;
