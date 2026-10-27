# MediCare — Doctor Appointment System (Frontend)

A responsive React + Tailwind CSS frontend demo using the requested aqua-blue and pale-white theme.

## Theme
- Aqua blue: `#17AFC0`
- Pale white: `#F3FAFB`
- Deep teal: `#164E59`
- White cards: `#FFFFFF`
- Soft borders: `#D9E9EB`

## Requirements
- Node.js 18.18+ (Node.js 20 LTS recommended)
- npm

## Run locally

1. Extract the ZIP file.
2. Open the extracted `medicare-doctor-appointment` folder in VS Code.
3. Open Terminal → New Terminal.
4. Install packages:

   ```bash
   npm install
   ```

5. Start the development server:

   ```bash
   npm run dev
   ```

6. Open the local URL Vite prints, usually `http://localhost:5173`.

## Features in this frontend
- Role switcher for Patient, Doctor, Receptionist, and Admin
- Different navigation menus for each role
- Patient dashboard and doctor directory
- Search and specialty filtering
- Appointment booking modal with doctor, date, time, and patient name
- Demo appointment list with status changes for staff roles
- Doctor availability toggles in the admin doctor directory
- Doctor schedule view
- Payment history view
- Notifications and mark-as-read interaction
- Profile settings form
- Responsive sidebar for mobile
- Aqua-blue/pale-white theme with subtle grid background and hover states

## Important limitations
This is frontend-only and uses in-memory sample data. Reloading the page resets changes. Authentication, database persistence, real notifications, prescription storage, and payment gateway are not connected. Do not enter real patient medical information.

## Suggested next phase
Connect the UI to a backend (for example, FastAPI + SQLAlchemy + SQLite/PostgreSQL) with authentication and role-based authorization. Validate all appointment dates and available slots on the server before production use.
