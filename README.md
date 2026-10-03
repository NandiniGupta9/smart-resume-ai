# SmartResume AI-AI Resume Analyzer

**SmartResume AI** is an AI-powered Resume Analyzer and ATS Screening web application. Users can upload a resume PDF, paste a Job Description, add important skills, and receive an AI-generated ATS score with matching skills, missing skills, strengths, and improvement suggestions.

🔗 **Live Demo:** https://smart-resume-ai-k973.onrender.com

---

## ✨ Features

* 🔐 Sign Up & Login with JWT authentication
* 📄 Upload resume in PDF format
* 📝 Paste Job Description and add skills/keywords
* 🤖 AI-powered ATS analysis using Google Gemini
* 📊 ATS score out of 100 with category-wise breakdown
* ✅ Matching and missing skills
* 💡 Resume strengths and improvement suggestions
* 🕒 Analysis history saved per user
* 🔒 Secure password hashing and protected routes

---

## 🛠️ Tech Stack

* **Frontend:** React.js, Vite, React Router, HTML, CSS
* **Backend:** Node.js, Express.js
* **Database:** MongoDB, Mongoose
* **Authentication:** JWT, bcryptjs
* **PDF Processing:** Multer, pdf-parse
* **AI:** Google Gemini API

---

## 📁 Project Structure

```text
smart-resume-ai/
├── client/
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── services/
│       ├── App.jsx
│       └── styles.css
│
├── server/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   │   └── aiService.js
│   ├── utils/
│   ├── server.js
│   └── .env
│
└── README.md
```

---

## 🔄 How It Works

```text
Resume PDF + Job Description + Skills
                 ↓
          Extract Resume Text
                 ↓
             Gemini AI
                 ↓
           ATS Analysis
                 ↓
     ┌───────────┴───────────┐
     ↓                       ↓
  ATS Score            Improvements
  Skills Match         Missing Skills
  Strengths            AI Summary
                 ↓
             MongoDB
```

---

## 📊 ATS Scoring

The resume is evaluated across 8 categories:

| Category             |     Max |
| -------------------- | ------: |
| Skills Match         |      30 |
| JD Keyword Relevance |      15 |
| Technical Skills     |      10 |
| Projects Relevance   |      15 |
| Experience Relevance |      15 |
| Education            |       5 |
| Resume Clarity       |       5 |
| ATS Formatting       |       5 |
| **Total**            | **100** |

The backend validates the individual category scores and calculates the final score out of 100.

---

## ⚙️ Setup

### 1. Install dependencies

```bash
cd server
npm install

cd ../client
npm install
```

### 2. Create `server/.env`

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret
GEMINI_API_KEY=your_gemini_api_key
AI_MODEL=gemini-2.5-flash
```

Get a Gemini API key from:

https://aistudio.google.com/app/apikey

### 3. Start Backend

```bash
cd server
npm run dev
```

### 4. Start Frontend

```bash
cd client
npm run dev
```

Open:

```text
http://localhost:5173
```

---

## 🗄️ MongoDB

You can use:

* **MongoDB Atlas** for a cloud database, or
* **MongoDB Community Server** for local development.

For local MongoDB:

```env
MONGO_URI=mongodb://127.0.0.1:27017/smart-resume-ai
```

MongoDB Compass can be used to view the database and stored analysis records.

---

## 🔒 Security

* Passwords are hashed using bcryptjs.
* JWT protects authenticated routes.
* API keys are stored in `.env`.
* Gemini API is called only from the backend.
* `.env` should never be committed to GitHub.

---

## 🚀 Future Improvements

* Resume improvement suggestions based on specific job roles
* Resume keyword highlighting
* Download analysis as PDF
* OCR support for scanned resumes
* Resume comparison and version tracking

---

## 👩‍💻 Author

**Nandini Gupta**

B.Tech — Computer Science & Engineering
