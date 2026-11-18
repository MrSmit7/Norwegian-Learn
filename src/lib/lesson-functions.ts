import { useState, useEffect, useRef, useCallback } from "react"

export interface AiInfo {
  provider: "openrouter" | "lovable"
  model: string
}

const LEVELS: Level[] = ["A1", "A2", "B1", "B2", "C1"]

export type Level = keyof typeof LEVELS

export interface Lesson {
  level: Level
  title: string
  text: string
  vocabulary: WordInfo[]
  grammar?: WordInfo[]
  phrases?: string[]
  rules?: string[]
  pronunciation?: string
  exercises?: Exercises
  test?: Quiz
}

export interface WordInfo {
  word: string
  translation: string
  example?: string
}

export interface Quiz {
  questions: QuizQuestion[]
}

export interface QuizQuestion {
  type: "multipleChoice" | "trueFalse" | "shortAnswer"
  question: string
  options?: string[]
  correctAnswer: string | boolean
}

export interface Exercises {
  cloze?: ClozeExercise
  errorFix?: ErrorFixExercise
  flashcards?: FlashcardExercise
  generating?: GeneratingExercise
  grammarFill?: GrammarFillExercise
  matching?: MatchingExercise
  needExercises?: NeedExercises
  paraphrase?: ParaphraseExercise
  scramble?: ScrambleExercise
  translateNo?: TranslateNoExercise
  translatePl?: TranslatePlExercise
  trueFalse?: TrueFalseExercise
}

export interface ClozeExercise { sentence: string; blanks: string[]; answers: string[] }
export interface ErrorFixExercise { sentence: string; wrong: string; correct: string }
export interface FlashcardExercise { pairs: { term: string; definition: string }[] }
export interface GeneratingExercise { prompt: string }
export interface GrammarFillExercise { sentence: string; grammarPoint: string; blank: string; answer: string }
export interface MatchingExercise { items: { left: string; right: string }[] }
export interface NeedExercises { prompt: string; count: number }
export interface ParaphraseExercise { sentence: string }
export interface ScrambleExercise { scrambled: string; correct: string }
export interface TranslateNoExercise { sentence: string; targetLang: string }
export interface TranslatePlExercise { sentence: string; targetLang: string }
export interface TrueFalseExercise { statement: string; answer: boolean }

export interface Source {
  kind: "youtube" | "article" | "text"
  videoId: string | null
  title: string
  text: string
}

export interface AiSettings {
  key: string
  model: string
}

export function useSession() {
  const [session, setSession] = useState<{ mode: "local" | "ai"; key?: string }>({ mode: "local" })
  return { session, setSession }
}

export function useAiInfo() {
  const [aiInfo, setAiInfo] = useState<AiInfo | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  async function load() {
    setIsLoading(true)
    try {
      // Mock: return dummy info
      setAiInfo({ provider: "openrouter", model: "openrouter/free" })
    } catch {
      setAiInfo(null)
    } finally {
      setIsLoading(false)
    }
  }

  return { aiInfo, isLoading, load }
}

export function generateLesson(text: string, level: Level, title: string, useOwnKey: boolean = false, model: string = "") {
  return new Promise<Lesson | null>((resolve) => {
    // Mock: return a basic lesson
    resolve({
      level,
      title,
      text,
      vocabulary: [],
      exercises: {},
      test: { questions: [] }
    })
  })
}

export function makeLesson(text: string, level: Level, title: string) {
  return generateLesson(text, level, title)
}

export function makeQuiz(text: string, level: Level, title: string) {
  return new Promise<Quiz | null>((resolve) => {
    resolve({
      questions: [
        { type: "multipleChoice", question: `Pytanie z ${title}`, options: ["Odpowiedź A", "Odpowiedź B", "Odpowiedź C"], correctAnswer: "Odpowiedź A" }
      ]
    })
  })
}

export function getAiInfo() {
  return { provider: "openrouter", model: "openrouter/free" }
}