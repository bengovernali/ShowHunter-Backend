const express = require("express"),
  querystring = require("querystring"),
  request = require("request"),
  passport = require("passport"),
  SpotifyStrategy = require("passport-spotify").Strategy,
  router = express.Router();

require("dotenv").config();

const scope = "user-library-read";

const CLIENT_ID = process.env["CLIENT_ID"];
const CLIENT_SECRET = process.env["CLIENT_SECRET"];

//declare state key
const stateKey = "spotify_auth_state";

//configure passport strategy
passport.use(
  new SpotifyStrategy(
    {
      clientID: CLIENT_ID,
      clientSecret: CLIENT_SECRET,
      callbackURL: `http://localhost:3000/auth/spotify/callback/`
    },
    function(accessToken, refreshToken, expires_in, profile, done) {
      process.nextTick(function() {
        //req.session.user = profile.id;
        //req.session.bearer = accessToken;
        //req.session.isLoggedIn = true;
        bearer = accessToken;
        user = profile.id;
        console.log(bearer, user);
        return done(null, bearer, user);
      });
    }
  )
);

//Handle login through Spotify
router.get(
  "/spotify",
  passport.authenticate("spotify", {
    scope: scope,
    showDialog: true
  }),
  function(req, res) {
    // The request will be redirected to spotify for authentication, so this
    // function will not be called.
  }
);

//Handle redirect back to front end
router.get(
  "/spotify/callback/",
  passport.authenticate("spotify", { failureRedirect: "/" }),
  function(req, res) {
    // Successful authentication, redirect home.
    console.log("THIS IS THE RES: ", res);
    res.redirect("http://localhost:3001/home");
  }
);

module.exports = router;
