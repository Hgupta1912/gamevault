# GameVault

A full CRUD game management app built with Node.js, Express, PostgreSQL, and EJS as part of [The Odin Project](https://www.theodinproject.com/) Node.js curriculum. Built to practice server-side rendering, MVC architecture, relational database design, and RESTful routing.

**Live Demo:** _coming soon_

---

## What it does

GameVault lets you manage a database of video games and genres through a clean web interface. You can:

- Add, edit, and delete games with a title, star rating, release date, developer(s), cover image, and genre tags
- Add, edit, and delete genres
- Browse all games sorted by rating
- Browse games by genre
- Search games by title
- Upload cover images via file upload (Multer)

---

## Tech stack

| Layer | Technology |
|---|---|
| Runtime | Node.js |
| Framework | Express |
| Database | PostgreSQL |
| ORM/Query | node-postgres (`pg`) |
| Views | EJS (server-side templating) |
| File uploads | Multer |
| Environment | dotenv |
| Deployment | Render + Neon |

---

## Architecture

The app follows the **MVC pattern**:

- **Models** — `db/queries.js` contains all SQL queries via `pg` pool. No raw SQL in controllers.
- **Views** — EJS templates in `/views`, organized with partials for navbar, footer, and game cards.
- **Controllers** — `controllers/gameController.js` and `controllers/genreController.js` handle request logic, call the model layer, and pass data to views.
- **Routes** — `routes/games.js` and `routes/genres.js` map URLs and HTTP methods to controllers.

### Database schema

```
ratings (id, stars, label)
genres  (id, name)
games   (id, name, rating, date_released, cover_image, developers)
game_genres (game_id → games, genre_id → genres)   ← junction table
```

Games and genres share a many-to-many relationship via the `game_genres` junction table.

---

## Getting started locally

### Prerequisites

- Node.js 18+
- PostgreSQL (via [Postgres.app](https://postgresapp.com/) on Mac or equivalent)

### Setup

```bash
git clone https://github.com/Hgupta1912/game-management-app
cd game-management-app
npm install
```

Create a `.env` file in the project root:

```
PORT=3000
NODE_ENV=development
DATABASE_URL=postgresql://yourusername:@localhost:5432/game_management
```

Create the database in psql:

```sql
CREATE DATABASE game_management;
```

Seed the database (creates tables and inserts initial data):

```bash
node db/populatedb.js
```

Start the dev server:

```bash
npm run dev
```

Visit `http://localhost:3000`.

---

## Deployment

Deployed on **Render** (web server) + **Neon** (managed PostgreSQL).

After deploying, run the seed script once via Render's shell tab to initialize the database:

```bash
node db/populatedb.js
```

---

## Project structure

```
├── controllers/
│   ├── gameController.js
│   ├── genreController.js
│   └── uploadMiddleware.js
├── db/
│   ├── pool.js
│   ├── queries.js
│   └── populatedb.js
├── public/
│   ├── css/
│   └── uploads/
├── routes/
│   ├── games.js
│   └── genres.js
├── views/
│   ├── partials/
│   └── *.ejs
├── app.js
└── .env
```

---

## Notes

The views layer (all EJS templates and CSS) was built with assistance from [Claude](https://claude.ai) (Anthropic). All backend logic — routing, controllers, database queries, schema design, and MVC architecture — was written by [@Hgupta1912](https://github.com/Hgupta1912).

---

## Author

[@Hgupta1912](https://github.com/Hgupta1912)