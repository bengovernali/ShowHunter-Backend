const express = require("express"),
  request = require("request"),
  router = express.Router();

require("dotenv").config();

const CLIENT_ID = process.env["CLIENT_ID"];
const CLIENT_SECRET = process.env["CLIENT_SECRET"];

//handle redirect to spotify login screen
router.get("/spotify", function(req, res) {
  const scopes =
    "user-read-private user-read-birthdate user-read-email playlist-read-private user-library-read user-library-modify user-top-read playlist-read-collaborative playlist-modify-public playlist-modify-private user-follow-read user-follow-modify user-read-playback-state user-read-currently-playing user-modify-playback-state user-read-recently-played";
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

  const authString = `${CLIENT_ID} + ":" + ${CLIENT_SECRET}`;

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

  await request(options, function(error, response, body) {
    if (error) throw new Error(error);
    const token = body.access_token;
    //const refresh = body.refresh_token;
    res.redirect(`http://localhost:3001/?bearer=${token}`);
  });
});

module.exports = router;
