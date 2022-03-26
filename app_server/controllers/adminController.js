const User = require("../models/users");
const { STATUS_CODES, ERROR_MESSAGES } = require("../../constants");
const sendJsonResponse =  (res, status, content)=> {
  res.status(status);
  res.json(content);
};

module.exports.getAllUsers = async function (req, res) {
  try {
    const data = await User.find({ isAdmin: false });
    if (data.length === 0) {
      sendJsonResponse(res, STATUS_CODES.NO_CONTENT, {
        message: ERROR_MESSAGES.USER_NOT_FOUND,
      });
      return;
    } else {
      sendJsonResponse(res, STATUS_CODES.OK, data);
    }
  } catch (err) {
    console.log(err);
  }
};

module.exports.delete = (req, res) => {
  const { userId } = req.params;

  User.findByIdAndDelete(userId, (err) => {
    if (err) {
      sendJsonResponse(res, STATUS_CODES.NOT_FOUND, err);
      return;
    }
    sendJsonResponse(res, STATUS_CODES.NO_CONTENT, null);
  });
};

module.exports.activate = async (req, res) => {
  const { userId } = req.params;

  User.findByIdAndUpdate(userId, { isActive: true }, { new: true })
    .then((userUpdated) => {
      if (!userUpdated) {
        return res.status(STATUS_CODES.NOT_FOUND).send();
      }
      res.send(userUpdated);
    })
    .catch((error) => {
      res.status(STATUS_CODES.INTERNALSERVER_ERROR).send(error);
    });
};
