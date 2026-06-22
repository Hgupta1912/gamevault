const { Client } = require("pg");
require("dotenv").config();

const dropTables = `
  DROP TABLE IF EXISTS game_genres, games, genres, ratings;
`;

const createTables = `
  CREATE TABLE IF NOT EXISTS genres (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL
  );

  CREATE TABLE IF NOT EXISTS games (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    rating INTEGER NOT NULL,
    date_released DATE NOT NULL,
    cover_image VARCHAR(500) NOT NULL,
    developers TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS game_genres (
    game_id INTEGER REFERENCES games(id) ON DELETE CASCADE,
    genre_id INTEGER REFERENCES genres(id) ON DELETE CASCADE,
    PRIMARY KEY (game_id, genre_id)
  );
`;

const seedGenres = `
  INSERT INTO genres (name) VALUES
    ('RPG'),
    ('Action'),
    ('Adventure'),
    ('Sports'),
    ('Strategy'),
    ('Horror'),
    ('Shooter'),
    ('Platformer'),
    ('Open World'),
    ('Fighting'),
    ('Simulation'),
    ('Puzzle'),
    ('Roguelike');
`;

const seedGames = `
  INSERT INTO games (name, rating, date_released, cover_image, developers) VALUES
    ('Elden Ring', 5, '2022-02-25', '/uploads/elden-ring.jpg', 'FromSoftware, Bandai Namco'),
    ('The Last of Us Part II', 5, '2020-06-19', '/uploads/tlou2.png', 'Naughty Dog'),
    ('Red Dead Redemption 2', 5, '2018-10-26', '/uploads/rdr2.jpg', 'Rockstar Games'),
    ('Hollow Knight', 5, '2017-02-24', '/uploads/hollow-knight.png', 'Team Cherry'),
    ('FIFA 24', 3, '2023-09-29', '/uploads/fifa24.jpg', 'EA Sports'),
    ('Resident Evil 4 Remake', 5, '2023-03-24', '/uploads/re4.jpeg', 'Capcom'),
    ('Hades', 5, '2020-09-17', '/uploads/hades.jpg', 'Supergiant Games'),
    ('Cyberpunk 2077', 4, '2020-12-10', '/uploads/cyberpunk.jpeg', 'CD Projekt Red');
`;

const seedGameGenres = `
  INSERT INTO game_genres (game_id, genre_id) VALUES
    (1, 1), (1, 2), (1, 9),
    (2, 2), (2, 3), (2, 6),
    (3, 2), (3, 3), (3, 9),
    (4, 2), (4, 3), (4, 8),
    (5, 4),
    (6, 2), (6, 3), (6, 6),
    (7, 2), (7, 13),
    (8, 1), (8, 2), (8, 9);
`;

async function main() {
  console.log("Seeding...");
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === "production"
      ? { rejectUnauthorized: false }
      : false
  });
  try {
    await client.connect();
    console.log("Connected to database.");
    await client.query(dropTables);
    console.log("Tables dropped.");
    await client.query(createTables);
    console.log("Tables created.");
    await client.query(seedGenres);
    await client.query(seedGames);
    await client.query(seedGameGenres);
    console.log("Data seeded.");
  } catch (error) {
    console.error("Error occurred:", error);
  } finally {
    await client.end();
    console.log("Done.");
  }
}

main();