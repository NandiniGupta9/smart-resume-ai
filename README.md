# SmartResume AI

An AI Resume Analyzer / ATS screening web app. Upload a PDF resume, paste a job
description, and get an ATS score, matching and missing skills, strengths,
improvements and a summary.
# Live Demo:  https://smart-resume-ai-k973.onrender.com
## Features
- Sign up / Login with JWT authentication (passwords hashed with bcrypt)
- Upload a PDF resume, paste a job description, enter key skills
- AI-based ATS analysis with a structured 8-category scoring system
- Result page: score, breakdown, skills, strengths, improvements, summary
- Analysis history saved per user in MongoDB

## Tech Stack
- Frontend: React (Vite), React Router, plain CSS
- Backend: Node.js, Express
- Database: MongoDB + Mongoose
- Auth: JWT + bcryptjs
- PDF: Multer (memory storage) + pdf-parse
- AI: Google Gemini API, free tier (called only from the backend)

## Folder Structure
```
smart-resume-ai/
├── client/
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── src/
│       ├── components/   Navbar.jsx, ProtectedRoute.jsx
│       ├── pages/        Home, Login, Signup, Dashboard, Result, History
│       ├── services/     api.js
│       ├── App.jsx
│       ├── main.jsx
│       └── styles.css
├── server/
│   ├── controllers/      authController, analysisController, historyController
│   ├── middleware/       authMiddleware.js
│   ├── models/           User.js, Analysis.js
│   ├── routes/           authRoutes, analysisRoutes, historyRoutes
│   ├── services/         aiService.js   <- all AI logic is here
│   ├── utils/            pdfParser.js
│   ├── .env.example
│   ├── server.js
│   └── package.json
├── .gitignore
└── README.md
```

## Prerequisites
- Node.js 18 or newer (`node -v`)
- MongoDB (local install OR free MongoDB Atlas account)
- A free Gemini API key (https://aistudio.google.com/app/apikey)

## Setup

### 1. Install dependencies
```
cd server
npm install
cd ../client
npm install
```

### 2. Create server/.env
Copy the example file and fill in your values:
```
cd server
cp .env.example .env          # Windows: copy .env.example .env
```
Then edit `server/.env`:
```
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/smart-resume-ai
JWT_SECRET=any_long_random_string
GEMINI_API_KEY=your_real_key
AI_MODEL=gemini-2.5-flash
```

### 3. MongoDB
- Local: install MongoDB Community Server and start it. Keep the default MONGO_URI.
- Atlas (cloud): create a free cluster, add a database user, allow your IP under
  Network Access, then paste the connection string into MONGO_URI, e.g.
  `mongodb+srv://USER:PASSWORD@cluster0.xxxxx.mongodb.net/smart-resume-ai`

### 4. Run the backend (terminal 1)
```
cd server
npm run dev
```
You should see `MongoDB connected` and `Server running on http://localhost:5000`.

### 5. Run the frontend (terminal 2)
```
cd client
npm run dev
```
Open http://localhost:5173

## Example workflow
1. Sign up, then log in.
2. On the Dashboard upload a text-based PDF resume, paste a job description,
   enter skills (e.g. `Java, React, SQL`).
3. Click "Analyze Resume" and wait a few seconds.
4. View the ATS score and suggestions.
5. Open "Analysis History" to see previous results.

## How the AI-based ATS scoring works
The AI scores the resume in 8 categories, each with a maximum number of points:

| Category | Max |
|---|---|
| Skills match | 30 |
| JD keyword relevance | 15 |
| Technical skills | 10 |
| Projects relevance | 15 |
| Experience relevance | 15 |
| Education relevance | 5 |
| Resume clarity | 5 |
| ATS-friendly formatting | 5 |

The backend clamps each score to its maximum and adds them up to get the final
score out of 100. The AI is told not to invent anything that is not in the resume.

## Troubleshooting
| Problem | Fix |
|---|---|
| `MongoDB connection error` | Start MongoDB, or check MONGO_URI / Atlas IP access |
| `AI service returned an error` | Check GEMINI_API_KEY and AI_MODEL in server/.env |
| `Cannot connect to the server` | Backend is not running on port 5000 |
| `Free AI limit reached` | Free tier allows only a few requests per minute; wait 1 minute |
| `No readable text found` | PDF is a scanned image; use a text-based PDF |
| Login works but pages redirect to login | Token expired; log in again |

## Security notes
- `.env` is in `.gitignore`. Never commit your API key or JWT secret.
- The AI key is only used on the server, never in React code.
