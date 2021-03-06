const express = require("express"),
  path = require("path"),
  cookieParser = require("cookie-parser"),
  logger = require("morgan");

require("dotenv").config();

const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env["SESSION_SECRET"]));
app.use(express.static(path.join(__dirname, "public")));

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
