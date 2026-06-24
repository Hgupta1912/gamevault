# GameVault

A full CRUD game management app built with Node.js, Express, PostgreSQL, and EJS as part of [The Odin Project](https://www.theodinproject.com/) Node.js curriculum. Built to practice server-side rendering, MVC architecture, relational database design, and RESTful routing.

**Live Demo:**  [Click here](https://gamevault-er00.onrender.com)


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
- **Routes** — `routes/index.js`,  `routes/games.js`, and `routes/genres.js` map URLs and HTTP methods to controllers.

### Database schema

```
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
│   └── uploadMiddleware.js.
├── db/
│   ├── pool.js
│   ├── queries.js
│   └── populatedb.js
├── public/
│   ├── css/
│   └── uploads/
│   └── logo.svg
├── routes/
│   ├── games.js
│   └── genres.js
│   └── index.js
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

## Known Limitations

Image uploads do not persist on the free Render deployment. Multer saves uploaded cover images to the server's local filesystem, which Render wipes on every redeploy or restart. Any images uploaded through the UI after deployment will disappear the next time the server restarts.
The permanent fix is integrating a cloud storage service like Cloudinary, where images are uploaded directly to the cloud and stored as a URL in the database rather than as a file on the server.
Additionally, the free Render tier spins the server down after 15 minutes of inactivity, causing a 30-60 second cold start delay on the first request after a period of no traffic.

---

## Author

[@Hgupta1912](https://github.com/Hgupta1912)