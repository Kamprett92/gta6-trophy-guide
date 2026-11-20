// filters.js — which trophies the list shows, and the spoiler rule.
// Kinds: story, collectibles, activities, misc. The official list has no
// online trophies, so the "online" kind honestly matches nothing — the view
// says so instead of inventing one. Spoilers hide the names and descriptions
// of unearned story trophies until they are earned.

export function applyFilters(trophies, earned, filters) {
  const query = (filters.search || '').trim().toLowerCase();
  return trophies.filter((t) => {
    if (filters.kind === 'online') return false;
    if (filters.kind === 'missable' && !t.missable) return false;
    if (filters.kind !== 'all' && filters.kind !== 'missable' && t.kind !== filters.kind) return false;
    if (filters.grade !== 'all' && t.grade !== filters.grade) return false;
    if (filters.earned === 'earned' && !earned.has(t.id)) return false;
    if (filters.earned === 'unearned' && earned.has(t.id)) return false;
    if (query) {
      const hay = (t.name + ' ' + t.description + ' ' + t.guide + ' ' + t.kind).toLowerCase();
      if (!hay.includes(query)) return false;
    }
    return true;
  });
}

export function isSpoilerHidden(trophy, earned, spoilersOn) {
  return spoilersOn && trophy.kind === 'story' && !earned.has(trophy.id);
}

export function displayName(trophy, earned, spoilersOn) {
  if (isSpoilerHidden(trophy, earned, spoilersOn)) return 'Hidden story trophy — earn it to reveal';
  return trophy.name;
}

export function displayDescription(trophy, earned, spoilersOn) {
  if (isSpoilerHidden(trophy, earned, spoilersOn)) {
    return 'A story trophy. Its name and description stay hidden until you earn it.';
  }
  return trophy.description;
}

export function nextUpTrophy(trophies, earned) {
  // The platinum (id 1) is the end of the road, never the next step.
  const next = trophies.find((t) => t.id !== 1 && !earned.has(t.id) && t.kind === 'story');
  if (next) return next;
  const any = trophies.find((t) => t.id !== 1 && !earned.has(t.id));
  return any || null;
}

export function earnedByGrade(trophies, earned) {
  const counts = { platinum: 0, gold: 0, silver: 0, bronze: 0 };
  for (const t of trophies) {
    if (earned.has(t.id)) counts[t.grade] = (counts[t.grade] || 0) + 1;
  }
  return counts;
}
