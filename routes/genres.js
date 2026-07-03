const express = require("express");
const { isLoggedIn, isAdmin } = require("../middleware/auth.js");
const router = express.Router();

const genreController = require("../controllers/genreController.js");

router.get("/", genreController.getAllGenres);

router.get("/new", isLoggedIn, genreController.newGenreGet);
router.post("/new", isLoggedIn, genreController.newGenrePost);

router.get("/edit/:id", isLoggedIn, isAdmin, genreController.editGenreGet);
router.post("/edit/:id", isLoggedIn, isAdmin, genreController.editGenrePost);

router.post("/delete/:id", isLoggedIn, isAdmin, genreController.deleteGenre);

router.get("/:id", genreController.getGenreById);

module.exports = router;

