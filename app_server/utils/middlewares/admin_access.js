
const  { STATUS_CODES,ERROR_MESSAGES } = require("../../../constants");
module.exports = (req, res, next) => {
  const { isAdmin } = req.userData;
  try {
      if(isAdmin==false){
        return res.status(STATUS_CODES.FORBIDDEN_ERROR).json({
            message: "Only admin can access this xxxroute",
          }); 
      }
    if (isAdmin === true) next();
  } catch (error) {
    return res.status(STATUS_CODES.FORBIDDEN_ERROR).json({
      message: "Only admin can access ffthis route",
    });
  }
};
