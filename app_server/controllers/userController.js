const jwt = require("jsonwebtoken");
const createError = require("http-errors");
const dotenv = require("dotenv");

const User = require("../models/users");
const { STATUS_CODES,ERROR_MESSAGES } = require("../../constants");

dotenv.config();

const sendJsonResponse = function (res, status, content) {
  res.status(status);
  res.json(content);
};

module.exports.signup = function (req, res) {
  User.findOne({ email: req.body.email }).exec((err, user) => {
    if (!user) {
      const user = new User({
        name: req.body.name,
        email: req.body.email,
        address: req.body.address,
        password: req.body.password,
        isAdmin: req.body.isAdmin,
        
      });

      user.save((err) => {
        if (err) {
          return sendJsonResponse(res, STATUS_CODES.BADREQUEST_ERROR, err);
        }
        sendJsonResponse(res, STATUS_CODES.CREATED, user);
      });
    } else {
      sendJsonResponse(res, STATUS_CODES.CONFLICT_ERROR, {
        message: ERROR_MESSAGES.USER_ALREADY_EXIST,
      });
    }
  });
};
// create json web token
const maxAge = 3 * 24 * 60 * 60;
const createToken = (id, email, name, isAdmin,isActive) => {
  return jwt.sign({ id, email, name, isAdmin ,isActive}, process.env.JWT_Key, {
    expiresIn: maxAge,
  });
};

module.exports.login = function (req, res) {
  User.findOne({ email: req.body.email, isActive: true }).exec((err, user) => {
    if (!user) {
      return sendJsonResponse(res, STATUS_CODES.NOT_FOUND, {
        message: ERROR_MESSAGES.USER_NOT_FOUND,
      });
    }
    if (user.password !== req.body.password) {
      return sendJsonResponse(res, STATUS_CODES.NOT_FOUND, {
        message: ERROR_MESSAGES.INCORRECT_PASSWORD,
      });
    }
    const token = createToken(user._id, user.email, user.name, user.isAdmin,user.isActive);
    res.cookie(process.env.JWT_Key, token, {
      httpOnly: true,
      maxAge: maxAge * 1000,
    });
    sendJsonResponse(res, STATUS_CODES.CREATED, {
      name: user.name,
      email: user.email,
      userImage: user.userImage,
      isAdmin: user.isAdmin,
      token: token,
    });
  });
};

module.exports.logout = function (req, res, next) {
  if (!req.cookies.secret_key) {
    next(createError(STATUS_CODES.FORBIDDEN_ERROR));
  }
  res.clearCookie(process.env.JWT_Key);
  res.redirect("/");
};

module.exports.update = async function (req, res) {
  const { userId: id } = req.params;
  const { name, password, email } = req.body;
  if (!name || !password || !email) {
    sendJsonResponse(res, STATUS_CODES.BADREQUEST_ERROR, {
      message: ERROR_MESSAGES.PROVIDE_ALL_FIELDS,
    });
    return;
  }

  User.findByIdAndUpdate(
    id,
    {
      name,
      email,
      password,
      userImage: req.file?.path,
    },
     (err, userUpdated)=> {
      if (!userUpdated) {
        return sendJsonResponse(res, STATUS_CODES.NOT_FOUND, {
          message: ERROR_MESSAGES.USER_NOT_FOUND,
        });
      } else if (err) {
        return sendJsonResponse(res, STATUS_CODES.BADREQUEST_ERROR, err);
      }
      console.log(userUpdated)
    return  sendJsonResponse(res, STATUS_CODES.OK, {
      message:ERROR_MESSAGES.UPDATED_SUCCESSFULLY
    });
    }
  );
};


//search on the basis of email or name
module.exports.search = async function (req, res) {
  try {
    const { name, email } = req.query;
    let data = await User.find({
      $or: [{ name }, { email }],
    }).select({ name: 1, email: 1, _id: 1 });
    if (data.length === 0) {
      return sendJsonResponse(res, STATUS_CODES.NO_CONTENT, {
        message:ERROR_MESSAGES.USER_NOT_FOUND,
      });
    }
    sendJsonResponse(res, STATUS_CODES.OK, data);
  } catch (err) {
    console.log(err);
  }
};

module.exports.deactivate = async function (req, res) {
  User.findByIdAndUpdate(req.params.userId, { isActive: false }, { new: true })
    .then((userUpdated) => {
      if (!userUpdated) {
        return res.status(STATUS_CODES.NOT_FOUND).send();
      }
      if (!req.cookies.secret_key) {
        next(createError(STATUS_CODES.FORBIDDEN_ERROR));
      }
      res.clearCookie(process.env.JWT_Key);
     // res.redirect("/");
     return  sendJsonResponse(res, STATUS_CODES.OK, {
      message:ERROR_MESSAGES.DEACTIVATED_SUCCESSFULLY
    });
    })
    .catch((error) => {
      res.status(STATUS_CODES.INTERNALSERVER_ERROR).send(error);
    });
};
