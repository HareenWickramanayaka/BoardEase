# BoardEase Database Architecture

This directory houses the database models, schema definitions, relationships, and seeding scripts for the BoardEase application.

---

## Directory Structure

```text
database/
├── models/
│   ├── mongoose.js          # Shared, resilient Mongoose instance loader
│   ├── User.js              # User account schema with hashed passwords & role
│   ├── Boarding.js          # Boarding property listing schema with full-text index
│   ├── BookingRequest.js    # Student accommodation booking inquiry schema
│   └── index.js             # Unified module exporting all models
├── seed/
│   └── seed.js              # Database seeder with sample accounts & realistic listings
└── README.md                # This documentation
```

---

## Data Models & Schemas

### 1. `User` (`database/models/User.js`)
Stores authentication credentials, user roles, and saved property bookmarks.
- `name` (String, required, trim)
- `email` (String, required, unique, lowercase, trim)
- `password` (String, required, hidden by default with `select: false`, hashed with bcrypt)
- `role` (String, enum: `['student', 'owner']`, default: `'student'`)
- `favorites` (Array of `ObjectId` referencing `Boarding`)
- Timestamps: `createdAt`, `updatedAt`

### 2. `Boarding` (`database/models/Boarding.js`)
Represents rental properties managed by owners.
- `title` (String, 5–100 characters)
- `city` (String, required)
- `location` (String, required, specific neighbourhood/address)
- `description` (String, minimum 20 characters)
- `price` (Number, monthly rent in LKR, minimum 1,000)
- `deposit` (Number, security deposit, default: 0)
- `type` (String, enum: `['Single Room', 'Shared Room', 'Annex', 'Studio']`)
- `gender` (String, enum: `['Any', 'Male', 'Female']`)
- `beds` (Number, 1–20, default: 1)
- `baths` (Number, 1–10, default: 1)
- `availableSpots` (Number, minimum 0, default: 1)
- `amenities` (Array of Strings: Wi-Fi, Kitchen, Attached Bath, etc.)
- `image` (String, primary image URL or Base64 data URI)
- `images` (Array of Strings, gallery photos)
- `phone` (String, landlord contact number)
- `featured` (Boolean, default: false)
- `owner` (`ObjectId` referencing `User`, required)
- Index: Text index on `{ title: 'text', city: 'text', location: 'text', description: 'text' }`
- Timestamps: `createdAt`, `updatedAt`

### 3. `BookingRequest` (`database/models/BookingRequest.js`)
Represents an accommodation inquiry submitted by a student to a property owner.
- `student` (`ObjectId` referencing `User`, required)
- `boarding` (`ObjectId` referencing `Boarding`, required)
- `owner` (`ObjectId` referencing `User`, required)
- `message` (String, 5–500 characters)
- `moveInDate` (Date, required)
- `status` (String, enum: `['pending', 'accepted', 'rejected']`, default: `'pending'`)
- Timestamps: `createdAt`, `updatedAt`

---

## Entity-Relationship Diagram (ERD)

```text
┌──────────────────────────────────────┐
│                 USER                 │
├──────────────────────────────────────┤
│ _id          : ObjectId (PK)         │
│ name         : String                │
│ email        : String (unique)       │
│ password     : String (bcrypt hash)  │
│ role         : 'student' | 'owner'   │
│ favorites    : [ObjectId -> Boarding]│
└──────────────────┬───────────────────┘
                   │
                   │ 1 : N (Owner creates listings)
                   ▼
┌──────────────────────────────────────┐          ┌──────────────────────────────────────┐
│               BOARDING               │          │           BOOKING REQUEST            │
├──────────────────────────────────────┤          ├──────────────────────────────────────┤
│ _id          : ObjectId (PK)         │          │ _id          : ObjectId (PK)         │
│ owner        : ObjectId -> User (FK) │◄─────────┤ boarding     : ObjectId -> Boarding  │
│ title        : String                │   1 : N  │ student      : ObjectId -> User (FK) │
│ city, location, price, deposit       │          │ owner        : ObjectId -> User (FK) │
│ type, gender, beds, baths, spots     │          │ moveInDate   : Date                  │
│ amenities[], image, images[], phone  │          │ message      : String (5-500 chars)  │
│ featured     : Boolean               │          │ status       : 'pending'|'accepted'  │
└──────────────────────────────────────┘          │                | 'rejected'          │
                                                  └──────────────────────────────────────┘
```

---

## Seeding Sample Data

To populate sample users and realistic boarding listings into MongoDB:

From the `backend` folder:
```bash
npm run seed
```
Or directly with Node:
```bash
node database/seed/seed.js
```

This creates:
- **Owner Account:** `owner@boardease.lk` / `Owner123!`
- **Student Account:** `student@boardease.lk` / `Student123!`
- **8 Pre-configured properties** in Matara, Galle, Colombo, and Kandy. Repeated runs do not duplicate listings.
