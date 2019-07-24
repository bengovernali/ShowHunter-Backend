const express = require("express"),
  path = require("path"),
  cookieParser = require("cookie-parser"),
  cors = require("cors"),
  passport = require("passport"),
  SpotifyStrategy = require("passport-spotify").Strategy,
  session = require("express-session"),
  FileStore = require("session-file-store")(session),
  logger = require("morgan");

require("dotenv").config();

const app = express();

const corsOptions = {
  origin: "*",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  preflightContinue: false,
  optionsSuccessStatus: 204,
  "Access-Control-Allow-Origin": "http://localhost:3000",
  "Access-Control-Allow-Headers":
    "Origin, X-Requested-With, Content-Type, Accept"
};

const scope = "user-library-read";

const CLIENT_ID = process.env["CLIENT_ID"];
const CLIENT_SECRET = process.env["CLIENT_SECRET"];

app.use(passport.initialize());
app.use(passport.session());

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use(cors(corsOptions));

app.use(
  session({
    store: new FileStore(),
    secret: process.env.SESSION_SECRET
  })
);

passport.use(
  new SpotifyStrategy(
    {
      clientID: CLIENT_ID,
      clientSecret: CLIENT_SECRET,
      callbackURL: `http://localhost:3000/auth/spotify/callback/`
    },
    function(accessToken, refreshToken, expires_in, profile, done) {
      process.nextTick(function() {
        console.log("Profile: ", profile);
        const data = [accessToken, profile];
        // To keep the example simple, the user's spotify profile is returned to
        // represent the logged-in user. In a typical application, you would want
        // to associate the spotify account with a user record in your database,
        // and return that user instead.
        return done(null, profile, data);
      });
    }
  )
);

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

app.all("/*", function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

app.get(
  "/auth/spotify",
  passport.authenticate("spotify", {
    scope: scope,
    showDialog: true
  }),
  function(req, res) {
    // The request will be redirected to spotify for authentication, so this
    // function will not be called.
  }
);

app.get(
  "/auth/spotify/callback/",
  passport.authenticate("spotify", { failureRedirect: "/" }),
  function(req, res) {
    // Successful authentication, redirect home.
    console.log("Happy path");
    res.redirect("http://localhost:3001/home");
  }
);

const indexRouter = require("./routes/index"),
  usersRouter = require("./routes/users");

app.use("/", indexRouter);
app.use("/users", usersRouter);

app.use(function(req, res, next) {
  var err = new Error("Not Found");
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  console.error(err);
});

module.exports = app;
