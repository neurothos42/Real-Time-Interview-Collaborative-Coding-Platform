import API from "./api";

interface GenerateQuestionsPayload {
  role: string;
  experience: string;
  difficulty: string;
  questionCount: number;
}

interface EvaluateInterviewPayload {
  role: string;
  experience: string;
  difficulty: string;
  questions: string[];
  answers: Record<string, string> | string[];
}

export const generateQuestions = async ({
  role,
  experience,
  difficulty,
  questionCount,
}: GenerateQuestionsPayload): Promise<string[]> => {
  const { data } = await API.post("/interview/generate", {
    role,
    experience,
    difficulty,
    questionCount,
  });

  return data.questions;
};

export const evaluateInterview = async ({
  role,
  experience,
  difficulty,
  questions,
  answers,
}: EvaluateInterviewPayload): Promise<unknown> => {
  const { data } = await API.post("/interview/evaluate", {
    role,
    experience,
    difficulty,
    questions,
    answers,
  });

  return data;
};