import React, { useState, useRef, useEffect } from "react";
import { Loader2, Youtube, FileText, BookOpen, Sparkles, CheckCircle2, XCircle, ArrowRight, Square, Settings, Settings2, ChevronUp, ChevronDown, Cpu, X } from "lucide-react";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { Textarea } from "./components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import { Popover, PopoverContent, PopoverTrigger } from "./components/ui/popover";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./components/ui/dialog";
import { getOrCreds, readOrSettings, saveOrSettings } from "./lib/ai-settings";
import { explainWord, getAiInfo, loadSource, makeExercisesA, makeExercisesB, makeLesson, makeQuiz, type Level } from "./lib/lesson-functions";
import type { ExercisesA, ExercisesB, Lesson, Quiz, WordInfo } from "./lib/lesson-types";
import { useStoppable } from "./components/useStoppable";
import { useTabOrder } from "./components/useTabOrder";
import {
  Cloze, ErrorFix, Flashcards, Generating, GrammarFill, Matching, NeedExercises,
  Paraphrase, Scramble, TranslateNo, TranslatePl, TrueFalse
} from "./components/Exercises";

const LEVELS: Level[] = ["A1", "A shoe", "B1", "B2", "C1"];

interface Source {
  kind: "youtube" | "article" | "text";
  videoId: string | null;
  title: string;
  text: string;
}

type AiInfo = { provider: "openrouter" | "lovable"; model: string; };

function AiBadge({ info }: { info: AiInfo | null }) {
  if (!info) return null;
  const own = info.provider === "openrouter";
  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium ${own ? "border-success/50 bg-success/10" : "border-accent/60 bg-accent/15"}`}
      title={own ? `Twój klucz OpenRouter, model ${info.model}` : "Brak własnego klucza — używane jest Lovable AI (zużywa kredyty Lovable)"}
    >
      <Cpu className="h-3 w-3" /> {own ? `OpenRouter · ${info.model}` : "Lovable AI (kredyty Lovable)"}
    </span>
  );
}

function AiSettings({ onSaved }: { onSaved: () => void }) {
  const [open, setOpen] = useState(false);
  const [key, setKey] = useState("");
  const [model, setModel] = useState("");

  function show() {
    const s = readOrSettings();
    setKey(s.key);
    setModel(s.model);
    setOpen(true);
  }

  function save() {
    saveOrSettings(key, model);
    setOpen(false);
    onSaved();
  }

  return (
    <>
      <Button size="icon" variant="ghost" aria-label="Ustawienia AI" title="Ustawienia AI (własny klucz OpenRouter)" onClick={show}>
        <Settings className="h-4 w-4" />
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ustawienia AI</DialogTitle>
            <DialogDescription>
              Bez klucza lekcje robi Lovable AI i zużywa kredyty Lovable. Wklej darmowy klucz z openrouter.ai/keys, żeby korzystać z własnego, darmowego limitu. Klucz zapisuje się tylko w Twojej przeglądarce.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1">
              <label className="text-sm font-medium" htmlFor="or-key">Klucz OpenRouter</label>
              <Input id="or-key" type="password" value={key} onChange={(e) => setKey(e.target.value)} placeholder="sk-or-v1-…" autoComplete="off" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium" htmlFor="or-model">Model (opcjonalnie)</label>
              <Input id="or-model" value={model} onChange={(e) => setModel(e.target.value)} placeholder="openrouter/free" autoComplete="off" />
              <p className="text-xs text-muted-foreground">Zostaw puste, aby użyć darmowego modelu. Inne nazwy znajdziesz na openrouter.ai/models (szukaj oznaczenia „free“).</p>
            </div>
            <div className="flex gap-2 justify-end">
              {key && <Button variant="outline" onClick={() => { setKey(""); saveOrSettings("", model); onSaved(); }}>Usuń klucz</Button>}
              <Button onClick={save}>Zapisz</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default function App() {
  const [level, setLevel] = useState<Level>("B1");
  const [url, setUrl] = useState("");
  const [pasted, setPasted] = useState("");
  const [source, setSource] = useState<Source | null>(null);
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [ai, setAi] = useState<AiInfo | null>(null);
  const ctrl = useRef<AbortController | null>(null);
  const load = useServerFn(loadSource);
  const lessonFn = useServerFn(makeLesson);
  const aiFn = useServerFn(getAiInfo);

  function refreshAi() {
    aiFn({ data: getOrCreds() }).then(setAi).catch(() => {});
  }

  useEffect(refreshAi, [aiFn]);

  function stop() {
    ctrl.current?.abort();
    setBusy(null);
    setError("Zatrzymano.");
  }

  async function build(src: Source) {
    setSource(src);
    setLesson(null);
    setError(null);
    const c = new AbortController();
    ctrl.current = c;
    setBusy("Przygotowuję lekcję…");

    try {
      const r = await lessonFn({ data: { text: src.text, level, title: src.title, ...getOrCreds() }, signal: c.signal });
      if (c.signal.aborted) return;
      if (r.ok) setLesson(r.data);
      else setError(r.error);
    } catch (err) {
      if (!c.signal.aborted) setError(err instanceof Error ? err.message : "Błąd");
    } finally {
      if (ctrl.current === c) setBusy(null);
    }
  }

  async function openUrl(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const c = new AbortController();
    ctrl.current = c;
    setBusy("Pobieram treść…");

    try {
      const r = await load({ data: { url: url.trim() }, signal: c.signal });
      if (c.signal.aborted) return;
      if (!r.ok) {
        setBusy(null);
        setError(r.error);
        return;
      }
      await build(r.data);
    } catch (err) {
      if (c.signal.aborted) return;
      setBusy(null);
      setError(err instanceof Error ? err.message : "Błąd");
    }
  }

  return (
    <div class birthmark>
      <p>source file missing</p>
    </div>
  );
}
