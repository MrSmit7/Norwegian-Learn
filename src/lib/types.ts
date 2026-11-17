export type Level = "A1" | "A2" | "B1" | "B2" | "C1";

export interface VocabItem {
  no: string;
  pl: string;
  forms?: string;
  example?: string;
  examplePl?: string;
}

export interface GrammarItem {
  topic: string;
  explanation: string;
  examples: { no: string; pl: string }[];
}

export interface PhraseItem {
  original: string;
  pl: string;
  alternatives: { no: string; note: string }[];
}

export interface Lesson {
  title: string;
  summary: string;
  norwegianText: string;
  vocab: VocabItem[];
  grammar: GrammarItem[];
  phrases: PhraseItem[];
}

export interface WordInfo {
  base: string;
  type: string;
  pl: string;
  forms?: string;
  note?: string;
  sentencePl?: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  answer: number;
  explanation: string;
}

export interface Quiz {
  questions: QuizQuestion[];
}

export interface ExercisesA {
  translateNo: { pl: string; no: string }[];
  translatePl: { no: string; pl: string }[];
  cloze: { sentence: string; answer: string; hint?: string }[];
  grammarFill: { sentence: string; answer: string; hint?: string }[];
  trueFalse: { statement: string; isTrue: boolean; explanation?: string }[];
  matching: { no: string; pl: string }[];
}

export interface ExercisesB {
  scramble: { words: string[]; answer: string }[];
  errfix: { wrong: string; correct: string; explanation?: string }[];
  paraphrase: { original: string; paraphrase: string; note?: string }[];
}