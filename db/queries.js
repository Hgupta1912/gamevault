//const pool = require("./pool");
const prisma = require("./prisma");


  // const createGame = async (name, rating, date_released, imagePath, developers) => {
  //   const { rows } = await pool.query(`
  //     INSERT INTO games (name, rating, date_released, cover_image, developers)
  //     VALUES ($1, $2, $3, $4, $5)
  //     RETURNING *`,
  //     [name, rating, date_released, imagePath, developers]
  //   );
  //   return rows[0];
  // };

const createGame = async (name, rating, date_released, imagePath, developers, genreIds) => {
  const result = await prisma.games.create({ 
    data: {
      name,
      rating: Number(rating),
      date_released: new Date(date_released),
      cover_image: imagePath,
      developers,
      genres: { connect: genreIds.map((id) => ({id: Number(id)})) }
    }
  });
  return result;
};

// const readAllGames = async () => {
//   const { rows } = await pool.query(`
//     SELECT 
//         games.*, 
//         STRING_AGG(genres.name, ', ') AS genres
//     FROM games
//     LEFT JOIN game_genres ON game_genres.game_id = games.id
//     LEFT JOIN genres ON genres.id = game_genres.genre_id
//     GROUP BY games.id
//     ORDER BY games.rating DESC`
//   );
//   return rows;
// };

const readAllGames = async () => {
  const result = await prisma.games.findMany({
    include: { genres: true },
    orderBy: { rating: 'desc' },
  });
  return result;
};

// const readGameById = async (id) => {
//   const { rows } = await pool.query(`
//     SELECT 
//         games.*, 
//         STRING_AGG(genres.name, ', ') AS genres
//     FROM games
//     LEFT JOIN game_genres ON game_genres.game_id = games.id
//     LEFT JOIN genres ON genres.id = game_genres.genre_id
//     WHERE games.id = $1
//     GROUP BY games.id`, 
//     [id]
//   );
//   return rows[0];
// };

const readGameById = async (id) => {
  const result = await prisma.games.findUnique({
    where: { id: Number(id) },
    include: { genres: true },
  });
  return result;
};

// const readGamesByGenre = async (id) => {
//     const { rows } = await pool.query(`
//     SELECT 
//         genres.*,
//         JSON_AGG(
//             JSON_BUILD_OBJECT(
//                 'id', games.id,
//                 'name', games.name,
//                 'rating', games.rating,
//                 'cover_image', games.cover_image
//             )
//         ) AS games
//     FROM genres
//     LEFT JOIN game_genres ON game_genres.genre_id = genres.id
//     LEFT JOIN games ON games.id = game_genres.game_id
//     WHERE genres.id = $1
//     GROUP BY genres.id
//     `, [id]);
//     return rows[0];
// };

const readGamesByGenre = async (id) => {
  const result = await prisma.genres.findUnique({
    where: { id: Number(id) },
    include: { games: true },
  });
  return result;
};

// const updateGame = async (id, name, rating, date_released, imagePath, developers) => {
//   const { rows } = await pool.query(`
//     UPDATE games
//     SET name = $1, rating = $2, date_released = $3, cover_image = $4, developers = $5
//     WHERE id = $6
//     RETURNING *`, 
//     [name, rating, date_released, imagePath, developers, id]
//   );
//   return rows[0];
// };

const updateGame = async (id, name, rating, date_released, imagePath, developers, genreIds) => {
  return await prisma.games.update({
    where: { id: Number(id) },
    data: {
      name,
      rating: Number(rating),
      date_released: new Date(date_released),
      cover_image: imagePath,
      developers,
      //set reomves all previes connections
      genres: { set: genreIds.map((id) => ({id: Number(id)})) }
    },
  });
};

// const deleteGame = async (id) => {
//   await pool.query("DELETE FROM games WHERE id = $1", [id]);
// };

const deleteGame = async (id) => {
  await prisma.games.delete({
    where: { id: Number(id) },
  });
};

// const searchGames = async (searchTerm) => {
//   const { rows } = await pool.query(`
//     SELECT 
//       games.*,
//       STRING_AGG(genres.name, ', ') AS genres
//     FROM games
//     LEFT JOIN game_genres ON game_genres.game_id = games.id
//     LEFT JOIN genres ON genres.id = game_genres.genre_id
//     WHERE LOWER(games.name) LIKE LOWER($1)
//     GROUP BY games.id
//     ORDER BY games.rating DESC
//   `, [`%${searchTerm}%`]);
//   return rows;
// };

const searchGames = async (searchTerm) => {
  return await prisma.games.findMany({
    where: {
      name: {
        contains: searchTerm,
        mode: 'insensitive',
      },
    },
    include: {
      genres: true,
    },
    orderBy: {
      rating: 'desc',
    },
  });
};


// const createGenre = async (name) => {
//   const { rows } = await pool.query(`
//     INSERT INTO genres (name)
//     VALUES ($1)
//     RETURNING *
//   `, [name]);
//   return rows[0];
// };

// const readAllGenres = async () => {
//   const { rows } = await pool.query(
//     "SELECT * FROM genres ORDER BY name ASC"
//   );
//   return rows;
// };

// const readGenreById = async (id) => {
//   const { rows } = await pool.query(
//     "SELECT * FROM genres WHERE id = $1", [id]
//   );
//   return rows[0];
// };

// const updateGenre = async (id, name) => {
//   const { rows } = await pool.query(`
//     UPDATE genres
//     SET name = $1
//     WHERE id = $2
//     RETURNING *
//   `, [name, id]);
//   return rows[0];
// };

// const deleteGenre = async (id) => {
//   await pool.query("DELETE FROM genres WHERE id = $1", [id]);
// };

const createGenre = async (name) => {
  return await prisma.genres.create({
    data: { name },
  });
};

const readAllGenres = async () => {
  return await prisma.genres.findMany({
    orderBy: { name: 'asc' },
  });
};

const readGenreById = async (id) => {
  return await prisma.genres.findUnique({
    where: { id: Number(id) },
  });
};

const updateGenre = async (id, name) => {
  return await prisma.genres.update({
    where: { id: Number(id) },
    data: { name },
  });
};

const deleteGenre = async (id) => {
  await prisma.genres.delete({
    where: { id: Number(id) },
  });
};

// const setGameGenres = async (game_id, genre_ids) => {
//   // delete existing genre links for this game then reinsert
//   await pool.query(
//     "DELETE FROM game_genres WHERE game_id = $1", [game_id]
//   );
//   if (genre_ids.length === 0) {
//     return;
//   }
//   const values = genre_ids.map(
//     (genre_id, i) => `($1, $${i + 2})`
//   ).join(", ");

//   await pool.query(
//     `INSERT INTO game_genres (game_id, genre_id) VALUES ${values}`,
//     [game_id, ...genre_ids]
//   );
// };

// const findUserByEmail = async (email) => { 
//   const { rows } = await pool.query(`
//     SELECT *
//     FROM users
//     WHERE email = $1
//   `, [email]);
//   return rows[0];
// };

const findUserByEmail = async (email) => { 
  return await prisma.users.findUnique({
    where: {email}
  });
};

// const createUser = async (email, passwordHash) => {
//   const { rows } = await pool.query(`
//     INSERT INTO users (email, password_hash)
//     VALUES ($1, $2)
//     RETURNING *
//   `, [email, passwordHash]);
//   return rows[0];
// };

const createUser = async (email, passwordHash) => { 
  return await prisma.users.create({
    data: {email, password_hash: passwordHash}
  });
};

// const findUserById = async (id) => { 
//   const { rows } = await pool.query(`
//     SELECT *
//     FROM users
//     WHERE id = $1
//   `, [id]);
//   return rows[0];
// };

const findUserById = async (id) => { 
  return await prisma.users.findUnique({
    where: {id: Number(id)}
  });
};

module.exports = {
  readAllGames,
  readGameById,
  createGame,
  readGamesByGenre,
  updateGame,
  deleteGame,
  searchGames,
  readAllGenres,
  readGenreById,
  createGenre,
  updateGenre,
  deleteGenre,
  createUser,
  findUserByEmail,
  findUserById
};