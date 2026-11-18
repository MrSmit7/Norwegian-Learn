import * as React from "react"
import { cn } from "@/lib/utils"

export function Cloze({ exercise }: { exercise: any }) {
  return <div className={cn("p-4 border rounded")}>[Cloze] {exercise?.sentence ?? ""}</div>
}
export function ErrorFix({ exercise }: { exercise: any }) {
  return <div className={cn("p-4 border rounded")}>[ErrorFix] {exercise?.wrong ?? ""} → {exercise?.correct ?? ""}</div>
}
export function Flashcards({ exercise }: { exercise: any }) {
  return <div className={cn("p-4 border rounded")}>[Flashcards] {exercise?.pairs?.length ?? 0} cards</div>
}
export function Generating({ exercise }: { exercise: any }) {
  return <div className={cn("p-4 border rounded")}>[Generating] {exercise?.prompt ?? ""}</div>
}
export function GrammarFill({ exercise }: { exercise: any }) {
  return <div className={cn("p-4 border rounded")}>[GrammarFill] {exercise?.sentence ?? ""}</div>
}
export function Matching({ exercise }: { exercise: any }) {
  return <div className={cn("p-4 border rounded")}>[Matching] {exercise?.items?.length ?? 0} pairs</div>
}
export function NeedExercises({ exercise }: { exercise: any }) {
  return <div className={cn("p-4 border rounded")}>[NeedExercises] {exercise?.prompt ?? ""}</div>
}
export function Paraphrase({ exercise }: { exercise: any }) {
  return <div className={cn("p-4 border rounded")}>[Paraphrase] {exercise?.sentence ?? ""}</div>
}
export function Scramble({ exercise }: { exercise: any }) {
  return <div className={cn("p-4 border rounded")}>[Scramble] {exercise?.scrambled ?? ""}</div>
}
export function TranslateNo({ exercise }: { exercise: any }) {
  return <div className={cn("p-4 border rounded")}>[TranslateNo] {exercise?.sentence ?? ""}</div>
}
export function TranslatePl({ exercise }: { exercise: any }) {
  return <div className={cn("p-4 border rounded")}>[TranslatePl] {exercise?.sentence ?? ""}</div>
}
export function TrueFalse({ exercise }: { exercise: any }) {
  return <div className={cn("p-4 border rounded")}>[TrueFalse] {exercise?.statement ?? ""}</div>
}

// Export types for external use
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