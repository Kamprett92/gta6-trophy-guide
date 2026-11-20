// store.js — the checklist's saved state: localStorage, export and import.
// Progress is a set of trophy ids, saved in this browser only. Nothing here
// touches the network; export downloads a JSON file, import reads one back.

export const STORAGE_KEY = 'leonida-sunset-earned-v1';
export const SPOILER_KEY = 'leonida-sunset-spoilers-v1';

export function loadEarned() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return new Set();
    const ids = JSON.parse(raw);
    if (!Array.isArray(ids)) return new Set();
    return new Set(ids.filter((n) => Number.isInteger(n)));
  } catch {
    return new Set();
  }
}

export function saveEarned(earned) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...earned].sort((a, b) => a - b)));
  } catch {
    // Private mode or a full store: the checklist still works for the session.
  }
}

export function loadSpoilers() {
  try {
    return localStorage.getItem(SPOILER_KEY) === '1';
  } catch {
    return false;
  }
}

export function saveSpoilers(on) {
  try {
    localStorage.setItem(SPOILER_KEY, on ? '1' : '0');
  } catch {
    // Ignore: the toggle still works for the session.
  }
}

export function exportProgress(earned, trophies) {
  const names = [...earned]
    .sort((a, b) => a - b)
    .map((id) => {
      const t = trophies.find((x) => x.id === id);
      return t ? t.name : String(id);
    });
  const payload = {
    app: 'Leonida Sunset — GTA VI trophy guide',
    exportedAt: new Date().toISOString(),
    earnedIds: [...earned].sort((a, b) => a - b),
    earnedNames: names,
    total: trophies.length,
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'gta6-trophy-progress.json';
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export async function readImportedProgress(file, trophies) {
  const text = await file.text();
  const data = JSON.parse(text);
  const ids = new Set();
  const byName = new Map(trophies.map((t) => [t.name, t.id]));
  const rawIds = Array.isArray(data) ? data : (data.earnedIds || data.earned || []);
  for (const entry of rawIds) {
    if (Number.isInteger(entry) && entry >= 1 && entry <= trophies.length) ids.add(entry);
    else if (typeof entry === 'string' && byName.has(entry)) ids.add(byName.get(entry));
  }
  const rawNames = Array.isArray(data.earnedNames) ? data.earnedNames : [];
  for (const name of rawNames) {
    if (byName.has(name)) ids.add(byName.get(name));
  }
  return ids;
}

export function hasStoredProgress() {
  try {
    return localStorage.getItem(STORAGE_KEY) !== null;
  } catch {
    return false;
  }
}

export function sampleProgress(sampleIds) {
  return new Set(sampleIds);
}
