const express = require("express"),
  path = require("path"),
  cookieParser = require("cookie-parser"),
  passport = require("passport"),
  session = require("express-session"),
  FileStore = require("session-file-store")(session),
  logger = require("morgan");

require("dotenv").config();

const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({
    store: new FileStore(),
    secret: process.env["SESSION_SECRET"],
    resave: true,
    saveUninitialized: true,
    is_logged_in: false
  })
);

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

const indexRouter = require("./routes/index"),
  homeRouter = require("./routes/home"),
  authRouter = require("./routes/auth");

app.use("/", indexRouter);
app.use("/auth", authRouter);
app.use("/home", homeRouter);

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
