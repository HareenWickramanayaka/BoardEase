# BoardEase — Student Boarding Accommodation Platform

[![MERN Stack](https://img.shields.io/badge/Stack-MERN-blue.svg)](https://mongodb.com)
[![React](https://img.shields.io/badge/Frontend-React%2018%20%7C%20Vite-61DAFB.svg)](https://react.dev)
[![Node.js](https://img.shields.io/badge/Backend-Node.js%20%7C%20Express-339933.svg)](https://nodejs.org)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB%20%7C%20Mongoose-47A248.svg)](https://www.mongodb.com)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](#license)

**BoardEase** is a modern, full-stack web application built on the **MERN stack** (MongoDB, Express.js, React, Node.js). It is specifically designed to help university students and interns find comfortable, secure, and affordable boarding accommodations across Sri Lanka, while providing property owners with a complete self-service dashboard to publish, manage, and monitor their rental listings and student inquiries.

---

## 📑 Table of Contents

- [Project Overview](#-project-overview)
- [Key Features](#-key-features)
  - [Student Features](#student-features)
  - [Property Owner Features](#property-owner-features)
  - [Authentication and Account Management](#authentication-and-account-management)
  - [Boarding Management (CRUD)](#boarding-management-crud)
  - [Search and Filtering](#search-and-filtering)
  - [Favourites and Bookings](#favourites-and-bookings)
- [Technologies Used](#-technologies-used)
  - [Frontend](#frontend)
  - [Backend](#backend)
  - [Database](#database)
  - [Authentication & Security](#authentication--security)
  - [Development Tools](#development-tools)
- [Project Structure](#-project-structure)
- [Database Architecture & Models](#-database-architecture--models)
- [REST API Reference](#-rest-api-reference)
- [Installation and Setup](#-installation-and-setup)
  - [Prerequisites](#prerequisites)
  - [Step 1: Clone the Repository](#step-1-clone-the-repository)
  - [Step 2: Backend Configuration & Setup](#step-2-backend-configuration--setup)
  - [Step 3: Frontend Configuration & Setup](#step-3-frontend-configuration--setup)
- [Environment Variables](#-environment-variables)
  - [Backend Environment Variables (`backend/.env`)](#backend-environment-variables-backendenv)
  - [Frontend Environment Variables (`frontend/.env`)](#frontend-environment-variables-frontendenv)
- [Database Setup & Seeding](#-database-setup--seeding)
  - [Option A: Local MongoDB Community Server](#option-a-local-mongodb-community-server)
  - [Option B: MongoDB Atlas (Cloud)](#option-b-mongodb-atlas-cloud)
  - [Running the Seed Script](#running-the-seed-script)
- [Screenshots](#-screenshots)
- [Future Improvements](#-future-improvements)
- [Project Information](#-project-information)
- [License](#-license)

---

## 🌟 Project Overview

Finding student accommodation near university hubs in Sri Lanka (such as Matara, Galle, Colombo, and Kandy) often involves outdated noticeboards, roadside posters, or informal word-of-mouth recommendations that lack vital information like clear rental prices, security deposit details, gender preferences, and amenities.

**BoardEase** bridges this gap by offering a centralized, transparent platform:
- **For Students:** Browse verified boarding options, filter spaces by location, budget, room type, and gender criteria, bookmark favourite homes, submit accommodation inquiries with preferred move-in dates, and contact owners directly via phone or WhatsApp.
- **For Property Owners:** Access a personal dashboard with real-time analytics to create, edit, and delete boarding listings, manage room capacity, and review incoming student stay requests with one-click acceptance or rejection.

---

## ⚡ Key Features

### Student Features
- **Interactive Landing & Discovery:** Explore featured spaces and quick-search by city directly from the homepage.
- **Comprehensive Explore Catalog (`/explore`):** Browse listings with dynamic filtering by city, room type, gender preference, and maximum monthly rent.
- **Detailed Property View (`/boarding/:id`):** Protected access for logged-in users to review complete property specifications, descriptions, security deposits, and amenity checklists.
- **Interactive Photo Gallery:** Multi-image gallery with previous/next carousel navigation and thumbnail selectors.
- **Direct Owner Communication:** One-tap phone calling (`tel:`) and instant WhatsApp chat initiation (`https://wa.me/`) with pre-populated property context.
- **Accommodation Request System:** Submit structured stay requests with a chosen move-in date and inquiry note.
- **Request Tracking Portal (`/requests`):** Track application statuses (`Pending`, `Accepted`, `Rejected`) in real time, with immediate contact options once accepted.
- **Saved Homes / Wishlist (`/favorites`):** Save favourite listings to the student's personal account, persisted securely in MongoDB.
- **Light & Dark Theme Toggle:** Switch between light and dark modes at any time; preference is saved to browser storage.

### Property Owner Features
- **Owner Analytics Dashboard (`/dashboard`):** Real-time summary cards displaying Total Listed Properties, Total Available Spots, and Active Inquiries.
- **Listing Management:** Dedicated "Properties" tab to view all owned listings with direct links to view, edit, or delete.
- **Safe Property Deletion:** Confirmation modal prevents accidental deletion of listings from the database.
- **Accommodation Inquiries Management:** Dedicated "Requests" tab to review incoming student applications across properties, inspect applicant details, read messages, and **Accept** or **Reject** inquiries.
- **Listing Creation Form (`/dashboard/new`):** Add properties with comprehensive validation, amenities checklists, and flexible photo management.
- **Multiple Photo Options:** Upload local image files (converted to Base64 data URIs), enter custom image URLs, or select from curated room presets.
- **Listing Update Form (`/dashboard/edit/:id`):** Pre-populated edit interface with strict backend ownership verification.

### Authentication and Account Management
- **Role-Based Registration (`/register`):** Register as either a `student` or a boarding `owner`.
- **Secure Sign-In (`/login`):** Authenticate with email and password, issuing a stateless JSON Web Token (JWT).
- **Session Management:** Automatic session storage in client `localStorage` with automatic logout on token expiry.
- **Protected Routes:** Route protection on both client (`Protected.jsx`) and backend (`authenticate` & `ownerOnly` middleware).
- **Profile Customization (`/settings`):** Update display name and email address with uniqueness validation.
- **Password Security:** Update account password with current-password verification and bcrypt re-hashing.

### Boarding Management (CRUD)
- **Create (`POST /api/boardings`):** Owners publish listings with validation (minimum rent LKR 1,000, description >= 20 characters, title >= 5 characters, valid phone format).
- **Read (`GET /api/boardings` & `GET /api/boardings/:id`):** Public search/filter catalog with contact information hidden until authenticated users view details. Owners view their own listings via `GET /api/boardings/mine`.
- **Update (`PUT /api/boardings/:id`):** Owners update listing details, verified against `item.owner.toString() === req.user.id`.
- **Delete (`DELETE /api/boardings/:id`):** Owners delete listings with strict ownership checks.

### Search and Filtering
- **Keyword & Location Search:** Case-insensitive search across property title, city, and location fields.
- **Room Type Filter:** Filter by Single Room, Shared Room, Annex, or Studio.
- **Gender Preference Filter:** Filter by Any, Male, or Female.
- **Budget Range Filter:** Set a dynamic maximum monthly rent ceiling.
- **Sorting Options:** Sort results by Newest First, Price: Low to High, or Price: High to Low.
- **MongoDB Text Index:** Compound text indexing on `{ title: 'text', city: 'text', location: 'text', description: 'text' }`.

### Favourites and Bookings
- **MongoDB-Backed Favourites (`/api/favorites`):** Student shortlists are stored in MongoDB under the `User.favorites` array rather than temporary browser storage.
- **Duplicate Request Prevention:** Backend prevents students from submitting multiple pending requests for the same property.
- **Status Workflow:** Real-time inquiry state machine (`pending` ➔ `accepted` / `rejected`).

---

## 🛠️ Technologies Used

### Frontend
- **React (`^18.3.1`)**: Component-based UI library.
- **ReactDOM (`^18.3.1`)**: React package for DOM rendering.
- **Vite (`^6.0.5`)**: High-performance frontend build tool and development server.
- **@vitejs/plugin-react (`^4.3.4`)**: Fast Refresh and JSX transformation support.
- **React Router DOM (`^7.1.1`)**: Declarative client-side routing and protected navigation.
- **Lucide React (`^0.468.0`)**: Modern, consistent icon library.
- **Vanilla CSS3**: Design token system, responsive CSS grid/flexbox layouts, and CSS variable-driven light/dark themes.

### Backend
- **Node.js (`>= 18.x`)**: Asynchronous JavaScript runtime environment.
- **Express.js (`^4.21.2`)**: RESTful web API framework.
- **CORS (`^2.8.5`)**: Cross-Origin Resource Sharing middleware.
- **Dotenv (`^16.4.5`)**: Zero-dependency environment variable loader.

### Database
- **MongoDB**: Document-oriented NoSQL database.
- **Mongoose (`^8.9.5`)**: Object Data Modeling (ODM) library for schema validation, references, and compound text indexing.

### Authentication & Security
- **JSON Web Tokens (`jsonwebtoken ^9.0.2`)**: Signed bearer tokens for stateless authorization.
- **bcryptjs (`^2.4.3`)**: One-way salted password hashing (10 salt rounds).
- **Role-Based Access Control (RBAC)**: Route middleware differentiating students and property owners.
- **Sanitized Search Inputs**: Regex character escaping to prevent query injection attacks.

### Development Tools
- **Node.js Watch Mode (`node --watch`)**: Native backend hot reloading.
- **Vite Hot Module Replacement (HMR)**: Instant frontend feedback during development.
- **npm**: Package and script management.

---

## 📂 Project Structure

The project is organized into three decoupled tiers:

```text
BoardEase/
├── frontend/                                   # Client-side React application (Vite)
│   ├── dist/                                   # Production build output
│   ├── public/                                 # Static public assets
│   ├── src/
│   │   ├── components/                         # Reusable UI components
│   │   │   ├── Brand.jsx                       # Application branding & logo
│   │   │   ├── Card.jsx                        # Single property card
│   │   │   ├── Cards.jsx                       # Responsive card grid container
│   │   │   ├── Empty.jsx                       # Empty-state placeholder view
│   │   │   ├── ErrorBoundary.jsx               # React runtime error boundary
│   │   │   ├── Footer.jsx                      # Universal page footer
│   │   │   ├── Loading.jsx                     # Animated loading spinner
│   │   │   ├── Nav.jsx                         # Navigation bar with role links & theme switch
│   │   │   ├── Pill.jsx                        # Category & status badge pill
│   │   │   └── Protected.jsx                   # Route authentication guard
│   │   ├── data/
│   │   │   └── constants.js                    # Curated room images, amenities & room types
│   │   ├── pages/                              # Main routed application views
│   │   │   ├── About.jsx                       # "How It Works" guide
│   │   │   ├── Auth.jsx                        # User login & registration view
│   │   │   ├── BoardingForm.jsx                # Create & edit boarding property form
│   │   │   ├── Dashboard.jsx                   # Owner portal: properties, stats & requests
│   │   │   ├── Details.jsx                     # Single property view & request modal
│   │   │   ├── Explore.jsx                     # Browse catalogue with multi-filter & sorting
│   │   │   ├── Favorites.jsx                   # Saved properties shortlist for students
│   │   │   ├── Home.jsx                        # Landing page with hero search & featured cards
│   │   │   ├── SettingsPage.jsx                # Profile updates, password change & theme switch
│   │   │   └── StudentRequests.jsx             # Student view for tracking accommodation requests
│   │   ├── services/
│   │   │   └── api.js                          # Fetch wrapper with JWT headers & error handling
│   │   ├── utils/
│   │   │   └── formatters.js                   # Currency formatting utilities (LKR)
│   │   ├── App.jsx                             # Root React component, routing & global state
│   │   ├── main.jsx                            # React application entry point
│   │   └── style.css                           # Complete responsive stylesheet & design system
│   ├── .env.example                            # Client environment variables template
│   ├── index.html                              # HTML document shell
│   ├── package.json                            # Frontend npm scripts and dependencies
│   ├── package-lock.json                       # Frontend locked dependency tree
│   └── vite.config.js                          # Vite configuration with React plugin
│
├── backend/                                    # Server-side REST API (Node.js & Express)
│   ├── config/
│   │   └── db.js                               # Database connection module using Mongoose
│   ├── controllers/                            # Controller business logic
│   │   ├── authController.js                   # Registration, login, profile & password change
│   │   ├── boardingController.js               # Boarding CRUD, text search & filters
│   │   ├── favoriteController.js               # MongoDB-backed student favourites management
│   │   └── requestController.js                # Booking request submission & status updates
│   ├── middleware/
│   │   └── auth.js                             # authenticate & ownerOnly route guards
│   ├── routes/                                 # Express route definitions
│   │   ├── auth.js                             # /api/auth endpoints
│   │   ├── boardings.js                        # /api/boardings endpoints
│   │   ├── favorites.js                        # /api/favorites endpoints
│   │   └── requests.js                         # /api/requests endpoints
│   ├── scripts/
│   │   └── seed.js                             # Database seeding execution script
│   ├── .env.example                            # Backend environment variables template
│   ├── package.json                            # Backend npm scripts and dependencies
│   ├── package-lock.json                       # Backend locked dependency tree
│   └── server.js                               # Express server entry point & middleware mounting
│
├── database/                                   # Database layer: models, schemas & seed data
│   ├── models/                                 # Mongoose Schemas & Models
│   │   ├── mongoose.js                         # Shared Mongoose instance resolver
│   │   ├── Boarding.js                         # Boarding property listing schema with text index
│   │   ├── BookingRequest.js                   # Student accommodation booking request schema
│   │   ├── User.js                             # User account schema with hashed passwords
│   │   └── index.js                            # Unified export for all models
│   ├── seed/
│   │   └── seed.js                             # Database seeder with sample properties & users
│   └── README.md                               # Schema documentation, ERD & seeding guide
│
├── .gitignore                                  # Git ignore rules for node_modules, .env, build, etc.
└── README.md                                   # Primary project documentation
```

---

## 🗄️ Database Architecture & Models

The database models are located in `database/models/`:

```text
┌───────────────────────────────────────┐
│                 USER                  │
├───────────────────────────────────────┤
│ _id           : ObjectId (PK)         │
│ name          : String                │
│ email         : String (unique)       │
│ password      : String (bcrypt hash)  │
│ role          : 'student' | 'owner'   │
│ favorites     : [ObjectId -> Boarding]│
│ createdAt     : Date                  │
│ updatedAt     : Date                  │
└──────────────────┬────────────────────┘
                   │
                   │ 1:N (Owner creates listings)
                   ▼
┌───────────────────────────────────────┐           ┌───────────────────────────────────────┐
│               BOARDING                │           │            BOOKING REQUEST            │
├───────────────────────────────────────┤           ├───────────────────────────────────────┤
│ _id           : ObjectId (PK)         │           │ _id           : ObjectId (PK)         │
│ owner         : ObjectId -> User (FK) │◄──────────┤ boarding      : ObjectId -> Boarding  │
│ title         : String (5-100 chars)  │   1:N     │ student       : ObjectId -> User (FK) │
│ city          : String                │           │ owner         : ObjectId -> User (FK) │
│ location      : String                │           │ moveInDate    : Date                  │
│ description   : String (min 20 chars) │           │ message       : String (5-500 chars)  │
│ price         : Number (Rent/mo, >=1k)│           │ status        : 'pending' | 'accepted'│
│ deposit       : Number                │           │                 | 'rejected'          │
│ type          : Enum (Room types)     │           │ createdAt     : Date                  │
│ gender        : Enum ('Any'|'M'|'F')  │           │ updatedAt     : Date                  │
│ beds          : Number (1-20)         │           └───────────────────────────────────────┘
│ baths         : Number (1-10)         │
│ availableSpots: Number (>=0)          │
│ amenities     : [String]              │
│ image         : String (Primary)      │
│ images        : [String] (Gallery)    │
│ phone         : String                │
│ featured      : Boolean               │
│ createdAt     : Date                  │
│ updatedAt     : Date                  │
└───────────────────────────────────────┘
```

---

## 🔗 REST API Reference

All backend API routes are prefixed with `/api`. Protected routes require a valid JWT passed in the `Authorization: Bearer <token>` header.

### System
| Method | Route | Access | Description |
|---|---|---|---|
| `GET` | `/api/health` | Public | Returns `{ status: 'ok', database: 'connected' }` |

### Authentication & Profile (`/api/auth`)
| Method | Route | Access | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | Public | Register a new user (`name`, `email`, `password`, `role`). Returns JWT token and user |
| `POST` | `/api/auth/login` | Public | Authenticate user with credentials. Returns JWT token and user |
| `GET` | `/api/auth/me` | Authenticated | Fetch current logged-in user details |
| `PUT` | `/api/auth/profile` | Authenticated | Update user display name and email address |
| `PUT` | `/api/auth/password` | Authenticated | Change user password after checking current password |

### Boarding Listings (`/api/boardings`)
| Method | Route | Access | Description |
|---|---|---|---|
| `GET` | `/api/boardings` | Public | List, search, filter, and sort properties (hides contact info) |
| `GET` | `/api/boardings/:id` | Authenticated | View complete property details with owner info and phone |
| `GET` | `/api/boardings/mine` | Owner Only | Retrieve all listings owned by the authenticated owner |
| `POST` | `/api/boardings` | Owner Only | Create a new property listing |
| `PUT` | `/api/boardings/:id` | Owner Only | Update an existing property owned by the requester |
| `DELETE`| `/api/boardings/:id` | Owner Only | Delete a property owned by the requester |

### Favourites (`/api/favorites`)
| Method | Route | Access | Description |
|---|---|---|---|
| `GET` | `/api/favorites` | Student Only | Get array of favorited boarding IDs for the student |
| `POST` | `/api/favorites/:id` | Student Only | Toggle (add/remove) a boarding from the student's favorites |

### Accommodation Requests (`/api/requests`)
| Method | Route | Access | Description |
|---|---|---|---|
| `POST` | `/api/requests` | Student Only | Submit an accommodation request (`boardingId`, `message`, `moveInDate`) |
| `GET` | `/api/requests/student` | Student Only | Get all accommodation requests submitted by the logged-in student |
| `GET` | `/api/requests/owner` | Owner Only | Get all accommodation requests received for the owner's listings |
| `PATCH`| `/api/requests/:id/status`| Owner Only | Update request status to `'accepted'` or `'rejected'` |

---

## 🚀 Installation and Setup

### Prerequisites

Ensure you have the following installed on your machine:
- **Node.js** (version `18.x` or `20.x` or newer) — [Download](https://nodejs.org/)
- **npm** (version `9.x` or `10.x` or newer)
- **MongoDB** (Local Community Server running on port `27017` or a MongoDB Atlas URI) — [Download](https://www.mongodb.com/try/download/community)
- **Git** (for version control) — [Download](https://git-scm.com/)

---

### Step 1: Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/BoardEase.git
cd BoardEase
```

---

### Step 2: Backend Configuration & Setup

1. Open a terminal and navigate to the `backend` folder:
   ```bash
   cd backend
   ```

2. Install backend dependencies:
   ```bash
   npm install
   ```

3. Create your `.env` configuration file from the template:
   - **Windows PowerShell:**
     ```powershell
     Copy-Item .env.example .env
     ```
   - **Windows Command Prompt:**
     ```cmd
     copy .env.example .env
     ```
   - **macOS / Linux:**
     ```bash
     cp .env.example .env
     ```

4. Open `backend/.env` and ensure `MONGO_URI` and `JWT_SECRET` are configured.

5. **Seed the database** with sample data (2 demo accounts and 8 realistic boarding listings):
   ```bash
   npm run seed
   ```

6. Start the backend development server:
   ```bash
   npm run dev
   ```
   *The backend will start on **`http://localhost:5000`** with auto-reload enabled (`node --watch`).*

---

### Step 3: Frontend Configuration & Setup

1. Open a **second terminal window** and navigate to the `frontend` folder:
   ```bash
   cd frontend
   ```

2. Install frontend dependencies:
   ```bash
   npm install
   ```

3. *(Optional)* Create your `.env` file if your backend runs on a non-default URL:
   - **Windows PowerShell:**
     ```powershell
     Copy-Item .env.example .env
     ```
   - **Windows Command Prompt:**
     ```cmd
     copy .env.example .env
     ```
   - **macOS / Linux:**
     ```bash
     cp .env.example .env
     ```

4. Start the frontend development server:
   ```bash
   npm run dev
   ```
   *The client will start on **`http://localhost:5173`**.*

5. Open your web browser and navigate to **`http://localhost:5173`**.

---

## 🔐 Environment Variables

Environment variables must be configured properly for the application to function.

> [!CAUTION]
> **Security Notice:** Never commit `.env` files to version control or upload them to GitHub. The repository includes `.gitignore` rules to prevent secret files from being tracked. Always use `.env.example` as a template.

### Backend Environment Variables (`backend/.env`)

| Variable Name | Required | Default Value | Description |
|---|---|---|---|
| `PORT` | Optional | `5000` | Port for the Express server |
| `MONGO_URI` | **Required** | `mongodb://127.0.0.1:27017/boardease` | MongoDB connection string (Local or Atlas) |
| `JWT_SECRET` | **Required** | — | High-entropy secret key for signing JWT auth tokens |
| `CLIENT_URL` | Optional | `http://localhost:5173` | Frontend URL allowed by CORS |

#### Example `backend/.env`:
```ini
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/boardease
JWT_SECRET=your_super_secret_jwt_key_at_least_32_characters_long
CLIENT_URL=http://localhost:5173
```

### Frontend Environment Variables (`frontend/.env`)

| Variable Name | Required | Default Value | Description |
|---|---|---|---|
| `VITE_API_URL` | Optional | `http://localhost:5000/api` | Base URL of the backend REST API |

#### Example `frontend/.env`:
```ini
VITE_API_URL=http://localhost:5000/api
```

---

## 💾 Database Setup & Seeding

### Option A: Local MongoDB Community Server

1. Install MongoDB Community Server on your machine.
2. Ensure the MongoDB service is running:
   - **Windows Services:** Check that `MongoDB Server (MongoDB)` is **Running** in `services.msc`.
   - **PowerShell (Admin):**
     ```powershell
     Get-Service -Name MongoDB
     # If stopped:
     Start-Service -Name MongoDB
     ```
3. Set `MONGO_URI` in `backend/.env`:
   ```ini
   MONGO_URI=mongodb://127.0.0.1:27017/boardease
   ```

### Option B: MongoDB Atlas (Cloud)

1. Create a free cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Create a Database User with read and write permissions under **Database Access**.
3. Allow network access under **Network Access** by adding your current IP or `0.0.0.0/0` (allow from anywhere).
4. Copy the connection string and set it in `backend/.env`:
   ```ini
   MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/boardease?retryWrites=true&w=majority
   ```

### Running the Seed Script

To populate the database with initial demonstration accounts and listings:

From the `backend/` folder:
```bash
npm run seed
```
Or directly from the project root:
```bash
node database/seed/seed.js
```

#### Pre-configured Seed Credentials:
| Account Type | Email | Password | Role Permissions |
|---|---|---|---|
| **Property Owner** | `owner@boardease.lk` | `Owner123!` | Access to `/dashboard`, manage listings, accept/reject requests |
| **Student** | `student@boardease.lk` | `Student123!` | Explore, save favourites, submit accommodation requests |

---

## 📷 Screenshots

*Add screenshots of your running application to a `screenshots/` directory in the repository.*

### 1. Landing Page & Hero Search
<!-- Replace with actual screenshot path: ![Landing Page](screenshots/landing_page.png) -->
> _Homepage with hero search bar, quick filter pills, and featured boarding accommodations._

### 2. Explore & Filtering Catalog
<!-- Replace with actual screenshot path: ![Explore Page](screenshots/explore_page.png) -->
> _Explore catalog showing multi-criteria filters (city, room type, gender, max price) and sorting options._

### 3. Detailed Property View & Image Gallery
<!-- Replace with actual screenshot path: ![Property Details](screenshots/property_details.png) -->
> _Detailed listing view with multi-image gallery, full description, amenities, and direct contact buttons._

### 4. Owner Dashboard & Property Management
<!-- Replace with actual screenshot path: ![Owner Dashboard](screenshots/owner_dashboard.png) -->
> _Owner portal showing capacity statistics, listed properties, and student request management._

### 5. Accommodation Requests Portal
<!-- Replace with actual screenshot path: ![Student Requests](screenshots/student_requests.png) -->
> _Student request tracking portal showing live status badges (Pending / Accepted / Rejected)._

### 6. Light and Dark Theme Support
<!-- Replace with actual screenshot path: ![Dark Mode](screenshots/dark_mode.png) -->
> _Full theme switching support across all views with persistent browser storage._

---

## 🔮 Future Improvements

The following features are planned for future iterations of BoardEase:

- **Integrated Online Payments:** Support for online advance deposit and rent payments via payment gateways (e.g., Stripe, PayHere).
- **Interactive Map Integration:** Visual map view (Google Maps / Leaflet) showing property proximity to universities, bus routes, and train stations.
- **In-App Messaging System:** Direct real-time chat between students and landlords with messaging history.
- **Cloud Media Storage:** Direct image uploads to cloud storage providers (Cloudinary / AWS S3) for optimized image delivery.
- **Reviews & Ratings:** Community review and rating system allowing verified student tenants to leave feedback.
- **Automated Notifications:** Email and SMS notifications for booking request updates, new listings, and status changes.

---

## ℹ️ Project Information

- **Project Name:** BoardEase
- **Project Type:** MERN Stack Web Application
- **Project Purpose:** Student Boarding Accommodation Platform
- **Repository:** BoardEase

---

## 📄 License

This project is licensed under the **MIT License**. Feel free to use, modify, and distribute this software for personal and educational purposes.
