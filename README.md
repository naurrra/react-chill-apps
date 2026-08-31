
## Project Structure

\`\`\`
react-chill-apps/
├── index.html                  # entry point, loads all scripts
├── package.json                # used only to run a static server (serve)
├── .gitignore
├── assets/
│   ├── css/main.css            # all styling
│   └── image/                  # place your image assets here
└── src/
    ├── App.jsx                 # top-level parent, holds page/user/watchlist state
    ├── data/
    │   ├── movieData.js
    │   └── watchlistData.js
    ├── components/
    │   ├── Header.jsx
    │   ├── Hero.jsx
    │   ├── MovieCard.jsx
    │   ├── ContentSection.jsx
    │   ├── Footer.jsx
    │   ├── WatchlistForm.jsx
    │   └── WatchlistTable.jsx
    └── pages/
        ├── Home.jsx
        ├── Login.jsx
        ├── Register.jsx
        └── Watchlist.jsx
\`\`\`

## Getting Started

\`\`\`bash
npm install
npm run start
\`\`\`

The terminal will print a local address, typically `http://localhost:3000`. Open it in a browser.

There is no compilation step involved. `serve` simply serves the files as they are, and Babel handles the JSX-to-JavaScript translation in the browser on every page load.

## Authentication

There is no backend or database behind this project, so authentication is currently a placeholder. On first load, the application redirects straight to the Login page rather than Home — this is intentional, since every other page is only reachable after a session is established.

To log in, enter any value in the **Username** and **Password** fields (empty fields are rejected, but no server-side check exists), then click **Masuk**. Whatever username is entered will appear next to the avatar icon in the top-right corner after login.

New users can click the **Daftar** link below the login form to reach the Register page. Filling in a username, password, and matching confirmation password is treated as a successful registration, and the user is signed in immediately afterward.

To sign out, click the avatar icon and select **Keluar** from the dropdown menu. This clears the session and returns to the Login page.

## Adding Images

The `assets/image/` folder is intentionally empty — no placeholders are included. Drop in files with the exact names below and they will be picked up automatically:

| File name | Used in |
|---|---|
| `logo.png` | Header and Footer |
| `user-icon.png` | Avatar in the Header |
| `header.png` | Hero banner image |
| `foto_1.png` through `foto_16.png` | Movie posters throughout the app |

## Features

- **Login / Register** — the mandatory entry point; validation is limited to empty-field checks and password confirmation matching
- **Home** — a hero banner for the featured title, followed by rows such as Continue Watching, Top Rating, Trending Now, and New Releases
- **Watchlist (Daftar Saya)** — a full CRUD page for tracking titles to watch:
  - add a new entry via the **+ Tambah** button, which opens a modal form
  - view all entries in a table, with search and status filtering
  - click **Ubah** to edit an entry; the form is pre-filled with its current data
  - click **Hapus** to remove an entry
  - the form only exposes **Title**, **Rating**, and **Watch Status** — Type and Genre are treated as fixed metadata and are not user-editable

## State Architecture

`App.jsx` sits at the top of the component tree and owns three pieces of state: `page` (the currently active view), `user` (the signed-in identity), and `watchlist` (the CRUD dataset). All mutations to this data go through handler functions defined in `App.jsx`, which are then passed down to child components as props.

Components that only need state for their own purposes — form inputs on the Login page, the volume control inside Hero, or the search query on the Watchlist page — keep that state locally rather than lifting it to `App.jsx`. As a result, typing into the Watchlist search field only re-renders the Watchlist page itself; unrelated components are unaffected.

## Notes

- Since there is no bundler, every file runs as a classic script sharing a single global scope rather than as ES modules. The order of `<script>` tags in `index.html` matters — data files and child components must be loaded before the components that depend on them.
- Watchlist data is held entirely in memory. Refreshing the page resets it to the seed data in `watchlistData.js`. Persisting changes would require wiring this up to a backend or, at minimum, `localStorage`.
