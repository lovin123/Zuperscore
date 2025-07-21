import { v4 as uuidv4 } from "uuid";
import {
  generateQuizSchema,
  submitQuizSchema,
} from "../validators/quizValidators.js";
import {
  filterQuestions,
  cacheQuiz,
  getCachedQuiz,
} from "../services/quizService.js";

export async function generateQuiz(req, res) {
  const parseResult = generateQuizSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({ error: parseResult.error.errors });
  }
  const { learningObjectiveId, difficultyLevel, numberOfQuestions } =
    parseResult.data;
  const filtered = filterQuestions(learningObjectiveId, difficultyLevel);
  if (filtered.length < numberOfQuestions) {
    return res
      .status(400)
      .json({ error: "Not enough questions available for the given filters." });
  }
  const shuffled = filtered.sort(() => 0.5 - Math.random());
  const selected = shuffled.slice(0, numberOfQuestions);
  const quizId = uuidv4();
  cacheQuiz(quizId, selected);
  const questions = selected.map((q) => ({
    questionId: q.questionId,
    text: q.text,
    options: q.options,
  }));
  res.json({ quizId, questions });
}

export function submitQuiz(req, res) {
  const parseResult = submitQuizSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({ error: parseResult.error.errors });
  }
  const { quizId, studentId, answers } = parseResult.data;
  const quizQuestions = getCachedQuiz(quizId);
  if (!quizQuestions) {
    return res.status(400).json({ error: "Invalid or expired quizId." });
  }
  let score = 0;
  for (const ans of answers) {
    const q = quizQuestions.find((q) => q.questionId === ans.questionId);
    if (q && q.correctOptionId === ans.selectedOptionId) {
      score++;
    }
  }
  const totalQuestions = quizQuestions.length;
  const percentage = Math.round((score / totalQuestions) * 100);
  let feedback = "";
  if (percentage === 100) feedback = "Excellent!";
  else if (percentage >= 80) feedback = "Great job!";
  else if (percentage >= 60) feedback = "Keep practicing!";
  else feedback = "Needs improvement.";
  const submissionId = uuidv4();
  res.json({ submissionId, score, totalQuestions, percentage, feedback });
}
