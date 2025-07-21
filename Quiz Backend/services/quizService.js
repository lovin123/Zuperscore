import fs from "fs/promises";
import path from "path";

const QUESTIONS_PATH = path.resolve("data", "questions.json");
let questionBank = [];
const quizCache = new Map(); // Map<quizId, questions[]>

export async function loadQuestions() {
  try {
    const data = await fs.readFile(QUESTIONS_PATH, "utf-8");
    questionBank = JSON.parse(data);
  } catch (err) {
    console.error("Failed to load questions:", err);
    questionBank = [];
  }
}

export function getQuestions() {
  return questionBank;
}

export function filterQuestions(learningObjectiveId, difficultyLevel) {
  return questionBank.filter(
    (q) =>
      q.learningObjectiveId === learningObjectiveId &&
      q.difficultyLevel === difficultyLevel
  );
}

export function cacheQuiz(quizId, questions) {
  quizCache.set(quizId, questions);
}

export function getCachedQuiz(quizId) {
  return quizCache.get(quizId);
}
