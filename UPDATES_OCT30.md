# BoardEase improvements — 30 October 2026

- Improved small text sizes on navigation, cards, search and hero.
- Removed selected decorative full stops from brand and page headings.
- Home and Explore cards navigate to the detail route. Guests must log in before entering details.
- Public listing API hides contact number and full description; the detail API requires a valid login token.
- Favourites are stored per student in MongoDB, not in shared browser localStorage. Previously saved browser-only favourites are not migrated.
- Removed demo login credentials from the login page.
- Mobile menu includes an aria-expanded state and improved menu layering.

## Install update
1. Replace your existing `client/src/App.jsx`, `client/src/style.css`, `server/index.js`, `server/models/User.js`, and `server/routes/boardings.js` using the revised files.
2. Copy the new `server/routes/favorites.js` file.
3. Restart backend and frontend (Ctrl+C then `npm run dev`).
4. Test both independent student accounts and guest detail access.

Do not replace your server/.env file or database. MongoDB will add the `favorites` field to user records when saving favourites.
