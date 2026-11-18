export interface Level { level: string }

export interface WordInfo {
  word: string
  translation: string
  example?: string
}

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

export interface Quiz {
  questions: QuizQuestion[]
}

export interface QuizQuestion {
  type: "multipleChoice" | "trueFalse" | "shortAnswer"
  question: string
  options?: string[]
  correctAnswer: string | boolean
}