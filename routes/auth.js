const express = require("express"),
  passport = require("passport"),
  SpotifyStrategy = require("passport-spotify").Strategy,
  router = express.Router();

require("dotenv").config();

const scope = "user-library-read";

const CLIENT_ID = process.env["CLIENT_ID"];
const CLIENT_SECRET = process.env["CLIENT_SECRET"];

router.get("/spotify", function(req, res) {
  var scopes = "user-library-read";
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

router.get("/spotify/callback", async function(req, res) {
  console.log(req.query.code);
  //req.session.bearer = req.query.code;
  //req.session.isLoggedIn = true;
  //await req.session.save(req.session.bearer, req.session.isLoggedIn);
  res.redirect(`http://localhost:3001/?bearer=${req.query.code}`);
});

router.get("/scan", async function(req, res, next) {
  console.log("req session", req.session);
});

module.exports = router;
