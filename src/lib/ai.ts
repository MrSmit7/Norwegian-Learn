// OpenRouter-backed AI functions (direct browser calls, no server needed)
import type { Lesson, Quiz, WordInfo, ExercisesA, ExercisesB } from "./types";

const OR_BASE = "https://openrouter.ai/api/v1";

export async function callAI(prompt: string, orKey?: string, orModel?: string): Promise<string> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (orKey) headers["Authorization"] = `Bearer ${orKey}`;

  const res = await fetch(`${OR_BASE}/chat/completions`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      model: orModel || "openrouter/free",
      messages: [
        { role: "system", content: "You are an expert Norwegian language teacher. Respond in Polish. Output valid JSON." },
        { role: "user", content: prompt },
      ],
    }),
  });
  if (!res.ok) throw new Error(`AI error: ${res.status}`);
  const data = await res.json();
  const content = data?.choices?.[0]?.message?.content || "";
  return content;
}

export async function makeLesson(text: string, level: string, title: string, orKey?: string, orModel?: string): Promise<Lesson> {
  const prompt = `Na podstawie poniższego tekstu (norweskiego lub inny język, który będziemy uczyć): "${text.slice(0, 4000)}". Na poziomie języka ${level}. Utwórz lekcję na Norweski:
- tytuł
- summary
- norwegianText (tekst, który będziemy uczyć — jeśli input był inny niż norweski, przetłumacz na norweski)
- vocab: lista {no, pl, forms?, example?, examplePl?}
- grammar: lista {topic, explanation, examples: [{no, pl}]}
- phrases: lista {original, pl, alternatives: [{no, note}]}
Zwróć JSON: { title, summary, norwegianText, vocab: [], grammar: [], phrases: [] }`;
  const raw = await callAI(prompt, orKey, orModel);
  const parsed = JSON.parse(raw);
  return {
    title: parsed.title || title,
    summary: parsed.summary || "",
    norwegianText: parsed.norwegianText || text,
    vocab: parsed.vocab || [],
    grammar: parsed.grammar || [],
    phrases: parsed.phrases || [],
  };
}

export async function makeQuiz(lesson: Lesson, level: string, orKey?: string, orModel?: string): Promise<Quiz> {
  const prompt = `Na podstawie lekcji: "${lesson.norwegianText}". Na poziomie ${level}. Utwórz test z 10 pytań: pytania o rozumienie, słówka, gramatykę. Zwróć JSON: { questions: [{ question, options: [], answer: number, explanation }] }`;
  const raw = await callAI(prompt, orKey, orModel);
  const parsed = JSON.parse(raw);
  return { questions: parsed.questions || [] };
}

export async function explainWord(word: string, sentence: string, level: string, orKey?: string, orModel?: string): Promise<WordInfo> {
  const prompt = `Wyjaśnij słowo norweskie: "${word}" w kontekście zdania: "${sentence}". Po polsku. Zwróć JSON: { base, type, pl, forms?, note?, sentencePl? }`;
  const raw = await callAI(prompt, orKey, orModel);
  const parsed = JSON.parse(raw);
  return parsed;
}

export async function makeExercisesA(lesson: Lesson, level: string, orKey?: string, orModel?: string): Promise<ExercisesA> {
  const prompt = `Na podstawie lekcji: "${lesson.norwegianText}" (poziom ${level}). Utwórz ćwiczenia A:
- translateNo: tłumaczenie polskie→norweskie (tablica: {pl, no})
- translatePl: tłumaczenie norweskie→polskie (tablica: {no, pl})
- cloze: luki (sentence, answer, hint?)
- grammarFill: uzupełnij zdanie (sentence, answer, hint?)
- trueFalse: stwierdzenia prawdziwe/fałszywe (statement, isTrue, explanation?)
- matching: pary słowo→tłumaczenie (no, pl)
Zwróć JSON: { translateNo, translatePl, cloze, grammarFill, trueFalse, matching }`;
  const raw = await callAI(prompt, orKey, orModel);
  const parsed = JSON.parse(raw);
  return parsed;
}

export async function makeExercisesB(lesson: Lesson, level: string, orKey?: string, orModel?: string): Promise<ExercisesB> {
  const prompt = `Na podstawie lekcji: "${lesson.norwegianText}" (poziom ${level}). Utwórz ćwiczenia B:
- scramble: {words, answer}
- errfix: {wrong, correct, explanation?}
- paraphrase: {original, paraphrase, note?}
Zwróć JSON: { scramble, errfix, paraphrase }`;
  const raw = await callAI(prompt, orKey, orModel);
  const parsed = JSON.parse(raw);
  return parsed;
}

// Try to fetch YouTube transcript via public CORS proxy
export async function loadSource(url: string): Promise<{ text: string; videoId: string | null; title: string }> {
  const yt = url.match(/(?:youtube\.com\/(?:watch|shorts|embed)\/?v=)([\w-]{11})/) || url.match(/youtu\.be\/([\w-]{11})/) || url.match(/youtube\.com\/shorts\/([\w-]{11})/);
  if (yt) {
    const videoId = yt[1];
    const url3 = `https://www.youtube.com/watch?v=${videoId}`;
    // Use a public CORS proxy for transcript fetch (may be rate-limited)
    const proxy = `https://api.allorigins.win/raw?url=${encodeURIComponent(url3)}`;
    const resp = await fetch(proxy);
    const html = await resp.text();
    const title = (html.match(/<title>(.*?)<\/title>/) || [])[1] || "YouTube video";
    const caption = html.match(/"captionTracks":\s*\[([\s\S]*?)\]/);
    let text = "";
    if (caption) {
      const tracks = JSON.parse("[" + caption[1].trim() + "]");
      const track = tracks.find((t: any) => t.kind === "asr") || tracks[0];
      if (track) {
        const tresp = await fetch(`https://www.youtube.com${track.baseUrl}&fmt=json3`);
        const tdata = await tresp.json();
        text = (tdata?.captionTracks?.[0]?.transcript || []).map((c: any) => c.text).join(" ");
      }
    }
    return { text, videoId, title };
  }
  // Article / generic fetch via allorigins
  const proxy = `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`;
  const resp = await fetch(proxy);
  const html = await resp.text();
  const text = html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  const title = (html.match(/<title>(.*?)<\/title>/) || [])[1] || "Article";
  return { text, videoId: null, title };
}
