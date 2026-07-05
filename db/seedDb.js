// db/populatedb.js
require("dotenv").config();
const prisma = require("./prisma");

async function main() {
  console.log("Clearing tables...");

  // clear existing data first
  await prisma.game_genres.deleteMany({});
  await prisma.games.deleteMany({});
  await prisma.genres.deleteMany({});

  // reset sequences so IDs start from 1 again
  await prisma.$executeRawUnsafe(`ALTER SEQUENCE games_id_seq RESTART WITH 1`);
  await prisma.$executeRawUnsafe(`ALTER SEQUENCE genres_id_seq RESTART WITH 1`);

  console.log("Seeding...");

  await prisma.genres.createMany({
    data: [
      { name: "RPG" },
      { name: "Action" },
      { name: "Adventure" },
      { name: "Sports" },
      { name: "Strategy" },
      { name: "Horror" },
      { name: "Shooter" },
      { name: "Platformer" },
      { name: "Open World" },
      { name: "Fighting" },
      { name: "Simulation" },
      { name: "Puzzle" },
      { name: "Roguelike" },
    ],
  });

  await prisma.games.createMany({
    data: [
      { name: "Elden Ring", rating: 5, date_released: new Date("2022-02-25"), cover_image: "/uploads/elden-ring.jpg", developers: "FromSoftware, Bandai Namco" },
      { name: "The Last of Us Part II", rating: 5, date_released: new Date("2020-06-19"), cover_image: "/uploads/tlou2.png", developers: "Naughty Dog" },
      { name: "Red Dead Redemption 2", rating: 5, date_released: new Date("2018-10-26"), cover_image: "/uploads/rdr2.jpg", developers: "Rockstar Games" },
      { name: "Hollow Knight", rating: 5, date_released: new Date("2017-02-24"), cover_image: "/uploads/hollow-knight.png", developers: "Team Cherry" },
      { name: "FIFA 24", rating: 3, date_released: new Date("2023-09-29"), cover_image: "/uploads/fifa24.jpg", developers: "EA Sports" },
      { name: "Resident Evil 4 Remake", rating: 5, date_released: new Date("2023-03-24"), cover_image: "/uploads/re4.jpeg", developers: "Capcom" },
      { name: "Hades", rating: 5, date_released: new Date("2020-09-17"), cover_image: "/uploads/hades.jpg", developers: "Supergiant Games" },
      { name: "Cyberpunk 2077", rating: 4, date_released: new Date("2020-12-10"), cover_image: "/uploads/cyberpunk.jpeg", developers: "CD Projekt Red" },
    ],
  });

  await prisma.game_genres.createMany({
    data: [
      { game_id: 1, genre_id: 1 }, { game_id: 1, genre_id: 2 }, { game_id: 1, genre_id: 9 },
      { game_id: 2, genre_id: 2 }, { game_id: 2, genre_id: 3 }, { game_id: 2, genre_id: 6 },
      { game_id: 3, genre_id: 2 }, { game_id: 3, genre_id: 3 }, { game_id: 3, genre_id: 9 },
      { game_id: 4, genre_id: 2 }, { game_id: 4, genre_id: 3 }, { game_id: 4, genre_id: 8 },
      { game_id: 5, genre_id: 4 },
      { game_id: 6, genre_id: 2 }, { game_id: 6, genre_id: 3 }, { game_id: 6, genre_id: 6 },
      { game_id: 7, genre_id: 2 }, { game_id: 7, genre_id: 13 },
      { game_id: 8, genre_id: 1 }, { game_id: 8, genre_id: 2 }, { game_id: 8, genre_id: 9 },
    ],
  });

  console.log("Data seeded.");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });