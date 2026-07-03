// controllers/authController.js
const db = require("../db/queries");
const bcrypt = require("bcryptjs");
const passport = require("passport");

const getLogin = (req, res) => {
  res.render("login");
};

const getRegister = (req, res) => {
  res.render("register");
};

const postRegister = async (req, res, next) => {
  try {
    const { email, password, confirm_password } = req.body;

    // check passwords match
    if (password !== confirm_password) {
      return res.render("register", { error: "Passwords do not match" });
    }

    // check if email already exists
    const existingUser = await db.findUserByEmail(email);
    if (existingUser) {
      return res.render("register", { error: "Email already in use" });
    }

    // hash password and create user
    const passwordHash = await bcrypt.hash(password, 12);
    await db.createUser(email, passwordHash);

    // redirect to login after successful registration
    res.redirect("/auth/login");
  } catch (err) {
    next(err);
  }
};

const postLogin = (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return next(err);
    }

    if (!user) {
      // authentication failed — info.message comes from your passport strategy
      return res.render("login", { error: info.message || "Invalid credentials" });
    }

    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      res.redirect("/games");
    });
  })(req, res, next);
};

const postLogout = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
};

module.exports = {
  getLogin,
  getRegister,
  postLogin,
  postRegister,
  postLogout
};