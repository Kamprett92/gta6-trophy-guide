[![make.fun · gta6-trophy-guide-01](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![rank](https://make.fun/badge/gta6-trophy-guide-01/Kamprett92/gta6-trophy-guide/rank.svg)](https://make.fun/bounty/gta6-trophy-guide-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![reward](https://make.fun/badge/gta6-trophy-guide-01/Kamprett92/gta6-trophy-guide/reward.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)

# Leonida Sunset

An offline trophy guide and tracker for Grand Theft Auto VI on PlayStation 5.
It covers all 55 trophies — 1 platinum, 2 gold, 6 silver, and 46 bronze — in
one page you can open, check off, and come back to later.

Built for the make.fun bounty
[gta6-trophy-guide-01](https://make.fun/bounty/gta6-trophy-guide-01).
The bounty closes 2026-11-21 11:00 UTC and pays $250 across 50 places.

## What it does

- **Checklist tracker** — tick off trophies as you earn them. Progress is
  saved in your browser (localStorage), so it is still there next session.
- **Export and import** — back up your progress to a file, or move it to
  another browser or device.
- **Filters** — narrow the list by story, missable, collectibles,
  activities, or online trophies.
- **Spoiler mode** — hides the names and details of story trophies you
  have not earned yet, so the guide does not ruin the plot.
- **Roadmap to platinum** — a 5-stage plan that takes you from the first
  story missions through cleanup to the platinum trophy.
- **Missables page** — flags the 9 trophies you can lock yourself out of,
  with a warning before each point of no return.
- **Per-trophy guides** — every trophy has its own write-up with steps,
  tips, and links to its pages on Exophase and PSNProfiles.

## How to run

There is no build step and nothing to install. The app is plain static
files, and it works fully offline once loaded.

```sh
node serve.ts
```

Then open <http://localhost:8080> in your browser.

Or skip the server entirely and open `app/index.html` directly.

## Screenshots

- `screenshots/1-cover.jpg` — the main trophy list
- `screenshots/2-roadmap.jpg` — the 5-stage roadmap to platinum
- `screenshots/3-missables.jpg` — the missables page
- `screenshots/4-spoilers.jpg` — spoiler mode in action

## Trophy breakdown

| Tier | Count |
| --- | ---: |
| Platinum | 1 |
| Gold | 2 |
| Silver | 6 |
| Bronze | 46 |
| **Total** | **55** |

## The roadmap

The guide orders the hunt into five stages, so you always know what to
do next:

1. **Story playthrough** — play through the main story, grabbing the
   story trophies and the easy missables as they come up.
2. **Side activities** — work through the activities and side content
   around Leonida once the map opens up.
3. **Collectibles** — sweep up the collectible sets, region by region,
   with the tracker keeping count.
4. **Online** — knock out the online trophies in their own block, so
   they never hold up the single-player run.
5. **Cleanup** — mop up whatever is left, using the filters to show only
   unearned trophies, then take the platinum.

Each stage lists which trophies it covers and what to watch out for,
including the missables that belong to that part of the game.

## Missables

Nine trophies can be missed if you pass a story beat, make the wrong
choice, or leave an area without doing something first. The missables
page gathers all nine in one place with a warning at each point of no
return, so you can check it before starting a session and play without
worrying about a second playthrough.

## Project layout

```text
app/            the guide itself (HTML, CSS, JavaScript, trophy data)
screenshots/    screenshots used in this README
serve.ts        tiny static server for local use
```

Everything runs in the browser. There is no account, no tracking, and no
server-side storage — your checklist never leaves your own machine
unless you choose to export it.

## About the guides

The trophy write-ups are written in original words, built from the official
trophy descriptions. Where a location or detail has not been verified
in-game, the guide says so rather than guessing. This project uses no
Rockstar logo or artwork.

## Sign up for make.fun

If you want to try bounties like this one yourself, sign up via
<https://make.fun/r/t1yg6scf>.
