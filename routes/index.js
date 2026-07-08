const express = require("express");
const router = express.Router();
const apicache = require('apicache');
const cache = apicache.middleware;

router.route("/").get(cache('5 minutes'), (req, res) => {
  res.render("index", { title: "gameMAN" });
});

module.exports = router;