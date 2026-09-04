# Online Coding Platform

A LeetCode-style competitive programming platform where users can browse coding problems, write and submit solutions, and get instant feedback through automated code execution against hidden test cases.

Built as a full-stack learning project to explore backend architecture, authentication, caching, and third-party API integration.


## 🚀 Deployment & Live Demo

The **frontend** of the application is deployed on **Vercel**, while the **Node.js/Express.js backend** is deployed on **Render**. This deployment architecture separates the client and server layers while enabling the platform to provide a complete production-ready experience.

### 🌐 Live Application

**Live Demo:** https://online-coding-platform-1n6d.vercel.app/

---
## Features

- 🔐 **User Authentication** — Register, login, and logout using JWT-based auth with secure password hashing (bcrypt)
- 🧩 **Problem Management** — Admins can create, update, and delete coding problems with visible and hidden test cases
- ⚡ **Code Execution** — Submissions are compiled and run remotely via the [Judge0](https://judge0.com/) API, supporting multiple languages
- ✅ **Automated Judging** — Submissions are evaluated against hidden test cases, tracking pass/fail status, runtime, and memory usage
- 🤖 **AI-Powered DSA Tutor** — Integrated **Gemini AI** to provide problem-solving hints, code reviews, optimal approaches, complexity analysis, and test-case guidance based on the current coding problem
- 🚦 **Rate Limiting** — Redis-backed cooldown system prevents users from spamming the submission endpoint
- 📈 **Progress Tracking** — Tracks which problems each user has successfully solved
- 🛡️ **Role-Based Access** — Separate permissions for regular users and admins
---

## Tech Stack

| Layer            | Technology                          |
|-------------------|--------------------------------------|
| Runtime           | Node.js                             |
| Framework         | Express.js                          |
| Database          | MongoDB (Mongoose ODM)              |
| Caching / Limiting| Redis                               |
| Code Execution    | Judge0 API                          |
| Authentication    | JWT, bcrypt                         |
| Environment Config| dotenv                              |

---

## Project Structure

```
Backend/
└── src/
    ├── config/          # Database and Redis connection setup
    ├── controllers/     # Route handler logic (auth, problems, submissions)
    ├── middleware/       # Auth guards, admin checks, rate limiting
    ├── models/           # Mongoose schemas (User, Problem, Submission)
    ├── routes/           # Express route definitions
    ├── utils/            # Judge0 helper functions and shared utilities
    └── index.js          # App entry point
```

---

## Getting Started

### Prerequisites

Make sure you have the following installed / set up:

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- A [MongoDB Atlas](https://www.mongodb.com/atlas) cluster or local MongoDB instance
- A [Redis](https://redis.io/) instance (local or cloud, e.g. Redis Cloud)
- A [Judge0](https://rapidapi.com/judge0-official/api/judge0-ce) API key (via RapidAPI) or a self-hosted Judge0 instance

### Installation

```bash
git clone https://github.com/Atul-Tiwari8929/Online-Coding-Platform.git
cd Online-Coding-Platform/Backend
npm install
```

### Environment Variables

Copy the example environment file and fill in your own credentials:

```bash
cp .env.example .env
```

Your `.env` file should include values similar to:

```env
PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JUDGE0_API_KEY=your_judge0_rapidapi_key
JUDGE0_API_HOST=your_judge0_host
REDIS_HOST=your_redis_host
REDIS_PORT=your_redis_port
REDIS_PASSWORD=your_redis_password
```

> ⚠️ Never commit your real `.env` file. It's already excluded via `.gitignore`.

### Running the Server

```bash
npm run dev
```

The server will start on `http://localhost:3000` (or the port specified in your `.env`).

---

## API Overview

| Method | Endpoint                     | Description                          |
|--------|-------------------------------|---------------------------------------|
| POST   | `/user/register`              | Register a new user                  |
| POST   | `/user/login`                 | Log in an existing user              |
| POST   | `/user/logout`                | Log out the current user             |
| POST   | `/problem/create`             | Create a new problem (admin only)    |
| GET    | `/problem/getAllProblems`     | Fetch all available problems         |
| PUT    | `/problem/update/:id`         | Update an existing problem (admin)   |
| DELETE | `/problem/delete/:id`         | Delete a problem (admin only)        |
| POST   | `/submission/submit/:id`      | Submit code for a specific problem   |
| POST   | `/submission/run/:id`         | Run code against visible test cases  |

*(Exact route names may vary slightly depending on your route definitions.)*

---

## How Submission Evaluation Works

1. User submits code + language for a given problem.
2. A submission record is created in MongoDB with `status: 'pending'`.
3. The code is sent to Judge0 in a batch along with the problem's hidden test cases.
4. Judge0 returns tokens, which are polled for results.
5. Results are aggregated — pass count, runtime, memory, and final status (`accepted`, `wrong`, or `error`).
6. The submission record is updated, and if accepted, the problem is added to the user's solved list.

---

## Roadmap / Ideas for Improvement

- [ ] Add support for more languages
- [ ] Leaderboard / ranking system
- [ ] Submission history page per user
- [ ] Self-hosted Judge0 via Docker to remove API rate limits
- [ ] Contest mode with timed challenges

---

## License

This project was built for educational purposes as part of a Full Stack development learning journey.
