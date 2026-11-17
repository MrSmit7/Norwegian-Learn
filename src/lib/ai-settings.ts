export interface AiCreds {
  orKey?: string;
  orModel?: string;
}

const KEY = "fjordleser.ai";

export function readOrSettings(): { key: string; model: string } {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { key: "", model: "" };
    return JSON.parse(raw);
  } catch {
    return { key: "", model: "" };
  }
}

export function saveOrSettings(key: string, model: string) {
  localStorage.setItem(KEY, JSON.stringify({ key, model }));
}

export function getOrCreds(): AiCreds {
  const s = readOrSettings();
  return { orKey: s.key || undefined, orModel: s.model || undefined };
}