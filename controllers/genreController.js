const db = require("../db/queries");

const getAllGenres = async (req, res, next) => {
  try {
    const genres = await db.readAllGenres();
    res.render("genres", { genres });  // genres.ejs
  } catch (err) {
    next(err);
  }
};

const getGenreById = async (req, res, next) => {
  try {
    const genre = await db.readGamesByGenre(req.params.id);
    res.render("viewGenre", { genre });  // viewGenre.ejs
  } catch (err) {
    next(err);
  }
};

const newGenreGet = (req, res) => {
  res.render("newGenre");  // newGenre.ejs
};

const newGenrePost = async (req, res, next) => {
  try {
    const { name } = req.body;
    await db.createGenre(name);
    res.redirect("/genres");
  } catch (err) {
    next(err);
  }
};

const editGenreGet = async (req, res, next) => {
  try {
    const genre = await db.readGenreById(req.params.id);
    res.render("editGenre", { genre });  // editGenre.ejs
  } catch (err) {
    next(err);
  }
};

const editGenrePost = async (req, res, next) => {
  try {
    const { name } = req.body;
    await db.updateGenre(req.params.id, name);
    res.redirect("/genres");
  } catch (err) {
    next(err);
  }
};

const deleteGenre = async (req, res, next) => {
  try {
    await db.deleteGenre(req.params.id);
    res.redirect("/genres");
  } catch (err) {
    next(err);
  }
};

module.exports = {
    getAllGenres,
    getGenreById,
    newGenreGet,
    newGenrePost,
    editGenreGet,
    editGenrePost,
    deleteGenre
};
