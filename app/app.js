// app.js — boots the guide: loads the trophy data, wires the tracker, the
// filters, the spoiler setting, export/import, the tabs and the guide pane.
// Views can also be driven by the address bar, so a link can open the guide
// at a section: ?view=roadmap, ?view=missables, ?view=about, ?sample=1 to tick
// the sample set, ?spoilers=1 to hide story spoilers, ?open=<id> to open one
// trophy's guide. Everything runs offline from this app's own files.

import { loadTrophyData, SAMPLE_EARNED_IDS, TOTAL_TROPHIES } from './data.js';
import {
  loadEarned, saveEarned, loadSpoilers, saveSpoilers,
  exportProgress, readImportedProgress, sampleProgress,
} from './store.js';
import { applyFilters, nextUpTrophy, earnedByGrade } from './filters.js';
import { renderTrophyList, renderRoadmap, renderDetail } from './views.js';

const trophies = await loadTrophyData();
let earned = loadEarned();
let spoilersOn = loadSpoilers();

const params = new URLSearchParams(location.search);
if (params.get('sample') === '1') {
  earned = sampleProgress(SAMPLE_EARNED_IDS);
  saveEarned(earned);
}
if (params.get('spoilers') === '1') {
  spoilersOn = true;
  saveSpoilers(true);
}

const filters = { search: '', kind: 'all', grade: 'all', earned: 'all' };

const listElement = document.getElementById('trophyList');
const missableList = document.getElementById('missableList');
const roadmapList = document.getElementById('roadmapList');
const detailPane = document.getElementById('detailPane');
const detailBody = document.getElementById('detailBody');
const spoilerToggle = document.getElementById('spoilerToggle');
const spoilerNote = document.getElementById('spoilerNote');
const onlineEmpty = document.getElementById('onlineEmpty');
const noResults = document.getElementById('noResults');
const listFoot = document.getElementById('listFoot');

spoilerToggle.checked = spoilersOn;

let openTrophyId = null;

function openDetail(id) {
  const trophy = trophies.find((t) => t.id === id);
  if (!trophy) return;
  openTrophyId = id;
  renderDetail(detailBody, trophy, earned, spoilersOn);
  detailPane.hidden = false;
}

function closeDetail() {
  openTrophyId = null;
  detailPane.hidden = true;
}

function toggleEarned(id, checked) {
  if (checked) earned.add(id);
  else earned.delete(id);
  saveEarned(earned);
  renderAll();
}

function renderProgress() {
  const byGrade = earnedByGrade(trophies, earned);
  document.getElementById('earnedCount').textContent = String(earned.size);
  document.getElementById('progressFill').style.width = (earned.size / TOTAL_TROPHIES * 100) + '%';
  document.getElementById('progressBar').setAttribute('aria-valuenow', String(earned.size));
  document.getElementById('progressGrades').textContent =
    'Platinum ' + byGrade.platinum + '/1 · Gold ' + byGrade.gold + '/2 · Silver ' + byGrade.silver + '/6 · Bronze ' + byGrade.bronze + '/46';
  const next = nextUpTrophy(trophies, earned);
  document.getElementById('nextUp').textContent = !next
    ? 'Every trophy earned — Leonida Legend. The platinum is yours.'
    : (spoilersOn && next.kind === 'story'
      ? 'Next up: continue the story — the next trophy stays hidden until you earn it.'
      : 'Next up: ' + next.name + ' — ' + next.description);
}

function renderAll() {
  renderProgress();
  spoilerNote.hidden = !spoilersOn;
  const shown = applyFilters(trophies, earned, filters);
  onlineEmpty.hidden = filters.kind !== 'online';
  noResults.hidden = !(filters.kind !== 'online' && shown.length === 0);
  renderTrophyList(listElement, shown, earned, spoilersOn, toggleEarned, openDetail);
  listFoot.textContent = 'Showing ' + shown.length + ' of ' + trophies.length + ' trophies · ' + earned.size + ' earned';
  renderRoadmap(roadmapList, trophies, earned);
  renderTrophyList(
    missableList,
    trophies.filter((t) => t.missable),
    earned, spoilersOn, toggleEarned, openDetail,
  );
  document.getElementById('missableBadge').textContent = String(trophies.filter((t) => t.missable).length);
  if (!detailPane.hidden && openTrophyId != null) openDetail(openTrophyId);
}

function showView(name) {
  for (const view of ['tracker', 'roadmap', 'missables', 'about']) {
    document.getElementById('view-' + view).hidden = view !== name;
    document.getElementById('tab' + view[0].toUpperCase() + view.slice(1)).classList.toggle('active', view === name);
  }
  if (name !== 'tracker') closeDetail();
}

for (const button of document.querySelectorAll('.tab')) {
  button.addEventListener('click', () => showView(button.dataset.view));
}

document.getElementById('searchInput').addEventListener('input', (event) => {
  filters.search = event.target.value;
  renderAll();
});
document.getElementById('kindFilter').addEventListener('change', (event) => {
  filters.kind = event.target.value;
  renderAll();
});
document.getElementById('gradeFilter').addEventListener('change', (event) => {
  filters.grade = event.target.value;
  renderAll();
});
document.getElementById('earnedFilter').addEventListener('change', (event) => {
  filters.earned = event.target.value;
  renderAll();
});
spoilerToggle.addEventListener('change', () => {
  spoilersOn = spoilerToggle.checked;
  saveSpoilers(spoilersOn);
  renderAll();
});

document.getElementById('exportBtn').addEventListener('click', () => exportProgress(earned, trophies));
document.getElementById('importFile').addEventListener('change', async (event) => {
  const file = event.target.files && event.target.files[0];
  if (!file) return;
  try {
    earned = await readImportedProgress(file, trophies);
    saveEarned(earned);
    renderAll();
  } catch {
    alert('That file could not be read as trophy progress. Export progress first, then import that file back.');
  }
  event.target.value = '';
});
document.getElementById('sampleBtn').addEventListener('click', () => {
  earned = sampleProgress(SAMPLE_EARNED_IDS);
  saveEarned(earned);
  renderAll();
});
document.getElementById('resetBtn').addEventListener('click', () => {
  earned = new Set();
  saveEarned(earned);
  renderAll();
});
document.getElementById('detailClose').addEventListener('click', closeDetail);
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeDetail();
});

renderAll();
const initialView = params.get('view');
if (initialView === 'roadmap' || initialView === 'missables' || initialView === 'about') showView(initialView);
const openId = Number(params.get('open'));
if (Number.isInteger(openId) && openId >= 1 && openId <= trophies.length) openDetail(openId);
