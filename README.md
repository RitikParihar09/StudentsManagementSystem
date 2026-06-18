# Academix - Student Management System

Academix is a modern, responsive **MERN (MongoDB, Express, React, Node.js)** stack application designed to streamline student administration, grade tracking, and attendance management. It supports role-based access control for **Students**, **Teachers**, and **Admins**.

---

## 🚀 Key Features

* **Role-Based Authentication & Authorization:**
  * **Students:** View personalized dashboard, attendance tracking (percentage and logged records), and graded subjects.
  * **Teachers & Admins:** Full access to view the student registry, register new students, edit details, log class attendance, and grade subjects.
  * Secured using JWT (JSON Web Tokens) with cryptographically salted passwords via `bcryptjs`.
* **Dynamic Dashboards:**
  * **Student Dashboard:** Interactive metric cards showcasing attendance statistics and detailed exam grade reports.
  * **Admin/Teacher Dashboard:** Complete registry management, search filtering, class-wide metrics, and action modals.
* **Interactive Management Tools (Modals):**
  * **Enroll/Edit Student:** Form to add/update student records.
  * **Record Attendance:** Easy logger for tracking session attendance.
  * **Manage Grades:** Input fields for grading subjects.
* **UX Enhancements:**
  * Clean, polished, responsive UI using **Tailwind CSS**.
  * Modern Iconography with **Lucide React**.
  * Dynamic, state-driven success, warning, and error toast alerts.

---

## 🛠️ Tech Stack

### Frontend (Client)
* **React 18:** Component-based UI library.
* **Vite:** Next-generation frontend tooling & bundling.
* **Tailwind CSS:** Utility-first CSS styling.
* **Lucide React:** Icon set.

### Backend (Server)
* **Node.js & Express:** Server environment and REST API routes.
* **MongoDB & Mongoose:** Document database and object-data modeling.
* **JSON Web Tokens (JWT):** Token-based authorization.
* **bcryptjs:** Secure hashing for passwords.
* **dotenv:** Environment configuration.

---

## 📁 Directory Structure

```text
StudentsManagementSystem/
├── package.json         # Root configuration to start both client and server
├── .gitignore           # Node/MERN project exclusions
├── client/              # React frontend
│   ├── src/
│   │   ├── components/  # Modularized UI components (Auth, Dashboards, Modals, Toast)
│   │   ├── App.jsx      # Core orchestrator and state controller
│   │   └── main.jsx
│   ├── tailwind.config.js
│   └── package.json
└── server/              # Express backend
    ├── models/          # MongoDB Mongoose models (User, Student)
    ├── routes/          # API endpoint routes (Auth, Students)
    ├── middleware/      # Auth validation middleware
    ├── server.js        # Backend entrypoint
    └── package.json
```

---

## ⚙️ Installation & Local Setup

### 1. Prerequisites
Make sure you have [Node.js](https://nodejs.org/) (v16+) and [MongoDB](https://www.mongodb.com/try/download/community) installed and running locally.

### 2. Clone the Repository
```bash
git clone https://github.com/RitikParihar09/StudentsManagementSystem.git
cd StudentsManagementSystem
```

### 3. Install Dependencies
Run the installation command in the root folder, and then for client and server packages:
```bash
# Install root script dependencies
npm install

# Install client dependencies
cd client && npm install

# Install server dependencies
cd ../server && npm install
```

### 4. Environment Variables Setup
Create a `.env` file in the `server` directory:
```env
PORT=5099
MONGO_URI=mongodb://localhost:27017/students_db
JWT_SECRET=your_super_secret_jwt_key
```

---

## 🏃 Run the Application

From the **root directory**, you can start both the client and server concurrently:

```bash
npm run dev
```

* **Frontend:** runs on `http://localhost:5173`
* **Backend API:** runs on `http://localhost:5099`
