const express = require("express"),
  cors = require("cors"),
  TokenModel = require("../models/token");

const router = express.Router();

router.use(cors());

router.get("/:tokenId?", async (req, res) => {
  const tokenId = req.params.tokenId;
  await TokenModel.deleteToken(tokenId);
  res.sendStatus(200);
});

module.exports = router;
