// controllers/gameController.js
const db = require("../db/queries");

const getAllGames = async (req, res, next) => {
  try {
    const games = await db.readAllGames();
    res.render("games", { games });
  } catch (err) {
    next(err);
  }
};

const getGameById = async (req, res, next) => {
  try {
    const game = await db.readGameById(req.params.id);
    if (!game) return res.status(404).render("error", { status: 404, message: "Game not found" });
    res.render("viewGame", { game });
  } catch (err) {
    next(err);
  }
};

const searchGames = async (req, res, next) => {
  try {
    const { search } = req.body;
    const games = await db.searchGames(search);
    res.render("search", { games, search });
  } catch (err) {
    next(err);
  }
};

const newGameGet = async (req, res, next) => {
  try {
    const genres = await db.readAllGenres();
    res.render("newGame", { genres });
  } catch (err) {
    next(err);
  }
};

const newGamePost = async (req, res, next) => {
  try {
    const { name, rating, date_released, developers, genres } = req.body;
    const imagePath = req.file ? `/uploads/${req.file.filename}` : null;
    const genreIds = genres ? (Array.isArray(genres) ? genres : [genres]) : [];
    const game = await db.createGame(name, rating, date_released, imagePath, developers, genreIds);
    res.redirect("/games");
  } catch (err) {
    next(err);
  }
};

const editGameGet = async (req, res, next) => {
  try {
    const [game, genres] = await Promise.all([
      db.readGameById(req.params.id),
      db.readAllGenres()
    ]);
    res.render("editGame", { game, genres });
  } catch (err) {
    next(err);
  }
};

const editGamePost = async (req, res, next) => {
  try {
    const { name, rating, date_released, developers, genres } = req.body;
    const imagePath = req.file
      ? `/uploads/${req.file.filename}`
      : req.body.existing_image; // keep old image if no new one uploaded
    const genreIds = genres ? (Array.isArray(genres) ? genres : [genres]) : [];
    await db.updateGame(req.params.id, name, rating, date_released, imagePath, developers, genreIds);
    res.redirect(`/games/${req.params.id}`);
  } catch (err) {
    next(err);
  }
};

const deleteGame = async (req, res, next) => {
  try {
    await db.deleteGame(req.params.id);
    res.redirect("/games");
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllGames,
  getGameById,
  searchGames,
  newGameGet,
  newGamePost,
  editGameGet,
  editGamePost,
  deleteGame
};