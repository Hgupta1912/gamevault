const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController.js");

router.get("/login", authController.getLogin);        // show login page
router.post("/login", authController.postLogin);       // handle login form submission
router.get("/register", authController.getRegister);     // show register page
router.post("/register", authController.postRegister);    // handle register form submission
router.post("/logout", authController.postLogout);      // handle logout

module.exports = router;
