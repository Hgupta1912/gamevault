// config/passport.js
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");
const db = require("../db/queries");

passport.use(
  new LocalStrategy(
    { usernameField: "email" }, // tell passport to look for "email" field instead of default "username"
    async (email, password, done) => {
      try {
        // 1. find user by email
        const user = await db.findUserByEmail(email);
        if (!user) {
          return done(null, false, { message: "No account found with that email" });
        }

        // 2. compare submitted password with stored hash
        const match = await bcrypt.compare(password, user.password_hash);
        if (!match) {
          return done(null, false, { message: "Incorrect password" });
        }

        // 3. all good — return the user
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await db.findUserById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});