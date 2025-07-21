import { z } from "zod";

export const generateQuizSchema = z.object({
  learningObjectiveId: z.string(),
  difficultyLevel: z.enum(["EASY", "MEDIUM", "HARD"]),
  numberOfQuestions: z.number().int().min(5).max(10),
});

export const submitQuizSchema = z.object({
  quizId: z.string(),
  studentId: z.string(),
  answers: z.array(
    z.object({
      questionId: z.string(),
      selectedOptionId: z.string(),
    })
  ),
});
