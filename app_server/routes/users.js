const express = require("express");
const multer = require("multer");

const controllerUser = require("../controllers/userController");
const checkAuth = require("../utils/middlewares/check_auth");
const checkUser = require("../utils/middlewares/users_access");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/");
  },
  filename: function (req, file, cb) {
    const now = new Date().toISOString();
    const date = now.replace(/:/g, "-");
    cb(null, date + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/png"
  )
    cb(null, true);
  else {
    cb(null, false);
  }
};
const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 5 },
  fileFilter: fileFilter,
});

const router = express.Router();

//http://localhost:3000/users/signup
router.post("/signup", controllerUser.signup);

//http://localhost:3000/users/login
router.post("/login", controllerUser.login);

router.get("/logout", controllerUser.logout);

//http://localhost:3000/users/deactivate/623ca07de9c64b74219bd64e
router.patch(
  "/deactivate/:userId",
  checkAuth,
  checkUser,
  controllerUser.deactivate
);

//http://localhost:3000/users/update/623eba816b1b0445248626b2
router.put(
  "/update/:userId",
  checkAuth,
  checkUser,
  upload.single("userImage"),
  controllerUser.update
);
//http://localhost:3000/users/search?name=Ayeza&email=ayeshakashafnoor@gmail.com
router.get("/search", checkAuth, checkUser, controllerUser.search);

module.exports = router;
