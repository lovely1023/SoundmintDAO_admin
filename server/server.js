const express = require("express");
const connectDB = require("./config/db");
const path = require("path");
const cors = require('cors');
const config = require("config");
require('dotenv').config()

const app = express();

// Connect Database
connectDB();

// Init Middleware
app.use(express.json());

//Cors
const corsOptions = {
  // origin: config.get("ALLOWED_CLIENTS").split(',')
  origin: ['https://www.soundmint.xyz', 'https://mainstaging.soundmint.xyz']
}

app.use(cors(corsOptions));

// Define Routes
app.use("/api/auth", require("./routes/api/auth"));
app.use("/api/users", require("./routes/api/users"));
app.use("/api/auctions", require("./routes/api/auctions"));

app.use("/api/mintlist", require("./routes/api/mintlist"));
app.use("/api/auction", require("./routes/api/manageAuction"));
app.use("/api/memberemail", require("./routes/api/memberEmail"));
app.use("/api/merkleroot", require("./routes/api/users"));
app.use("/api/livemint", require("./routes/api/manageLiveMint"));
app.use("/api/stem", require("./routes/api/manageStem"));

// Serve static assets in production
if (process.env.NODE_ENV === "production") {
  // Set static folder
  app.use(express.static("client/build"));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
