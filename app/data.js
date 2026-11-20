// data.js — loads the official trophy list and holds the guide's fixed facts.
// The list itself lives in data/trophies.json: 55 trophies, 1 platinum, 2 gold,
// 6 silver, 46 bronze. Names, descriptions and grades are as PlayStation
// publishes them (Exophase for the list, PSNProfiles for grades and counts).

export const TROPHY_DATA_URL = 'data/trophies.json';
export const TOTAL_TROPHIES = 55;

export const SOURCE_LINKS = {
  exophase: 'https://www.exophase.com/game/grand-theft-auto-vi-psn/trophies/',
  psnprofiles: 'https://psnprofiles.com/trophies/43531-grand-theft-auto-vi',
};

export const GRADE_LABELS = {
  platinum: 'Platinum',
  gold: 'Gold',
  silver: 'Silver',
  bronze: 'Bronze',
};

export const KIND_LABELS = {
  story: 'Story',
  collectibles: 'Collectibles',
  activities: 'Activities',
  misc: 'Misc & open world',
};

// A sample of 13 trophies, ticked by the "Load sample progress" button so a
// reader can see the tracker at work. Chosen to span every grade and kind.
export const SAMPLE_EARNED_IDS = [2, 3, 8, 9, 10, 15, 16, 20, 21, 35, 42, 46, 51];

export async function loadTrophyData() {
  const response = await fetch(TROPHY_DATA_URL);
  if (!response.ok) throw new Error('Could not load ' + TROPHY_DATA_URL);
  const doc = await response.json();
  const trophies = Array.isArray(doc) ? doc : doc.trophies;
  return trophies.slice().sort((a, b) => a.id - b.id);
}

export function gradeCounts(trophies) {
  const counts = { platinum: 0, gold: 0, silver: 0, bronze: 0 };
  for (const t of trophies) counts[t.grade] = (counts[t.grade] || 0) + 1;
  return counts;
}

export function roadmapStageTrophies(trophies, stage) {
  return trophies.filter((t) => t.roadmap === stage);
}

export function missableTrophies(trophies) {
  return trophies.filter((t) => t.missable);
}


export function countLabel(trophy) {
  if (trophy.count == null) return null;
  if (trophy.count >= 1000) return 'Target: ' + trophy.count.toLocaleString('en-US');
  return 'Target: ' + trophy.count;
}

export function formatCountTarget(trophy) {
  if (trophy.count == null) return '';
  const n = trophy.count;
  if (trophy.id === 52) return 'Launder $' + n.toLocaleString('en-US');
  if (trophy.id === 53) return 'Spend $' + n.toLocaleString('en-US');
  return String(n);
}
