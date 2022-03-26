const { STATUS_CODES, ERROR_MESSAGES } = require("../../../constants");
module.exports = (req, res, next) => {
  try {
    const { isAdmin } = req.userData;
    console.log(isAdmin);
    if (isAdmin == true) {
      return res.status(STATUS_CODES.FORBIDDEN_ERROR).json({
        message: "Only users can access this route",
      });
    }
    if (isAdmin == false) next();
  } catch (error) {
    return res.status(STATUS_CODES.FORBIDDEN_ERROR).json({
      message: "Only users can access this route",
    });
  }
};
