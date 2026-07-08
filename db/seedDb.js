// db/populatedb.js
require("dotenv").config();
const prisma = require("./prisma");

const main = async () => {
  return prisma.$transaction(async (tx) => {
    console.log("Clearing tables...");

    // clear existing data first
    await tx.games.deleteMany({});
    await tx.genres.deleteMany({});

    // reset sequences so IDs start from 1 again
    await tx.$executeRawUnsafe(`ALTER SEQUENCE games_id_seq RESTART WITH 1`);
    await tx.$executeRawUnsafe(`ALTER SEQUENCE genres_id_seq RESTART WITH 1`);

    console.log("Seeding...");

    await tx.genres.createMany({
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

    const games = [
        { name: "Elden Ring", rating: 5, date_released: new Date("2022-02-25"), cover_image: "/uploads/elden-ring.jpg", developers: "FromSoftware, Bandai Namco", genres: { connect: [{ id: 1 }, { id: 2 }, { id: 9 }]}},
        { name: "The Last of Us Part II", rating: 5, date_released: new Date("2020-06-19"), cover_image: "/uploads/tlou2.png", developers: "Naughty Dog", genres: { connect: [{ id: 2 }, { id: 3 }, { id: 6 }]}},
        { name: "Red Dead Redemption 2", rating: 5, date_released: new Date("2018-10-26"), cover_image: "/uploads/rdr2.jpg", developers: "Rockstar Games", genres: { connect: [{ id: 2 }, { id: 3 }, { id: 9 }]}},
        { name: "Hollow Knight", rating: 5, date_released: new Date("2017-02-24"), cover_image: "/uploads/hollow-knight.png", developers: "Team Cherry", genres: { connect: [{ id: 2 }, { id: 3 }, { id: 9 }]} },
        { name: "FIFA 24", rating: 3, date_released: new Date("2023-09-29"), cover_image: "/uploads/fifa24.jpg", developers: "EA Sports", genres: { connect: { id: 4 }} },
        { name: "Resident Evil 4 Remake", rating: 5, date_released: new Date("2023-03-24"), cover_image: "/uploads/re4.jpeg", developers: "Capcom", genres: { connect: [{ id: 2 }, { id: 3 }, { id: 6 }]} },
        { name: "Hades", rating: 5, date_released: new Date("2020-09-17"), cover_image: "/uploads/hades.jpg", developers: "Supergiant Games", genres: { connect: [{ id: 2}, { id: 13 }]} },
        { name: "Cyberpunk 2077", rating: 4, date_released: new Date("2020-12-10"), cover_image: "/uploads/cyberpunk.jpeg", developers: "CD Projekt Red", genres: { connect: [{ id: 1 }, { id: 2 }, { id: 9 }]} },
      ];

    for(const game of games) {
      await tx.games.create({ data: game });
    }

    console.log("Data seeded.");
  });
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