const express = require("express");
const router = express.Router();

const gameController = require("../controllers/gameController.js");
const { upload } = require("../controllers/uploadMiddleware");

router.get("/", gameController.getAllGames);

router.post("/search", gameController.searchGames);

router.get("/new", gameController.newGameGet);
router.post("/new", upload.single("cover_image"), gameController.newGamePost);

router.get("/:id/edit", gameController.editGameGet);
router.post("/:id/edit", upload.single("cover_image"), gameController.editGamePost);

router.post("/:id/delete", gameController.deleteGame);

router.get("/:id", gameController.getGameById); //WILDCARD! put last

module.exports = router;
