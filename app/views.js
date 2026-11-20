// views.js — renders the tracker list, the guide pane, the roadmap and the
// missables page. Everything is built with textContent and createElement, so
// no trophy text is ever parsed as HTML. Links to sources are the only
// anchors, and they point at Exophase and PSNProfiles.

import { GRADE_LABELS, KIND_LABELS, countLabel } from './data.js';
import { displayDescription, displayName, isSpoilerHidden } from './filters.js';

export const ROADMAP_STAGES = [
  {
    stage: 1,
    title: 'Play the story, chapters 1–4 and the finale',
    summary: 'Finish Gone Fishing, then Chapters 1, 2, 3 and 4, and the final mission. This stage alone earns 12 trophies: the opening mission, the four chapter trophies, the six named-mission trophies (Breakfast Run, The Cartel Heist, Child\u2019s Play, Headliners, VCIA Takedown, Operation Savage Glory) and the gold for the final mission.',
    points: [
      'Gone Fishing first — Just Like Paradise, your first bronze.',
      'Chapter trophies in order: Paradise Lost, T**s Ass Drug Money, Vice City, Baby!, Top Of The World, Ma.',
      'Named missions as they come: Trust, Break the Bank, Family Matters, DWNFALL, Hi-Jacked, Snow Storm.',
      'Finish the final mission for the gold You Gotta Know When to Get Off.',
    ],
  },
  {
    stage: 2,
    title: 'Stranger strands and side missions',
    summary: 'Clear the stranger strands as they appear: Andy, Kenton, Billy, Randy and Tyrone each have a final-mission trophy, Bret has a hunt, and finishing 8 strands in all earns the silver Strangers & Freaks. Doing these now keeps the endgame short.',
    points: [
      'Andy — Road to Rehabilitation; Kenton — This Was No Boat Accident; Billy — The Lone Rider.',
      'Randy — Supply & Demand; Tyrone — Spin On This!; Bret — Fair Game, a unique-animal hunt.',
      '8 strands finished earns Strangers & Freaks (silver).',
      'Sample the 9 activity types here too — Master of None counts distinct types.',
    ],
  },
  {
    stage: 3,
    title: 'Collectibles: cards, WAiNK, meditation, areas, vehicles',
    summary: 'The counting stage. Collect as you travel rather than in one grind: 3 card sets, WAiNK at 100 locations, meditation at 18 spots, all 52 areas of Leonida explored, and 100 vehicles discovered. These overlap heavily — exploring an area can advance four of them at once.',
    points: [
      'Don\u2019t Touch My Deck — complete 3 collectible card sets (silver).',
      'You WAiNKer! — WAiNK It at 100 locations (silver).',
      'Positive Mental Attitude — meditate at 18 spots.',
      'The Goodtime State — explore all 52 areas; Whip It Good — discover 100 vehicles.',
    ],
  },
  {
    stage: 4,
    title: 'Activities, races and challenges',
    summary: 'The skill stage: gold medals in all 42 Shooting Range challenges, drone race wins at all 14 locations, 20 different race wins, 50 challenges, 250 stunts, plus the fishing challenge against Cal, one arcade game, bowling at Kolt & Associates, and a melee drive-by.',
    points: [
      'The Shootist — gold in all 42 Shooting Range challenges (silver).',
      'Top Fun — drone wins at 14 locations; Earn Cash, Not Kudos — 20 different race wins.',
      'Cunning Stunts — 250 stunts (silver); One Last Thing — 50 challenges.',
      'Baited My Tackle, Stick Fiddler, Let\u2019s Go Bowling, Ten Pin.',
    ],
  },
  {
    stage: 5,
    title: 'Cleanup: money, robberies, one-off moments, then platinum',
    summary: 'Everything left: launder $250,000 of Marked Bills, spend $100,000 across shops, buy all 8 garage properties, register 10 vehicles to Scooter Bros, rob 5 bank vaults, an armored truck and one illegal operation per gang (9 gangs), the Combat Focus and Rhino moments, and the flagged missables — second tries, choices, and the one-off moments. Then A Long Road (100% completion, gold) and the platinum, Vice Got a Price!.',
    points: [
      'Dime on the Dollar — $250,000 laundered; Treat Yo Self — $100,000 spent; Little Boxes — 8 garages; On the Spot — 10 Scooter Bros registrations.',
      'Maximum Withdrawal — 5 bank vaults (silver); A Classic Blitz Play — armored truck; Pest Control — 9 gangs.',
      'Missables first in this stage: Bad Luck, I Guess, Actions Speak Louder, Hot Together, Retail Therapy, Catch Me If You Can, Sneakthief, In The Beginning\u2026, Capital Offense, The Truth Is Out There.',
      'A Long Road (gold) at 100%, then the platinum pops on its own.',
    ],
  },
];

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text != null) node.textContent = text;
  return node;
}

function gradePill(trophy) {
  return el('span', 'pill grade-' + trophy.grade, GRADE_LABELS[trophy.grade]);
}

function kindPill(trophy) {
  return el('span', 'pill', KIND_LABELS[trophy.kind] || trophy.kind);
}

function sourceLink(source) {
  const a = document.createElement('a');
  a.href = source.url;
  a.textContent = source.name;
  a.target = '_blank';
  a.rel = 'noopener';
  return a;
}

export function renderTrophyList(listElement, trophies, earned, spoilersOn, onToggle, onOpen) {
  listElement.replaceChildren();
  for (const t of trophies) {
    const item = el('li', 'trophy-item' + (earned.has(t.id) ? ' earned' : ''));
    const box = document.createElement('input');
    box.type = 'checkbox';
    box.checked = earned.has(t.id);
    box.setAttribute('aria-label', 'Earned: ' + t.name);
    box.addEventListener('change', () => onToggle(t.id, box.checked));
    box.addEventListener('click', (event) => event.stopPropagation());
    item.appendChild(box);

    const body = el('div', 'trophy-body');
    const hidden = isSpoilerHidden(t, earned, spoilersOn);
    const name = el('div', 'trophy-name' + (hidden ? ' hidden-name' : ''), displayName(t, earned, spoilersOn));
    body.appendChild(name);
    body.appendChild(el('div', 'trophy-desc', displayDescription(t, earned, spoilersOn)));

    const meta = el('div', 'trophy-meta');
    meta.appendChild(gradePill(t));
    meta.appendChild(kindPill(t));
    const target = countLabel(t);
    if (target) meta.appendChild(el('span', 'pill', target));
    if (t.missable) meta.appendChild(el('span', 'pill missable', 'Missable'));
    if (earned.has(t.id)) meta.appendChild(el('span', 'pill earned-pill', 'Earned'));
    body.appendChild(meta);
    if (!isSpoilerHidden(t, earned, spoilersOn)) {
      body.appendChild(el('div', 'trophy-guide-tease', 'Guide: ' + t.guide.slice(0, 140) + (t.guide.length > 140 ? '…' : '')));
    }
    item.appendChild(body);
    item.addEventListener('click', () => onOpen(t.id));
    listElement.appendChild(item);
  }
}

export function renderRoadmap(listElement, trophies, earned) {
  listElement.replaceChildren();
  for (const stage of ROADMAP_STAGES) {
    const li = el('li', null);
    const stageTrophies = trophies.filter((t) => t.roadmap === stage.stage);
    const done = stageTrophies.filter((t) => earned.has(t.id)).length;
    const heading = el('h3', null, 'Stage ' + stage.stage + ': ' + stage.title + ' ');
    heading.appendChild(el('span', 'stage-count', done + ' of ' + stageTrophies.length + ' earned'));
    li.appendChild(heading);
    li.appendChild(el('p', null, stage.summary));
    const points = el('ul', null);
    for (const point of stage.points) points.appendChild(el('li', null, point));
    li.appendChild(points);
    listElement.appendChild(li);
  }
}

export function renderDetail(detailBody, trophy, earned, spoilersOn) {
  detailBody.replaceChildren();
  detailBody.appendChild(el('h2', null, displayName(trophy, earned, spoilersOn)));
  const meta = el('div', 'trophy-meta');
  meta.appendChild(gradePill(trophy));
  meta.appendChild(kindPill(trophy));
  const target = countLabel(trophy);
  if (target) meta.appendChild(el('span', 'pill', target));
  if (trophy.missable) meta.appendChild(el('span', 'pill missable', 'Missable'));
  if (earned.has(trophy.id)) meta.appendChild(el('span', 'pill earned-pill', 'Earned'));
  detailBody.appendChild(meta);
  detailBody.appendChild(el('p', 'detail-desc', displayDescription(trophy, earned, spoilersOn)));

  detailBody.appendChild(el('h3', null, 'Guide — in our own words'));
  if (isSpoilerHidden(trophy, earned, spoilersOn)) {
    detailBody.appendChild(el('p', null, 'Hidden until earned: turn off “Hide story spoilers”, or earn this trophy, to read its guide.'));
  } else {
    detailBody.appendChild(el('p', null, trophy.guide));
  }

  detailBody.appendChild(el('h3', null, 'When it can be missed'));
  if (trophy.missable) {
    detailBody.appendChild(el('p', 'missable-callout', 'Flagged missable from the official description: a one-time moment or a chain that breaks if its conditions lapse. Save before you attempt it, and read the guide above first.'));
  } else if (trophy.kind === 'story') {
    detailBody.appendChild(el('p', null, 'Not missable. Story missions are replayable, so chapter and mission trophies can always be earned later.'));
  } else {
    detailBody.appendChild(el('p', null, 'Not flagged missable. The official description describes a repeatable or cumulative goal, so it can be earned after the story.'));
  }

  detailBody.appendChild(el('h3', null, 'Sources'));
  const list = el('ul', null);
  for (const source of trophy.sources || []) {
    const li = el('li', null);
    li.appendChild(sourceLink(source));
    list.appendChild(li);
  }
  const own = el('li', null, 'Guide text: written for this entry from the official description — not copied from another guide, and not yet checked in-game where it says so.');
  list.appendChild(own);
  detailBody.appendChild(list);
}
