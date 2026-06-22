const pool = require("./pool");

const createGame = async (name, rating, date_released, imagePath, developers) => {
  const { rows } = await pool.query(`
    INSERT INTO games (name, rating, date_released, cover_image, developers)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *`,
    [name, rating, date_released, imagePath, developers]
  );
  return rows;
};

const readAllGames = async () => {
  const { rows } = await pool.query(`
    SELECT 
        games.*, 
        STRING_AGG(genres.name, ', ') AS genres
    FROM games
    LEFT JOIN game_genres ON game_genres.game_id = games.id
    LEFT JOIN genres ON genres.id = game_genres.genre_id
    GROUP BY games.id
    ORDER BY games.rating DESC`
  );
  return rows;
};

const readGameById = async (id) => {
  const { rows } = await pool.query(`
    SELECT 
        games.*, 
        STRING_AGG(genres.name, ', ') AS genres
    FROM games
    LEFT JOIN game_genres ON game_genres.game_id = games.id
    LEFT JOIN genres ON genres.id = game_genres.genre_id
    WHERE games.id = $1
    GROUP BY games.id`, 
    [id]
  );
  return rows;
};

const updateGame = async (id, name, rating, date_released, imagePath, developers) => {
  const { rows } = await pool.query(`
    UPDATE games
    SET name = $1, rating = $2, date_released = $3, cover_image = $4, developers = $5
    WHERE id = $6
    RETURNING *`, 
    [name, rating_id, date_released, imagePath, developers, id]
  );
  return rows[0];
};

const deleteGame = async (id) => {
  await pool.query("DELETE FROM games WHERE id = $1", [id]);
};

//DO! ill do it last...
const searchGames = async (searchTerm) => {
  const { rows } = await pool.query("SELECT * FROM games");
  return rows;
};


const createGenre = async () => {
  const { rows } = await pool.query("SELECT * FROM games");
  return rows;
};

const readAllGenres = async () => {
  const { rows } = await pool.query("SELECT * FROM games");
  return rows;
};

const readGenreById = async () => {
  const { rows } = await pool.query("SELECT * FROM games");
  return rows;
};

const updateGenre = async () => {
  const { rows } = await pool.query("SELECT * FROM games");
  return rows;
};

const deleteGenre = async () => {
  const { rows } = await pool.query("SELECT * FROM games");
  return rows;
};

const setGameGenres = async (game_id, genre_id) => {
  const { rows } = await pool.query("SELECT * FROM games");
  return rows;
};

module.exports = {
  readAllGames,
  readGameById,
  createGame,
  updateGame,
  deleteGame,
  searchGames,
  readAllGenres,
  readGenreById,
  createGenre,
  updateGenre,
  deleteGenre,
  setGameGenres
};