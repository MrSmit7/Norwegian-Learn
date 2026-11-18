// Adapter: re-export AI functions with browser-friendly names
export {
  callAI,
  makeLesson,
  makeQuiz,
  explainWord,
  makeExercisesA,
  makeExercisesB,
  loadSource,
} from "./ai";

export type { Level } from "./types";

export function getAiInfo() {
  return { provider: "openrouter" as const, model: "openrouter/free" };
}