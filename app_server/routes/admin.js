const express = require("express");
var controllerAdmin = require("../controllers/adminController");

var router = express.Router();

//http://localhost:3000/admin/getAllUsers
router.get("/getAllUsers", controllerAdmin.getAllUsers);

//http://localhost:3000/admin/delete/

router.delete("/delete/:userId", controllerAdmin.delete);
//http://localhost:3000/admin/activate/
router.patch("/activate/:userId", controllerAdmin.activate);

module.exports = router;
