//const pool = require("./pool");
const prisma = require("./prisma");

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

const readAllGames = async () => {
  const result = await prisma.games.findMany({
    include: { genres: true },
    orderBy: { rating: 'desc' },
  });
  return result;
};

const readGameById = async (id) => {
  const result = await prisma.games.findUnique({
    where: { id: Number(id) },
    include: { genres: true },
  });
  return result;
};

const readGamesByGenre = async (id) => {
  const result = await prisma.genres.findUnique({
    where: { id: Number(id) },
    include: { games: true },
  });
  return result;
};


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


const deleteGame = async (id) => {
  await prisma.games.delete({
    where: { id: Number(id) },
  });
};



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


const findUserByEmail = async (email) => { 
  return await prisma.users.findUnique({
    where: {email}
  });
};


const createUser = async (email, passwordHash) => { 
  return await prisma.users.create({
    data: {email, password_hash: passwordHash}
  });
};


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