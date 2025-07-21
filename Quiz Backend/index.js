import express from "express";
import cors from "cors";
import quizRoutes from "./routes/quizRoutes.js";
import { loadQuestions } from "./services/quizService.js";

const app = express();
app.use(cors());
app.use(express.json());

// Load questions before starting the server
await loadQuestions();

app.use("/api/quizzes", quizRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Quiz backend running on port ${PORT}`);
});
