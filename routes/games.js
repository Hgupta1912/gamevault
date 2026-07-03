const express = require("express");
const { isLoggedIn, isAdmin } = require("../middleware/auth.js");
const router = express.Router();

const gameController = require("../controllers/gameController.js");
const { upload } = require("../middleware/upload.js");

router.get("/", gameController.getAllGames);

router.post("/search", gameController.searchGames);

router.get("/new", isLoggedIn, gameController.newGameGet);
router.post("/new", isLoggedIn, upload.single("cover_image"), gameController.newGamePost);

router.get("/:id/edit", isLoggedIn, isAdmin, gameController.editGameGet);
router.post("/:id/edit", isLoggedIn, isAdmin, upload.single("cover_image"), gameController.editGamePost);

router.post("/:id/delete", isLoggedIn, isAdmin, gameController.deleteGame);

router.get("/:id", gameController.getGameById); //WILDCARD! put last

module.exports = router;
