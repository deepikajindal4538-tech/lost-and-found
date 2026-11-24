# 🎓 CampusKhoj — IIIT Allahabad Lost & Found Web Application

> *"Lost something? Let's help you find it."*

CampusKhoj is a modern, premium, full-stack Lost & Found web platform engineered specifically for the students, faculty, and campus community of the **Indian Institute of Information Technology, Allahabad (IIITA)**.

CampusKhoj helps students report misplaced belongings, upload photographs of found items, search using filters (campus buildings, categories, dates), and securely arrange handovers without publicly broadcasting personal phone numbers or private email addresses.

---

## 🌟 Key Features

- **🏛️ IIITA Campus Native**: Pre-configured with official campus locations (*CC3, Central Library, Academic Blocks, Hostels, Labs, Sports Complex, Mess, Auditorium*) and standard categories.
- **🔐 Secure Authentication**: JWT authentication with bcrypt-hashed passwords. Enforces official college email verification (`@iiita.ac.in`, configurable via `.env`).
- **🛡️ Privacy-First Claim Verification**: Finder and claimant communicate through an in-app verification flow. Claimants submit identifying features (scratches, lockscreen wallpaper, serial numbers); finder verifies before disclosing physical pickup details.
- **📸 Dual Image Handling**: Full **Cloudinary** integration for high-performance cloud media storage, with an automatic fallback to local disk storage if Cloudinary credentials are not configured.
- **⚡ Instant Zero-Config Database**: Natively connects to **MongoDB Atlas**, with automatic fallback to embedded in-memory MongoDB for local development.
- **📊 Real-Time Dynamic Statistics**: Tracks total items reported, recovery rate, active listings, and successfully returned belongings.
- **🛠️ Administrative Moderation Console**: Role-separated Admin dashboard (`role: 'admin'`) allowing moderators to delete inappropriate listings, resolve flagged student reports, and manage verified users.
- **🎨 Premium UI & Responsive Design**: Crafted with Tailwind CSS following modern SaaS dashboard design principles, subtle shadows, and soft muted blues (`#526D82`).

---

## 💻 Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, Vite, React Router 6, Axios, Lucide React, React Hot Toast |
| **Styling** | Tailwind CSS 3, Custom editorial color system, KaTeX ready |
| **Backend** | Node.js, Express.js (ES Modules), Multer, Morgan, CORS |
| **Database** | MongoDB Atlas via Mongoose (with MongoMemoryServer development fallback) |
| **Auth** | JSON Web Tokens (JWT), Bcrypt.js password hashing |
| **Cloud Storage** | Cloudinary & Multer Cloudinary Storage |

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- Node.js (v18+)
- npm (v9+)

### 2. Clone & Install Dependencies
From the project root:
```bash
npm run install:all
```
*(This installs root, backend server, and frontend client dependencies.)*

### 3. Environment Configuration
Copy the sample environment file:
```bash
cp .env.example .env
```
Edit `.env` to configure your MongoDB Atlas URI or Cloudinary keys (or leave them blank to use the built-in development fallback engines).

### 4. Run Development Servers
Start both backend (port 5050) and frontend (port 3000) concurrently:
```bash
npm start
```
- **Frontend URL**: [http://localhost:3000](http://localhost:3000)
- **Backend API URL**: [http://localhost:5050](http://localhost:5050)

---

## 🔑 Demo Credentials

CampusKhoj comes pre-seeded with realistic IIITA campus listings and accounts. You can also use the one-click demo login buttons directly on the Login page:

| Role | Email | Password | Roll Number | Notes |
|---|---|---|---|---|
| **Admin** | `admin@iiita.ac.in` | `Admin@123` | `ADM202401` | Full administrative & moderation access |
| **Student** | `rahul.sharma@iiita.ac.in` | `Student@123` | `IIT2023045` | Standard student account |
| **Student** | `priya.verma@iiita.ac.in` | `Student@123` | `IIT2023112` | Standard student account |

To re-seed sample data at any time:
```bash
npm run seed
```
Or trigger `POST http://localhost:5050/api/seed`.

---

## 📁 Project Architecture

```
lost and found - jecrc/
├── client/                      # React 18 + Vite frontend
│   ├── public/                  # Favicon & static assets
│   ├── src/
│   │   ├── components/          # Reusable UI components
│   │   │   ├── Navbar.jsx       # Responsive sticky navigation
│   │   │   ├── Footer.jsx       # Campus footer with IIITA details
│   │   │   ├── ItemCard.jsx     # Card component with status badges
│   │   │   ├── ItemCardSkeleton.jsx
│   │   │   ├── ClaimModal.jsx   # Ownership verification modal
│   │   │   ├── ReportListingModal.jsx
│   │   │   ├── EditItemModal.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx  # Authentication state & JWT storage
│   │   ├── pages/
│   │   │   ├── Home.jsx         # Hero, stats, recently found/lost
│   │   │   ├── LostItems.jsx    # Lost directory with multi-filters
│   │   │   ├── FoundItems.jsx   # Found directory with multi-filters
│   │   │   ├── ItemDetails.jsx  # High-res photo & claim/manage actions
│   │   │   ├── ReportItem.jsx   # Drag & drop photo upload form
│   │   │   ├── Dashboard.jsx    # Student dashboard (lost/found/claims)
│   │   │   ├── AdminDashboard.jsx # Admin console for moderation
│   │   │   ├── HowItWorks.jsx   # Campus guide & safe handover spots
│   │   │   ├── Login.jsx        # Sign in with 1-click demo helpers
│   │   │   └── Register.jsx     # IIITA @iiita.ac.in domain validation
│   │   ├── services/
│   │   │   └── api.js           # Axios instance with auth interceptors
│   │   ├── utils/
│   │   │   └── constants.js     # IIITA locations & categories
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── tailwind.config.js
│   └── vite.config.js
├── server/                      # Node.js + Express backend
│   ├── config/
│   │   ├── db.js                # MongoDB Atlas / Memory fallback
│   │   └── cloudinary.js        # Cloudinary media config
│   ├── controllers/
│   │   ├── authController.js    # Register, Login, Me, Profile
│   │   ├── itemController.js    # CRUD items, search, filter, stats
│   │   ├── claimController.js   # In-app claim verification
│   │   ├── reportController.js  # Dispute & spam reporting
│   │   └── adminController.js   # Moderation & user role management
│   ├── middleware/
│   │   ├── auth.js              # JWT protect & role authorize
│   │   ├── upload.js            # Multer + Cloudinary / disk fallback
│   │   └── errorHandler.js      # Global error & validation handling
│   ├── models/
│   │   ├── User.js              # Student & admin schema
│   │   ├── Item.js              # Lost/found item schema
│   │   ├── Claim.js             # Verification claim schema
│   │   └── Report.js            # Listing moderation schema
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── itemRoutes.js
│   │   ├── claimRoutes.js
│   │   ├── reportRoutes.js
│   │   └── adminRoutes.js
│   ├── utils/
│   │   └── seeder.js            # Initial realistic IIITA dataset
│   └── index.js                 # Express app bootstrapper
├── .env.example                 # Template for secrets
├── package.json                 # Monorepo orchestrator
└── README.md
```

---

## 📡 REST API Reference

### Authentication
- `POST /api/auth/register` — Register student (`@iiita.ac.in`)
- `POST /api/auth/login` — Sign in and receive JWT token
- `GET /api/auth/me` — Retrieve authenticated user profile
- `PUT /api/auth/profile` — Update student profile details

### Items
- `GET /api/items` — Query items with filters (`type`, `category`, `location`, `search`, `dateRange`, `sort`, `page`)
- `GET /api/items/summary` — Homepage overview stats and recent listings
- `GET /api/items/:id` — Full item details + related items
- `POST /api/items` — Create new lost/found report (multipart with photo)
- `PUT /api/items/:id` — Update listing or change status (owner/admin only)
- `DELETE /api/items/:id` — Delete listing (owner/admin only)
- `GET /api/items/user/me` — Get current student's lost, found, and returned items

### Claims (Ownership Verification)
- `POST /api/claims` — Submit ownership proof on a found item
- `GET /api/claims/my` — Get claims sent by the student
- `GET /api/claims/received` — Get claims received on items posted by student
- `PUT /api/claims/:id` — Accept or reject a claim (reveals handover note)

### Dispute Reports
- `POST /api/reports` — Flag a listing for administrative review
- `GET /api/reports` — View reports (Admin only)

### Admin Console
- `GET /api/admin/stats` — Platform recovery metrics & counts
- `GET /api/admin/items` — Administrative listing table
- `DELETE /api/admin/items/:id` — Remove inappropriate or fake post
- `GET /api/admin/reports` — View all flagged dispute reports
- `PUT /api/admin/reports/:id` — Mark report as resolved or dismissed
- `GET /api/admin/users` — View all registered campus students
- `PUT /api/admin/users/:id/role` — Promote or demote student/admin role

---

## 🏛️ Campus Locations & Categories

### Campus Hotspots
- Academic Blocks (AB-1, AB-2)
- Central Library (Ground & 2nd Floor)
- Computer Center 3 (CC3)
- Main Auditorium & OAT
- Hostels (Boys Hostels BH1–BH5, Girls Hostels)
- Mess & Dining Halls
- Sports Complex & Grounds
- Computer / Electronics Labs
- Other Campus Areas

### Item Categories
- Electronics *(Laptops, AirPods, Chargers, Calculators, Watches)*
- Accessories *(Sunglasses, Jewelry, Belts)*
- Books & Stationery *(Textbooks, Spiral Notes, Geometry Boxes)*
- Clothing *(Hoodies, Jackets, Caps)*
- ID Cards & Documents *(IIITA RFID IDs, Driving Licenses)*
- Keys *(Hostel Room Keys, Bike Keys)*
- Bags *(Backpacks, Laptop Sleeves)*
- Water Bottles *(Thermosteel Flasks)*
- Other

---

## 📜 License
Developed with care for the IIIT Allahabad campus community.
