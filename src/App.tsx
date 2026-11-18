import React, { useState, useRef, useEffect } from "react";
import { Loader2, Youtube, FileText, BookOpen, Sparkles, CheckCircle2, XCircle, ArrowRight, Square, Settings, ChevronUp, ChevronDown, Volume2 } from "lucide-react";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { Textarea } from "./components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import { Popover, PopoverContent, PopoverTrigger } from "./components/ui/popover";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./components/ui/dialog";
import { getOrCreds, readOrSettings, saveOrSettings } from "./lib/ai-settings";
import { explainWord, getAiInfo, loadSource, makeExercisesA, makeExercisesB, makeLesson, makeQuiz, type Level } from "./lib/lesson-functions";
import type { ExercisesA, ExercisesB, Lesson, Quiz, WordInfo } from "./lib/lesson-types";

const LEVELS: Level[] = ["A1", "A2", "B1", "B2", "C1"];

interface Source {
  kind: "youtube" | "article" | "text";
  videoId: string | null;
  title: string;
  text: string;
}

export default function App() {
  const [level, setLevel] = useState<Level>("B1");
  const [url, setUrl] = useState("");
  const [source, setSource] = useState<Source | null>(null);
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [ai, setAi] = useState<{ provider: string; model: string } | null>(null);
  const ctrl = useRef<AbortController | null>(null);

  async function loadSrc(u: string) {
    setBusy("Pobieram treść…");
    try {
      const r = await loadSource(u);
      setSource(r);
      await build(r);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Błąd ładowania");
    } finally {
      setBusy(null);
    }
  }

  async function build(src: Source) {
    setSource(src);
    setLesson(null);
    setError(null);
    const c = new AbortController();
    ctrl.current = c;
    setBusy("Przygotowuję lekcję…");
    try {
      const l = await makeLesson(src.text, level, src.title);
      if (!c.signal.aborted) {
        setLesson(l);
        setBusy(null);
      }
    } catch (e) {
      if (!c.signal.aborted) {
        setError(e instanceof Error ? e.message : "Błąd generowania");
        setBusy(null);
      }
    }
  }

  async function openUrl(e: React.FormEvent) {
    e.preventDefault();
    if (!url.trim()) return;
    await loadSrc(url.trim());
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow p-6">
        <h1 className="text-2xl font-bold mb-4">Norwegian Learning App</h1>
        <div className="flex gap-2 mb-6">
          {LEVELS.map((l) => (
            <Button key={l} size="sm" variant={level === l ? "default" : "outline"} onClick={() => setLevel(l)}>
              {l}
            </Button>
          ))}
        </div>
        <form onSubmit={openUrl} className="flex gap-2 mb-4">
          <Input placeholder="https://youtube.com/watch?v=..." value={url} onChange={(e) => setUrl(e.target.value)} />
          <Button type="submit" disabled={!!busy}>
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <BookOpen className="h-4 w-4" />}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </form>
        {error && <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded mb-4">{error}</div>}
        {busy && <div className="bg-blue-50 border border-blue-200 text-blue-700 p-3 rounded mb-4">{busy}</div>}
        {lesson && (
          <div>
            <h2 className="text-xl font-semibold mb-2">{lesson.title}</h2>
            <p className="text-gray-600 mb-4">{lesson.text}</p>
            <Tabs defaultValue="text">
              <TabsList>
                <TabsTrigger value="text">Tekst</TabsTrigger>
                <TabsTrigger value="vocab">Słowniki</TabsTrigger>
                <TabsTrigger value="exercises">Ćwiczenia</TabsTrigger>
                <TabsTrigger value="quiz">Test</TabsTrigger>
              </TabsList>
              <TabsContent value="text">Tekst lekcji</TabsContent>
              <TabsContent value="vocab">Słowniki</TabsContent>
              <TabsContent value="exercises">Ćwiczenia</TabsContent>
              <TabsContent value="quiz">Test</TabsContent>
            </Tabs>
          </div>
        )}
      </div>
    </div>
  );
}
