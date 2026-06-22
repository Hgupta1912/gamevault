const express = require("express");
const router = express.Router();

const genreController = require("../controllers/genreController.js");

router.get("/", genreController.getAllGenres);

router.get("/:id", genreController.getGenreById);

router.get("/new", genreController.newGenreGet);
router.post("/new", genreController.newGenrePost);

router.get("/edit/:id", genreController.editGenreGet);
router.post("/edit/:id", genreController.editGenrePost);

router.post("/delete/:id", genreController.deleteGenre);

module.exports = router;

