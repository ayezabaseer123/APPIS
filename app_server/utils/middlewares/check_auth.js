const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");

const { STATUS_CODES, ERROR_MESSAGES } = require("../../../constants");
const User = require("../../models/users");
dotenv.config();

module.exports = (req, res, next) => {
  try {
    if (!req.headers.authorization) {
      res.status(STATUS_CODES.INTERNALSERVER_ERROR).json({
        message: ERROR_MESSAGES.AUTHENTICATION,
      });
    }
    const token = req.headers.authorization.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_KEY);
    req.userData = decoded;
    User.findOne({ _id: req.userData.id }).exec((err, user) => {
      if (user.isActive == false) {
        return res.status(STATUS_CODES.AUTHENTICATION_ERROR).json({
          message: ERROR_MESSAGES.AUTHENTICATION,
        });
      } else {
        next();
      }
    });
  } catch (error) {
    return res.status(STATUS_CODES.AUTHENTICATION_ERROR).json({
      message: ERROR_MESSAGES.AUTHENTICATION,
    });
  }
};
