require("dotenv").config();
const express = require("express");
const app = express();
const path = require("node:path");
const session = require("express-session");
const pgSession = require("connect-pg-simple")(session);
const passport = require("passport");
const pool = require("./db/pool");

const indexRouter = require("./routes/index.js");
const gamesRouter = require("./routes/games.js");
const genresRouter = require("./routes/genres.js");
const authRouter = require("./routes/auth.js");

// passport config
require("./config/passport");

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.set("trust proxy", 1); //this is for the session cookie's sake on production version
 
app.use(session({
  store: new pgSession({
    pool: pool,
    tableName: "sessions",
    createTableIfMissing: true,
  }),
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
  },
}));

app.use(passport.session());

// make req.user available in all EJS templates
app.use((req, res, next) => {
  res.locals.user = req.user || null;
  next();
});

app.use("/", indexRouter);
app.use("/games", gamesRouter);
app.use("/genres", genresRouter);
app.use("/auth", authRouter);


// 404 — no route matched
app.use((req, res) => {
  res.status(404).render("error", {
    status: 404,
    message: "Page not found"
  });
});

// 500 — something threw an error
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).render("error", {
    status: err.status || 500,
    message: process.env.NODE_ENV === "production"
      ? "Something went wrong"
      : err.message
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Running on port ${PORT}`);
});