
# JWT Playground

A backend authentication system built to explore **JWT-based authentication**, **refresh token workflows**, and **session control** in a Node.js environment.

This project is intentionally designed as a **learning and engineering-focused implementation**, not a production-ready auth library.

---

## 📌 What this project does

* Implements user authentication using **JSON Web Tokens (JWT)**
* Separates **access tokens** and **refresh tokens**
* Protects API routes using middleware
* Supports user registration and login
* Demonstrates token refresh and logout concepts
* Uses MongoDB for persistence
* Uses Redis for token/session-related state

---

## 🧠 Why this project exists

Basic JWT tutorials usually stop at:

* issuing a token
* verifying it on protected routes

In real systems, this is **not sufficient**.

This project explores:

* why refresh tokens are needed
* how logout works in stateless systems
* what problems arise with naive JWT usage
* how token lifecycle decisions affect security and design

The goal is **understanding**, not just functionality.

---

## 🏗️ Tech Stack

* **Node.js**
* **Express**
* **MongoDB + Mongoose**
* **Redis**
* **JWT (jsonwebtoken)**
* **bcrypt**

---

## 📂 Project Structure (Backend)

```
backend/
├── index.js                # App entry point
├── routes/
│   ├── auth.js             # Auth-related routes
│   └── oauth.js            # OAuth (experimental / optional)
├── middleware/
│   └── authMiddleware.js   # Route protection
├── models/
│   └── user.js             # User schema
├── utils/
│   ├── tokenService.js     # Token creation & verification
│   └── redisClient.js      # Redis connection
```

---

## 🔐 Authentication Overview

* **Access Token**

  * Short-lived
  * Sent with each protected request
  * Used only for authorization

* **Refresh Token**

  * Long-lived
  * Used to obtain new access tokens
  * Intended to be tracked server-side

The project intentionally explores **design trade-offs** around token storage, rotation, and invalidation.

---

## 🚀 Getting Started (Backend)

### 1. Clone the repository

```bash
git clone https://github.com/wrath2201/jwt-playground.git
cd jwt-playground/backend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Environment variables

Create a `.env` file:

```
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_access_token_secret
JWT_REFRESH_SECRET=your_refresh_token_secret
```

### 4. Start the server

```bash
npm start
```

---

## ⚠️ Important Notes

* This project is **not production hardened**
* Some features are intentionally incomplete or under revision
* Security decisions are documented separately in engineering notes

For deeper design discussion, see:

* `PROBLEM_STATEMENT.md`
* `ENGINEERING_NOTES.md`

---

## 📚 Status

This project is actively being **reviewed, refactored, and improved** with a focus on:

* correctness
* clarity
* learning value

---

