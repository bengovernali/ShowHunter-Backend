const express = require("express"),
  request = require("request"),
  TokenModel = require("../models/token"),
  router = express.Router();

require("dotenv").config();

const CLIENT_ID = process.env["CLIENT_ID"];
const CLIENT_SECRET = process.env["CLIENT_SECRET"];

//handle redirect to spotify login screen
router.get("/spotify", function(req, res) {
  const scopes = "user-read-private user-read-email";
  res.redirect(
    "https://accounts.spotify.com/authorize" +
      "?response_type=code" +
      "&client_id=" +
      CLIENT_ID +
      (scopes ? "&scope=" + encodeURIComponent(scopes) : "") +
      "&redirect_uri=" +
      encodeURIComponent("http://localhost:3000/auth/spotify/callback/")
  );
});

//upon login submission, request auth token and redirect to fronend with token
router.get("/spotify/callback", async function(req, res) {
  const code = req.query.code;
  console.log("BEARER CODE IS: ", code);

  const options = {
    method: "POST",
    url: "https://accounts.spotify.com/api/token",
    headers: {
      Authorization:
        "Basic " +
        new Buffer.from(CLIENT_ID + ":" + CLIENT_SECRET).toString("base64")
    },
    form: {
      grant_type: "authorization_code",
      code: code,
      redirect_uri: "http://localhost:3000/auth/spotify/callback/"
    },
    json: true
  };

  await request(options, async function(error, response, body) {
    if (error) throw new Error(error);
    const token = body.access_token;
    console.log("TOKEN IS: ", token);

    await TokenModel.createToken(token);

    const tokenId = await TokenModel.getTokenId(token);

    res.redirect(`http://localhost:3001/?tokenId=${tokenId.id}`);
  });
});

module.exports = router;
