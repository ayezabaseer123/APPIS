var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cors = require("cors");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const checkAuth = require("./app_server/utils/middlewares/check_auth");
const checkAdmin = require("./app_server/utils/middlewares/admin_access");
const checkUsers = require("./app_server/utils/middlewares/users_access");
var indexRouter = require("./app_server/routes/index");
var usersRouter = require("./app_server/routes/users");

var adminRouter = require("./app_server/routes/admin");

var app = express();

mongoose.connect("mongodb://localhost:27017/API_DB", function (err) {
  if (err) throw err;
});
// view engine setup
app.set("views", path.join(__dirname, "app_server", "views"));
app.set("view engine", "jade");

app.use(logger("tiny"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static("uploads"));
app.use(cors());

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use(checkAuth);
app.use(checkAdmin);
app.use("/admin", adminRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  //res.locals.error.status = 200

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
