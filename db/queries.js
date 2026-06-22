const pool = require("./pool");

const createGame = async (name, rating, date_released, imagePath, developers) => {
  const { rows } = await pool.query(`
    INSERT INTO games (name, rating, date_released, cover_image, developers)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *`,
    [name, rating, date_released, imagePath, developers]
  );
  return rows[0];
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
  return rows[0];
};

const updateGame = async (id, name, rating, date_released, imagePath, developers) => {
  const { rows } = await pool.query(`
    UPDATE games
    SET name = $1, rating = $2, date_released = $3, cover_image = $4, developers = $5
    WHERE id = $6
    RETURNING *`, 
    [name, rating, date_released, imagePath, developers, id]
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


const createGenre = async (name) => {
  const { rows } = await pool.query(`
    INSERT INTO genres (name)
    VALUES ($1)
    RETURNING *
  `, [name]);
  return rows[0];
};

const readAllGenres = async () => {
  const { rows } = await pool.query(
    "SELECT * FROM genres ORDER BY name ASC"
  );
  return rows;
};

const readGenreById = async (id) => {
  const { rows } = await pool.query(
    "SELECT * FROM genres WHERE id = $1", [id]
  );
  return rows[0];
};

const updateGenre = async (id, name) => {
  const { rows } = await pool.query(`
    UPDATE genres
    SET name = $1
    WHERE id = $2
    RETURNING *
  `, [name, id]);
  return rows[0];
};

const deleteGenre = async (id) => {
  await pool.query("DELETE FROM genres WHERE id = $1", [id]);
};

//do last too.
const setGameGenres = async (game_id, genre_ids) => {
  // delete existing genre links for this game then reinsert
  await pool.query(
    "DELETE FROM game_genres WHERE game_id = $1", [game_id]
  );
  if (genre_ids.length === 0) {
    return;
  }
  const values = genre_ids.map(
    (genre_id, i) => `($1, $${i + 2})`
  ).join(", ");
  
  await pool.query(
    `INSERT INTO game_genres (game_id, genre_id) VALUES ${values}`,
    [game_id, ...genre_ids]
  );
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