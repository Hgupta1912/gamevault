# GameVault

A full CRUD game management app built with Node.js, Express, PostgreSQL, and EJS as part of [The Odin Project](https://www.theodinproject.com/) Node.js curriculum. Built to practice server-side rendering, MVC architecture, relational database design, RESTful routing, and session-based authentication.

**Live Demo:**  [Click here](https://gamevault-er00.onrender.com)


---

## What it does
 
GameVault lets you manage a database of video games and genres through a clean web interface.
 
**Anyone**
- Browse all games sorted by rating
- Browse games by genre
- Search games by title
**Logged in users**
- Everything above
- Add new games with a title, star rating, release date, developer(s), cover image, and genre tags
- Add new genres
**Admins**
- Everything above
- Edit and delete games
- Edit and delete genres
---

## Demo credentials
 
To explore the admin features (editing, and deleting games and genres), use the following test account:
 
| Field | Value |
|---|---|
| Email | admin@gamevault.com |
| Password | 1234 |
 
---

## Tech stack

| Layer | Technology |
|---|---|
| Runtime | Node.js |
| Framework | Express |
| Database | PostgreSQL |
| Query Layer | node-postgres (`pg`) |
| Views | EJS (server-side templating) |
| Authentication | Passport.js (local strategy) + express-session |
| Session store | connect-pg-simple (PostgreSQL) |
| Password hashing | bcrypt |
| File uploads | Multer |
| Environment | dotenv |
| Deployment | Render + Neon |

---

## Architecture

The app follows the **MVC pattern**:

- **Models** — `db/queries.js` contains all SQL queries via `pg` pool. No raw SQL in controllers.
- **Views** — EJS templates in `/views`, organized with partials for navbar, footer, and game cards.
- **Controllers** — `controllers/gameController.js`, `controllers/genreController.js`, and `controllers/authController.js` handle request logic, call the model layer, and pass data to views.
- **Routes** — `routes/index.js`,  `routes/games.js`, `routes/auth.js`, and `routes/genres.js` map URLs and HTTP methods to controllers.
- **Middleware** — `middleware/auth.js` exposes `isLoggedIn` and `isAdmin` middleware that protect mutating routes.

### Database schema

```
users       (id, email, password_hash, is_admin, created_at)
genres  (id, name)
games   (id, name, rating, date_released, cover_image, developers)
game_genres (game_id → games, genre_id → genres)   ← junction table
sessions    (sid, sess, expire)                     ← managed by connect-pg-simple
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
SESSION_SECRET=your_random_secret_here
```

Generate a session secret:
 
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
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

To create an admin account, register normally then update the user directly in psql:
 
```sql
UPDATE users SET is_admin = true WHERE email = 'your@email.com';
```

---

## Deployment

Deployed on **Render** (web server) + **Neon** (managed PostgreSQL).

Set the following environment variables in Render's dashboard:
 
```
NODE_ENV=production
DATABASE_URL=your_neon_connection_string
SESSION_SECRET=your_random_secret_here
```
 
After deploying, run the seed script once via Render's shell tab to initialize the database:

```bash
node db/populatedb.js
```

---

## Project structure

```
├── config/
│   └── passport.js
├── middleware/
│   ├── auth.js
│   └── upload.js
├── controllers/
│   ├── gameController.js
│   ├── genreController.js
│   └── authController.js
├── db/
│   ├── pool.js
│   ├── queries.js
│   └── populatedb.js
├── public/
│   ├── css/
│   ├── uploads/
│   └── logo.svg
├── routes/
│   ├── auth.js
│   ├── games.js
│   ├── genres.js
│   └── index.js
├── views/
│   ├── partials/
│   └── *.ejs
├── app.js
└── .env
```

---

## Notes

The views layer (all EJS templates and CSS) was built with assistance from [Claude](https://claude.ai) (Anthropic). All backend logic — routing, controllers, database queries, schema design, MVC architecture, and authentication — was written by [@Hgupta1912](https://github.com/Hgupta1912).

---

## Known Limitations

Image uploads do not persist on the free Render deployment. Multer saves uploaded cover images to the server's local filesystem, which Render wipes on every redeploy or restart. Any images uploaded through the UI after deployment will disappear the next time the server restarts.
The permanent fix is integrating a cloud storage service like Cloudinary, where images are uploaded directly to the cloud and stored as a URL in the database rather than as a file on the server.
Additionally, the free Render tier spins the server down after 15 minutes of inactivity, causing a 30-60 second cold start delay on the first request after a period of no traffic.

---

## Author

[@Hgupta1912](https://github.com/Hgupta1912)