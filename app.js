require("dotenv").config();
const express = require("express");
const app = express();
const path = require("node:path");

const indexRouter = require("./routes/index.js");
const gamesRouter = require("./routes/games.js");
const genresRouter = require("./routes/genres.js");

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));

app.use("/", indexRouter);
app.use("/games", gamesRouter);
app.use("/genres", genresRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Running on port ${PORT}`);
});