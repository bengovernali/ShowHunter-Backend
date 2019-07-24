const express = require("express"),
  session = require("express-session");

const router = express.Router();

router.get("/scan", async function(req, res, next) {
  console.log(req.session);
});

module.exports = router;
