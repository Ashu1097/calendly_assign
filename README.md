# Calendly Clone

A full-stack scheduling/booking web application that replicates Calendly's design and user experience.

---

## Tech Stack

| Layer      | Technology                              |
|------------|-----------------------------------------|
| Frontend   | React 18 + TypeScript + Vite + Tailwind CSS |
| Backend    | Node.js + Express + TypeScript          |
| Database   | PostgreSQL                              |
| HTTP Client| Axios                                   |
| Date Utils | date-fns                                |

---

## Project Structure

```
calendly-clone/
├── database/
│   ├── schema.sql          # PostgreSQL schema
│   └── seed.sql            # Sample data
│
├── backend/
│   ├── src/
│   │   ├── index.ts                # Express app entry
│   │   ├── db/pool.ts              # PostgreSQL connection pool
│   │   ├── routes/
│   │   │   ├── eventTypes.ts
│   │   │   ├── availability.ts
│   │   │   ├── booking.ts
│   │   │   ├── meetings.ts
│   │   │   └── users.ts
│   │   └── controllers/
│   │       ├── eventTypesController.ts
│   │       ├── availabilityController.ts
│   │       ├── bookingController.ts
│   │       ├── meetingsController.ts
│   │       └── usersController.ts
│   ├── package.json
│   └── tsconfig.json
│
└── frontend/
    ├── src/
    │   ├── App.tsx                 # Router
    │   ├── main.tsx                # Entry point
    │   ├── index.css               # Tailwind + global styles
    │   ├── api/index.ts            # Axios API layer
    │   ├── types/index.ts          # Shared TypeScript types
    │   ├── utils/index.ts          # Helper functions
    │   ├── pages/
    │   │   ├── EventTypesPage.tsx
    │   │   ├── AvailabilityPage.tsx
    │   │   ├── MeetingsPage.tsx
    │   │   ├── BookingPage.tsx      # Public
    │   │   └── ConfirmationPage.tsx # Public
    │   └── components/
    │       ├── layout/
    │       │   ├── AppLayout.tsx
    │       │   ├── PageHeader.tsx
    │       │   ├── Modal.tsx
    │       │   ├── Spinner.tsx
    │       │   └── Toast.tsx
    │       ├── events/
    │       │   ├── EventTypeCard.tsx
    │       │   └── EventTypeForm.tsx
    │       ├── availability/
    │       │   └── AvailabilityEditor.tsx
    │       ├── booking/
    │       │   ├── Calendar.tsx
    │       │   ├── TimeSlotPicker.tsx
    │       │   └── BookingForm.tsx
    │       └── meetings/
    │           ├── MeetingCard.tsx
    │           └── CancelMeetingModal.tsx
    ├── package.json
    └── vite.config.ts
```

---

## Prerequisites

- Node.js 18+
- PostgreSQL 14+
- npm or yarn

---

## Setup Instructions

### 1. Clone & Install

```bash
git clone <your-repo-url>
cd calendly-clone
```

### 2. Database Setup

```bash
# Create the database
psql -U postgres -c "CREATE DATABASE calendly_clone;"

# Run schema
psql -U postgres -d calendly_clone -f database/schema.sql

# Seed sample data
psql -U postgres -d calendly_clone -f database/seed.sql
```

### 3. Backend Setup

```bash
cd backend
npm install

# Create .env from example
cp .env.example .env
# Edit .env and set your DATABASE_URL

# Start dev server (port 4000)
npm run dev
```

### 4. Frontend Setup

```bash
cd frontend
npm install

# Start dev server (port 5173)
npm run dev
```

### 5. Open the App

- **Dashboard:** http://localhost:5173
- **Public booking page:** http://localhost:5173/30-min-meeting

---

## API Endpoints

| Method | Endpoint                          | Description                        |
|--------|-----------------------------------|------------------------------------|
| GET    | /api/event-types                  | List all event types               |
| POST   | /api/event-types                  | Create event type                  |
| PUT    | /api/event-types/:id              | Update event type                  |
| DELETE | /api/event-types/:id              | Soft delete event type             |
| GET    | /api/event-types/slug/:slug       | Get event type by slug (public)    |
| GET    | /api/availability                 | Get weekly availability            |
| PUT    | /api/availability                 | Update weekly availability         |
| GET    | /api/availability/slots           | Get available slots for a date     |
| POST   | /api/book                         | Create a booking (public)          |
| GET    | /api/meetings?type=upcoming\|past | List meetings                      |
| GET    | /api/meetings/:id                 | Get meeting by ID                  |
| PATCH  | /api/meetings/:id/cancel          | Cancel a meeting                   |
| GET    | /api/users/me                     | Get current user                   |
| PUT    | /api/users/me                     | Update current user                |

---

## Database Schema

```
users
  id, name, email, timezone, created_at

event_types
  id, user_id, name, slug, duration, description, color, is_active, created_at, updated_at

availability
  id, user_id, day_of_week (0-6), start_time, end_time, is_active

availability_overrides
  id, user_id, date, is_blocked, start_time, end_time

meetings
  id, event_type_id, invitee_name, invitee_email, start_time, end_time,
  status (confirmed|cancelled|rescheduled), cancel_reason, notes, created_at
```

---

## Assumptions

- No authentication: a default user (id=1) is pre-seeded.
- Time slots are generated on 30-minute intervals within the available window.
- Double booking is prevented at the database level with row-level locking.
- The Vite dev server proxies `/api/*` requests to `localhost:4000`.

---

## Deployment

**Frontend:** Deploy to Vercel or Netlify — set `VITE_API_URL` if not using same-origin.

**Backend:** Deploy to Render or Railway — set `DATABASE_URL` and `FRONTEND_URL` env vars.

**Database:** Use Render PostgreSQL, Railway PostgreSQL, or Supabase.

# 📅 Calendly Clone

A full-stack scheduling application inspired by Calendly.
Users can set availability, share booking links, and manage meetings seamlessly.

---

## 🚀 Features

* 📆 Create and manage availability slots
* 🔗 Share booking links with others
* ⏰ Book meetings in real-time
* 👤 User authentication (login/signup)
* 📊 Dashboard to manage bookings
* ⚡ Responsive and clean UI

---

## 🛠️ Tech Stack

* **Frontend:** React / Next.js
* **Backend:** Node.js / Express
* **Database:** MongoDB / PostgreSQL
* **Other:** REST APIs, Git, GitHub

---

## 📂 Project Structure

```
/client   → Frontend code  
/server   → Backend API  
```

---

## ⚙️ Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/calendly-clone.git

# Go to project folder
cd calendly-clone

# Install dependencies
npm install

# Start development server
npm run dev
```

---

## 🔑 Environment Variables

Create a `.env` file and add:

```
DATABASE_URL=your_database_url
JWT_SECRET=your_secret_key
```

---

## 📸 Screenshots

(Add your project screenshots here)

---

## 🤝 Contributing

Contributions are welcome!
Feel free to fork the repo and submit a pull request.

---

## 📄 License

This project is open-source and available under the MIT License.

---

## 🙌 Acknowledgements

Inspired by Calendly for learning and educational purposes.
