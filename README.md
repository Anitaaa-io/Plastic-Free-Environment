# 🌿 PLASTIC-FREE ENVIRONMENT – Community Sustainability Platform

An enterprise-grade, production-style Full-Stack Web Application engineered for the B.Tech Community Service Project (CSP) in Narasaraopet Mandal & Lingamguntla Agraharam, Andhra Pradesh.

---

## 🏛️ Academic & Community Service Project Overview

- **Project Title:** Plastic Free Environment
- **Platform Name:** PLASTIC-FREE ENVIRONMENT – Community Sustainability Platform
- **Program:** Bachelor of Technology (B.Tech) Community Service Project
- **Department:** Department of Computer Science & Engineering (Data Science) [CSE (DS)]
- **Field Study Center:** Lingamguntla Agraharam (Rural) & ZPH School (PIN: 522601)
- **Region:** Narasaraopet, Palnadu District, Andhra Pradesh
- **GPS Verified Field Work Date:** 29 June 2026

### 👥 Student Research Team (Submitted By)
1. **B. Bhavya Sai Sri** — Roll No: `24471A4402`
2. **M. Aparna** — Roll No: `24471A4425`
3. **N. Esther Rani** — Roll No: `24471A4435`
4. **T. Anitha** — Roll No: `24471A4461`

### 🎓 Under Faculty Guidance
1. **Mr. P. Srinivasarao** — Faculty Guide, Dept. of CSE (DS)
2. **Mr. P. Solman** — Faculty Guide, Dept. of CSE (DS)
3. **Mr. N. Siva Rama Krishna** — Faculty Guide, Dept. of CSE (DS)
4. **Mr. B. Veera Brahmam** — Faculty Guide, Dept. of CSE (DS)

---

## 🚀 Key Features & Modules

### 1. Public Awareness & Educational Portal
- **Home:** Interactive hero banner, verified live impact metrics from database, project origin spotlight.
- **About Project:** 5-stage methodology (Identify, Plan, Visit, Engage & Collect, Analyse), verified team and guide credentials.
- **Plastic Pollution Science:** Persistence timeline (20 to 500+ years), degradation breakdown, chemical hazards (BPA, phthalates), interactive personal plastic footprint calculator.
- **Eco-Friendly Alternatives:** Catalog of sustainable swaps (jute totes, stainless steel/copper flasks, areca palm plates, bamboo straws) with 6-step lifestyle guide.
- **Awareness & Tips:** The 5 R’s hierarchy (Refuse, Reduce, Reuse, Repurpose, Recycle) and an interactive 30-Day Plastic-Free Challenge.
- **Contact:** Citizen feedback form and study area coordinates.

### 2. User Authentication & Role-Based Permissions
- JWT authentication (`djangorestframework-simplejwt`) with auto token refresh and local persistence.
- Secure password hashing using PBKDF2/Argon2.
- Roles: `Normal User` and `Administrator`.
- Protected routes on the React frontend and permissions on Django REST Framework endpoints.

### 3. Citizen Plastic-Free Pledge & Digital Certificates
- Interactive pledge form allowing users to select multiple commitments (carrying cloth bags, refusing plastic straws, segregating waste).
- Automatic generation of an official **Digital Certificate of Environmental Commitment** with unique pledge ID, verified seal badge, recipient's name, and print/download capabilities.
- Live public pledge feed displaying community members from Narasaraopet and surrounding villages.

### 4. Crowdsourced Plastic Waste Reporting
- Citizen reporting of illegal dump yards, choked water canals, roadside trash, and open burning.
- Image evidence upload (up to 5MB with format validation).
- GPS device coordinate locator or landmark address input.
- Real-time status tracker (`pending`, `under_review`, `in_progress`, `resolved`, `dismissed`).

### 5. Community Cleanup Event Management & Volunteer Enrollment
- Directory of scheduled and completed community cleanups in Lingamguntla Agraharam & Narasaraopet.
- Interactive volunteer registration modal with real-time capacity progress bar (`registered_count / target_volunteers`).
- Tracks kilograms of plastic waste cleared from the environment.

### 6. Personal Eco Activity Tracker & Leaderboard
- Log daily sustainable actions (avoiding plastic bottles, carrying reusable bags, recycling, attending cleanups).
- Automatic calculation of plastic weight diverted (grams/kg) and points rewarded.
- Real-time community leaderboard ranking top environmental champions.

### 7. Administrative Command Center (Protected Dashboard)
- Interactive **Recharts** visualizations:
  - Waste Reports by Category (Bar Chart)
  - Resolution Status Breakdown (Donut/Pie Chart)
  - Community Engagement Trends (Monthly Line Chart)
  - Plastic Diverted by Activity (Bar Chart)
- Management Panels:
  - **Waste Reports Manager:** Update incident status with official resolution notes.
  - **Pledges Manager:** Complete register of citizen pledges.
  - **Events Manager:** Schedule new cleanup drives.
  - **Inquiry Manager:** View citizen messages and feedback.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, Vite, Tailwind CSS, React Router v6, Axios, Recharts, Lucide React |
| **Backend** | Python 3.14 / Django 6.0, Django REST Framework (DRF), SimpleJWT |
| **Database** | PostgreSQL (Production) / SQLite (Development Fallback) |
| **Security** | JWT Authentication, CORS policy, Input validation, Image size/type checks |

---

## 📂 Project Structure

```
CSP/
├── backend/
│   ├── api/
│   │   ├── management/commands/
│   │   │   └── seed_data.py          # Seed data script
│   │   ├── migrations/               # Database migrations
│   │   ├── models.py                 # Django ORM models
│   │   ├── serializers.py            # DRF serializers
│   │   ├── views.py                  # API endpoints and analytics
│   │   ├── urls.py                   # App routing
│   │   ├── permissions.py            # Role-based permissions
│   │   ├── admin.py                  # Django admin configuration
│   │   └── signals.py                # Auto-profile creation signals
│   ├── backend/
│   │   ├── settings.py               # Django configuration & DB setup
│   │   ├── urls.py                   # Master URL routing
│   │   └── wsgi.py
│   ├── media/                        # User-uploaded images & assets
│   ├── requirements.txt              # Python dependencies
│   ├── .env.example                  # Environment variable template
│   └── manage.py
├── frontend/
│   ├── public/
│   │   └── images/                   # Verified field photographs
│   ├── src/
│   │   ├── components/               # Navbar, Footer, ProtectedRoute
│   │   ├── context/                  # AuthContext (JWT state)
│   │   ├── pages/                    # 12 complete full-stack pages
│   │   ├── services/                 # Axios API service layer
│   │   ├── App.jsx                   # Router and layout configuration
│   │   ├── main.jsx                  # React DOM entry point
│   │   └── index.css                 # Tailwind CSS & design system
│   ├── package.json                  # NPM dependencies
│   ├── tailwind.config.js            # Custom forest/emerald palette
│   └── vite.config.js                # Vite build & proxy settings
└── README.md
```

---

## ⚡ Quick Start & Local Execution

### 1. Prerequisites
- **Python 3.10+** (Python 3.14 verified)
- **Node.js 18+** (Node.js v24 verified) & **npm**
- **Git** (optional)
- **PostgreSQL** (optional; SQLite works out-of-the-box)

---

### 2. Backend Setup & Run

Open a terminal in the project directory:

```bash
# 1. Navigate to backend directory
cd backend

# 2. (Optional) Create and activate virtual environment
python -m venv venv
# On Windows:
venv\Scripts\activate
# On Linux/macOS:
source venv/bin/activate

# 3. Install dependencies
pip install -r requirements.txt

# 4. Copy environment configuration
cp .env.example .env

# 5. Apply migrations
python manage.py makemigrations api
python manage.py migrate

# 6. Seed initial verified project data (users, pledges, events, reports)
python manage.py seed_data

# 7. Start the Django API server
python manage.py runserver 8000
```

The Django REST API will be running at: `http://127.0.0.1:8000/api/`  
The Django Admin panel will be running at: `http://127.0.0.1:8000/admin/`

---

### 3. Frontend Setup & Run

Open a **separate** terminal window:

```bash
# 1. Navigate to frontend directory
cd frontend

# 2. Install NPM packages
npm install

# 3. Start the Vite React development server
npm run dev
```

The React frontend will be running at: `http://localhost:3000` (or `http://localhost:5173`)

---

## 🗄️ PostgreSQL Database Configuration (Optional)

To switch from the default development SQLite database to a production PostgreSQL database:

1. Create a database in your PostgreSQL instance:
   ```sql
   CREATE DATABASE plastic_free_db;
   ```
2. Edit `backend/.env`:
   ```env
   DB_ENGINE=postgresql
   DB_NAME=plastic_free_db
   DB_USER=postgres
   DB_PASSWORD=your_password
   DB_HOST=localhost
   DB_PORT=5432
   ```
3. Run migrations and seed data:
   ```bash
   python manage.py migrate
   python manage.py seed_data
   ```

---

## 🔑 Demo Evaluation Accounts

| Role | Username | Password | Purpose |
|---|---|---|---|
| **Administrator** | `admin` | `admin123` | Full access to Admin Panel (`/admin-dashboard`), analytics, and status updates |
| **Normal User** | `user` | `user123` | Citizen dashboard (`/eco-tracker`), daily logging, pledges |
| **Student Lead** | `bhavya_sri` | `user123` | B.Tech CSE (DS) student researcher profile & pledges |
| **Teacher Member** | `priya_teacher` | `user123` | ZPH School Lingamguntla Agraharam eco-champion profile |
| **Rural Resident** | `ramesh_farmer` | `user123` | Village community activist profile |


*(You can also register any new account directly via the Register page.)*

---

## 🌐 Complete REST API Endpoint Reference

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/auth/register/` | Register new user account | No |
| `POST` | `/api/auth/login/` | Obtain JWT access and refresh tokens | No |
| `POST` | `/api/auth/refresh/` | Refresh JWT access token | No |
| `GET` | `/api/auth/profile/` | Fetch current user profile & points | Yes (JWT) |
| `PATCH` | `/api/auth/profile/` | Update profile information | Yes (JWT) |
| `GET` | `/api/public/overview/` | Homepage metrics and featured data | No |
| `GET` | `/api/pledges/` | List all verified public pledges | No |
| `POST` | `/api/pledges/` | Submit a new plastic-free pledge | No (or JWT) |
| `GET` | `/api/pledges/my-pledges/` | User's personal submitted pledges | Yes (JWT) |
| `GET` | `/api/waste-reports/` | List reported waste incidents | No |
| `POST` | `/api/waste-reports/` | Submit new waste incident with photo | No (or JWT) |
| `GET` | `/api/waste-reports/my-reports/` | User's submitted waste reports | Yes (JWT) |
| `PATCH` | `/api/waste-reports/<id>/status/` | Update incident cleanup status | Yes (Admin) |
| `GET` | `/api/cleanup-events/` | List scheduled cleanup events | No |
| `POST` | `/api/cleanup-events/` | Create a new cleanup event | Yes (Admin) |
| `POST` | `/api/cleanup-events/<id>/volunteer/` | Register as a volunteer | No (or JWT) |
| `GET` | `/api/cleanup-events/my-volunteering/` | User's enrolled cleanups | Yes (JWT) |
| `GET` | `/api/campaigns/` | List environmental campaigns | No |
| `GET` | `/api/eco-activities/` | User's personal eco activity log | Yes (JWT) |
| `POST` | `/api/eco-activities/` | Record sustainable habit & earn points | Yes (JWT) |
| `GET` | `/api/eco-activities/leaderboard/` | Community eco champions leaderboard | No |
| `POST` | `/api/contact/` | Submit citizen contact message | No |
| `GET` | `/api/admin/analytics/` | Comprehensive admin metrics & charts | Yes (Admin) |

---

## 📷 Photographic & Empirical Proof

All field photographs displayed across the platform were captured on-site during the B.Tech Community Service Project visit to **ZPH School, Lingamguntla Agraharam, Narasaraopet Mandal on 29 June 2026**.

---

## 📜 Academic Declaration

This application and accompanying research documentation have been developed as part of the mandatory **Community Service Project (CSP)** curriculum in partial fulfillment of the requirements for the award of the degree of **Bachelor of Technology in Computer Science & Engineering (Data Science)**.

