# Intelligent Quiz Generation & Validation Backend

A Node.js + Express backend service for intelligent quiz generation and auto-grading, using Zod for request validation. Features modular structure, in-memory quiz cache, and mock question bank.

## Features

- Generate quizzes based on learning objective and difficulty
- Auto-grade quiz submissions
- Zod-based request validation
- Modular code structure (routes, controllers, services)
- Mocked question bank (JSON)
- In-memory quiz cache

## Tech Stack

- Node.js (ESM)
- Express
- Zod
- UUID
- CORS

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```
2. **Run in development (auto-reload):**
   ```bash
   npm run dev
   ```
3. **Run in production:**
   ```bash
   npm start
   ```

## Project Structure

```
├── controllers/
├── data/
│   └── questions.json
├── routes/
├── services/
├── validators/
├── index.js
├── package.json
├── .gitignore
└── README.md
```

## API Endpoints

### 1️⃣ Generate Quiz

**POST** `/api/quizzes/generate`

#### Request Body

```json
{
  "learningObjectiveId": "math_01",
  "difficultyLevel": "EASY",
  "numberOfQuestions": 5
}
```

#### Response

```json
{
  "quizId": "...",
  "questions": [
    {
      "questionId": "q101",
      "text": "What is 2+2?",
      "options": [
        { "id": "a", "text": "3" },
        { "id": "b", "text": "4" },
        { "id": "c", "text": "5" },
        { "id": "d", "text": "6" }
      ]
    }
  ]
}
```

### 2️⃣ Submit Quiz

**POST** `/api/quizzes/submit`

#### Request Body

```json
{
  "quizId": "...",
  "studentId": "student_1",
  "answers": [{ "questionId": "q101", "selectedOptionId": "b" }]
}
```

#### Response

```json
{
  "submissionId": "...",
  "score": 3,
  "totalQuestions": 5,
  "percentage": 60,
  "feedback": "Keep practicing!"
}
```

## Mock Data Example

See `data/questions.json` for the question format.
