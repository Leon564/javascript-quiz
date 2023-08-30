import { create } from "zustand";
import { type Question } from "../types";
import confetti from 'canvas-confetti'; 
import { persist } from "zustand/middleware";
import { fetchAllQuestions } from "../services/questions";

interface State {
  questions: Question[];
  currentQuestion: number;
  fetchQuestions: (limit: number) => void;
  selectAnswer: (questionId: number, answerIndex: number) => void;
  goNextQuestion: () => void;
  goPreviousQuestion: () => void;
  reset: () => void;
}

export const useQuestionsStore = create<State>()(persist((set, get) => {
  return {
    questions: [],
    currentQuestion: 0,

    fetchQuestions: async (limit: number) => {
      const json = await fetchAllQuestions();

      const questions = json.sort(() => Math.random() - 0.5).slice(0, limit);
      set({ questions });
    },

    selectAnswer: (questionId: number, answerIndex: number) => {
      const { questions } = get();
      const newQuestions = structuredClone(questions);
      const questionIndex = newQuestions.findIndex(q=>q.id === questionId);
      const questionInfo = newQuestions[questionIndex];
      const isCorrectUserAnswer = questionInfo.correctAnswer === answerIndex;

      if (isCorrectUserAnswer) confetti();

      newQuestions[questionIndex] = {
        ...questionInfo,
        isCorrectUserAnswer,
        userSelectedAnswer: answerIndex,
      };

      set({ questions: newQuestions });
    },

    goNextQuestion: () => {
      const { currentQuestion, questions } = get();
      if (currentQuestion < questions.length - 1) {
        set({ currentQuestion: currentQuestion + 1 });
      }
    },

    goPreviousQuestion: () => {
      const { currentQuestion } = get();
      if (currentQuestion > 0) {
        set({ currentQuestion: currentQuestion - 1 });
      }
    },

    reset: () => {
      set({ questions: [], currentQuestion: 0 });
    }
  }
}, { name: "questions" }));
