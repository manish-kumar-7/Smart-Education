# eSmartEducation

**eSmartEducation** is a full-stack, role-based digital learning platform built using the **MERN stack (MongoDB, Express.js, React.js, Node.js)** with a responsive UI designed in **Tailwind CSS**. The system provides structured control and interaction between **Owner, Admin, and User** roles in a secure and interactive online education environment.

---

## 🚀 Overview

The platform is designed to deliver modern, engaging, and manageable online education. It supports video-based learning, interactive communication, AI-powered doubt solving, quizzes, educational games, and personal note management — all within a single scalable system.

---

## 👥 User Roles & Permissions

### 👑 Owner (Super Admin)

The **Owner** has the highest level of control in the system.

* Full access to the entire application
* Create and manage **Admin** accounts
* View and manage all **Users and Admins**
* Delete any video, note, comment, or account
* Maintain platform safety and content quality

⚠️ Owner accounts are **not created through normal signup**. A **separate JavaScript file** is used for one-time Owner creation directly in the database in model folde Createowner.js file , you have to run node Createowner .

---

### 🛠 Admin (Instructor / Content Creator)

Admins are responsible for providing educational content.

* Upload educational videos
* Edit video title, description, and details
* Delete **only their own videos**
* Reply to user comments and questions
* Manage and update their profile

> Multiple admins can exist, but each admin can manage **only their own content**.

If a user wants to become an Admin, they must submit a request form available on the signup page, which is reviewed by the Owner.

---

### 📘 User (Student / Learner)

Users are learners who interact with educational content.

* Create account via signup page
* Watch educational videos
* Like / Dislike videos
* Comment and ask questions
* Use **Gemini AI integration** to ask doubts or get learning help
* Participate in quizzes
* Play educational learning games
* Write, save, and manage personal study notes
* Manage profile (Gmail, password, profile picture)

---

## ✨ Core Features

* Role-based authentication & authorization (Owner / Admin / User)
* Video upload and management system
* Like, dislike, and comment interaction
* AI-powered doubt assistance using **Gemini API**
* Quiz-based learning modules
* Educational game features
* Personal note-taking system
* Admin request approval workflow
* Secure REST API with JWT authentication
* Fully responsive UI built with Tailwind CSS

---

## 🛠 Tech Stack

### Frontend

* React.js
* Tailwind CSS
* Axios
* React Router

### Backend

* Node.js
* Express.js
* MongoDB (Mongoose)
* JWT Authentication

---

## 🗄 Owner Database Initialization (One-Time Setup)

Owner registration is handled separately for security reasons.

A dedicated JavaScript file is used to create the first Owner directly in the database. This file is executed manually through the terminal and is not part of the normal application flow.

```bash
node createOwner.js
```

This ensures that only authorized individuals can hold the highest privilege role.

---

## ⚙️ Environment Variables (.env)

The backend requires the following environment variables:

```
PORT=5000
MONGO_URI=your_database_url
JWT_SECRET=your_jwt_secret_key (For user or admin not for owner)
SECRET_OWNER_KEY=your_Owner_jwt_secret_key (this is for owner only)
GEMINI_API_KEY=your_gemini_api_key (create gemini account free , search in google , google studio and get API_key )
```

---

## ⚙️ Installation & Setup

### 1️⃣ Clone Repository

```bash
git clone https://github.com/your-username/esmarteducation.git
cd esmarteducation
```

### 2️⃣ Backend Setup

```bash
cd backend
npm install
npm start
```

### 3️⃣ Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

---

## 📂 Project Structure

```
esmarteducation/
│
├── backend/      # Node.js + Express API
├── frontend/     # React + Tailwind client
└── README.md
```

---

## 🔐 Security Features

* Password hashing
* JWT-based authentication
* Role-based access control
* Protected Owner creation process

---

## 📈 Future Enhancements

* Live class integration
* Certificates for course completion
* Advanced performance analytics
* Mobile application version

---

Thank You 
