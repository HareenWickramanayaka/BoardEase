# BoardEase — 5-minute demonstration plan (camera ON)

**Speak naturally; do not read the whole page word for word.** Aim for **4:30–4:50**, leave a margin below five minutes. Show your camera as required.

## 0:00–0:35 | Introduction
"Hello, I am [your name], and this is my EC4307 Web Application Development mini project, BoardEase — a Smart Boarding Finder. It helps students find affordable boarding spaces and helps boarding owners manage their listings. This is a MERN stack project using MongoDB, Express, React, and Node.js."

Show the landing page and its hero, search box, and cards.

## 0:35–1:15 | Student functionality (READ)
"First, students can explore all listed properties. They can search by location, filter by room type and monthly rent, and sort the results. Each property card leads to a detail page showing the rent, rooms, available spots, amenities, and owner contact options."

Search **Matara**, change a filter, choose **Price: low to high**, open one listing, click Save, show favourites.

## 1:15–1:40 | System design
"The frontend is built with React and calls Express REST endpoints using fetch. MongoDB stores the accounts and boarding records. Each boarding is linked to an owner by an ObjectId. Passwords are hashed, and owners are verified using JWT tokens."

Briefly show the `server/models/Boarding.js` file and the relationship diagram in README.

## 1:40–3:30 | OWNER CRUD — MOST IMPORTANT
"Now I will demonstrate all four database operations as the owner."

1. **CREATE**: Sign in as `owner@boardease.lk` / `Owner123!`. Dashboard > Add new boarding. Enter a title, city, location, description (at least 20 characters), monthly rent, type, gender, contact, and choose an image. Click Publish.
2. **READ**: Verify the new property appears in the dashboard and public Explore page. Open the detail page.
3. **UPDATE**: Return to dashboard, click edit, change the price or title, save. Refresh and show that the update was stored.
4. **DELETE**: Use the trash button on the **test** property, confirm deletion, refresh and verify the property is gone.

## 3:30–4:10 | Validation and database
"The frontend checks required fields and number limits. The Express backend also validates entries. A user cannot edit or delete another owner's records, because the server checks the logged-in owner ID. All CRUD records remain stored in MongoDB after refresh."

Show invalid price or too-short description briefly; if possible, show the MongoDB collection.

## 4:10–4:40 | Responsive UI and conclusion
"The site is responsive, so students can browse on a phone or laptop. The application also contains a separate owner dashboard, saved listings, and direct contact links. In the future, the project could include verified listings, image uploads and online bookings. Thank you."

Use browser responsive mode to show the mobile layout. End recording before 5 minutes.

## Recording tips
- Display both your screen and webcam face.
- Prepare the test listing data in a text file before recording, and copy/paste it quickly.
- Run `npm run dev` on both sides beforehand; check MongoDB is connected.
- The assignment requires camera ON and a maximum of five minutes.
- Name the recording with your index number according to your lecturer's instructions.
