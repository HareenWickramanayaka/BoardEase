# QUICK START: Run BoardEase on Windows (VS Code)

## A. Open the project
1. Unzip the folder.
2. Open `BoardEase_MERN_Project` in VS Code.
3. Open **Terminal > New Terminal**.
4. Confirm Node.js is installed: `node -v` and `npm -v`.

## B. Make sure MongoDB is available
Choose ONE option:
- **Installed MongoDB Community Server**: start the MongoDB service in Windows, using the default localhost port 27017.
- **Docker Desktop** (if you already use Docker): run `docker run --name boardease-mongo -d -p 27017:27017 mongo:7`. If previously created, run `docker start boardease-mongo` instead.
- **MongoDB Atlas**: create a cluster, allow your current IP, add a database user, and put your `mongodb+srv://...` URI in `server/.env` as `MONGO_URI`. Do not push credentials to GitHub.

## C. Start the backend (terminal #1)
In VS Code at project root:
```bat
cd server
npm install
copy .env.example .env
npm run seed
npm run dev
```
Important: Change the JWT_SECRET in `server/.env` to a long random string. If you use Atlas, change MONGO_URI in `.env` **before** running the seed.

**If `.env` already exists**, skip the copy command or it may overwrite your settings.

Expected output: `MongoDB connected` and `API available on port 5000`.

## D. Start the frontend (terminal #2)
Open a separate terminal at the project root:
```bat
cd client
npm install
npm run dev
```
Open **http://localhost:5173** in Chrome.

## E. Demo accounts
- OWNER: `owner@boardease.lk` / `Owner123!`
- STUDENT: `student@boardease.lk` / `Student123!`

Use only after `npm run seed` completed successfully.

## F. Minimum essential test before submission
1. Login as owner and create a new boarding.
2. Find it on Explore (read).
3. Change the rent and refresh (update).
4. Delete it and refresh (delete).
5. Try a short description or invalid price to check validation.
6. Take screenshots of homepage, Explore, detail page, dashboard, add/edit form and delete dialog.
7. Insert YOUR screenshots in the DOCX report and record the actual test results. Export the report to PDF, verify it is <=10 pages.
8. Record demo video, webcam ON, keep it <=5 minutes.
9. Push repository to GitHub, copy GitHub URL into the lecturer's submission Google Sheet.
10. Rename report/video using your index number.

## If something doesn't work
- `Cannot connect to the server`: check `npm run dev` in the backend terminal, port 5000, and `CLIENT_URL` / `VITE_API_URL`.
- `MongoDB connection failed`: check `server/.env` and start MongoDB.
- `Invalid email or password`: rerun `npm run seed` on the correct database, or register a new user.
- `npm is not recognized`: install Node.js LTS and restart VS Code.
- Property pictures don't appear: photo URLs require internet; replace with your own HTTPS image URLs.

**Reminder:** MERN = MongoDB + Express + React + Node.js, using **JavaScript** (not Java). Review the code and follow your course's academic integrity requirements.
