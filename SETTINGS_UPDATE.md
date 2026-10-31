# BoardEase — Profile, Settings and Dark Mode

## New features
- Profile & Settings link for signed-in students and owners (`/settings`)
- Update name and email (MongoDB `users` collection)
- Change password using the current password (bcrypt hash saved; passwords never returned)
- Switch between light and dark appearance from navbar or Settings
- Theme preference saved in this browser using `localStorage`
- Existing boarding CRUD, favorites, authentication and demo accounts retained
- Formatted existing stylesheet into readable declarations; new Settings code uses short lines
- Demo credentials are not displayed in the Login page

## Run on Windows (PowerShell)
First install MongoDB Community Server and ensure its service is Running.

Backend terminal:
```powershell
cd server
npm install
Copy-Item .env.example .env
```
Edit `.env` with `MONGO_URI` and a secure, private `JWT_SECRET`. Do not overwrite an existing working `.env`.
```powershell
npm run seed
npm run dev
```
Frontend terminal from project root:
```powershell
cd client
npm install
npm run dev
```
Open http://localhost:5173

If port 5000 is occupied, stop the older project's backend terminal using Ctrl+C.

## Test checklist
1. Log in with either demo account.
2. Open Profile & settings from navigation.
3. Change name and email, refresh page, verify changes persist.
4. Change password, log out, test old and new passwords.
5. Toggle dark mode; refresh the page and verify preference persists.
6. Test student favorites do not appear in another student's account.
7. Test owner add/edit/delete and student listing navigation.

## Notes
- Name/email profile update requires authentication.
- Password is never shown in the profile and changes only after checking old password.
- `DEMO_LOGIN_DETAILS.txt` is for local demos only; don't publish default demo passwords in production.
- Dark mode is a browser-level preference, not stored in MongoDB.
- This source package has undergone JSX parse and backend syntax checks, but has not been browser-tested against a running MongoDB instance in this environment.
