# 🎫 Datastraw Support CRM Integration

A clean, production-grade **Support Ticket Management System** integrated with CRM pipelines. Built using the **MERN Stack (MongoDB, Express, React, Node.js)** and styled with **Tailwind CSS**.

---

# 🚀 Features

- 🎫 Create, Update & Manage Support Tickets
- 👥 CRM Contact Integration
- 📧 Email Notifications using Brevo SMTP
- ☁️ Cloudinary File Uploads
- 📊 Ticket Status Tracking
- 📝 Internal Notes
- 🔍 Search & Filter Tickets
- 📱 Responsive UI with Tailwind CSS
- 🌐 Production Deployment (Vercel + Railway)

---

# 🛠 Tech Stack

### Frontend
- React.js
- Tailwind CSS
- Axios
- React Router DOM

### Backend
- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- Cloudinary
- Brevo SMTP

### Deployment
- Vercel (Frontend)
- Railway (Backend)

---

# 🎯 Submission Deliverables

### 🌐 Live Frontend

https://crm-ticket-app.vercel.app/create-ticket

### 🎥 Video Demo & Setup Guide

https://drive.google.com/file/d/1DxzI0X2ThPf9m9gXP6TiQlamzhxh4_vy/view?usp=drive_link

### 💻 GitHub Repository

https://github.com/lokeshjaiswar-dev/ticket-app

---

# 📂 Project Structure

```
ticket-app/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── App.js
│   │   └── main.jsx
│   ├── public/
│   ├── .env
│   └── package.json
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── server.js
│   ├── .env
│   └── package.json
│
└── README.md
```

---

# ⚙️ Quick Local Setup

## 1️⃣ Clone the Repository

```bash
git clone https://github.com/lokeshjaiswar-dev/ticket-app.git

cd ticket-app
```

---

## 2️⃣ Backend Setup

Move into backend directory.

```bash
cd backend
```

Install dependencies.

```bash
npm install
```

Create an environment file.

```bash
touch .env
```

Add the following configuration.

```env
PORT=5000

MONGO_URI=your_mongodb_atlas_connection_string

JWT_SECRET=your_jwt_signing_secret

BREVO_API_KEY=your_brevo_smtp_api_key

SENDER_EMAIL=your_verified_sender_email_address

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name

CLOUDINARY_API_KEY=your_cloudinary_api_key

CLOUDINARY_API_SECRET=your_cloudinary_api_secret

FRONTEND_URL=http://localhost:5173
```

Start backend server.

```bash
npm run dev
```

---

## 3️⃣ Frontend Setup

Open another terminal.

```bash
cd frontend
```

Install dependencies.

```bash
npm install
```

Create environment file.

```bash
touch .env
```

Add

```env
VITE_API_URL=http://localhost:5000/api
```

Run frontend.

```bash
npm run dev
```

Application will run at

```
http://localhost:5173
```

---

# ☁️ Production Deployment

## Backend (Railway)

Deploy the **backend** folder on Railway.

### Required Environment Variables

```env
MONGO_URI

JWT_SECRET

BREVO_API_KEY

SENDER_EMAIL

CLOUDINARY_CLOUD_NAME

CLOUDINARY_API_KEY

CLOUDINARY_API_SECRET

FRONTEND_URL=https://crm-ticket-app.vercel.app
```

Backend Root Directory

```
backend
```

---

## Frontend (Vercel)

Deploy the **frontend** folder on Vercel.

Root Directory

```
frontend
```

Environment Variable

```env
VITE_API_URL=https://your-railway-backend-url/api
```

Deploy.

---

# 📧 Email Service

Emails are sent using **Brevo SMTP API**.

Supported notifications include:

- Ticket Created
- Status Updated
- Notes Added

---

# ☁️ Cloudinary Integration

Cloudinary is used for

- Ticket Attachments
- Image Uploads