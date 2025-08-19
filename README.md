# Cricket Scoreboard

A simple, clean web app to keep a basic cricket scoreboard using HTML, CSS, and JavaScript.

## Features

- Team score display as Runs/Wickets with overs in `overs.balls` format
- Two batters: Rahul and Rohit with individual runs and balls faced
- Striker clearly marked with a green star and row highlight; strike rotates on odd runs and at over-end
- Buttons for match events:
  - Runs: 1, 2, 3, 4, 6
  - Dismissals: Wicket, LBW (danger-styled)
  - Extras: Wide, Bye, Leg Bye, No Ball, Free Hit (alt blue style)
  - Utility: Switch Striker, Reset
- Free Hit logic: If active, a wicket/LBW on the next input is ignored (no wicket, no ball increment); Free Hit is consumed
- After wicket/LBW: striker is reset to Rahul (per assignment requirement)
- Inputs disabled automatically after 10 wickets (innings over); Reset remains enabled
- Responsive layout for desktop and mobile

## Rules implemented (summary)

- Legal balls increment ball count (runs, byes, leg-byes, valid wickets). End of over rotates strike
- Wides/No-balls are illegal; they do not increment the ball count
- No-ball: +1 run and grants Free Hit
- Free Hit: prevents a wicket on the next ball; pressing Wicket/LBW during Free Hit is ignored and does not count as a ball; Free Hit then ends
- Byes/Leg-byes: +1 run to team, legal ball, adds a ball faced for striker but not runs; odd byes rotate strike
- Runs: add to team and striker; odd runs rotate strike

## How to run locally

### Option A: VS Code Live Server (recommended)
1. Open this folder in VS Code
2. Install the “Live Server” extension (Ritwick Dey)
3. Right-click `index.html` → “Open with Live Server”

### Option B: Any static server

```bash
# Python 3
python3 -m http.server 8000
# Then visit http://localhost:8000
```

### Option C: XAMPP
1. Start Apache in XAMPP
2. Copy the project folder to the XAMPP `htdocs` directory (e.g., `C:\xampp\htdocs\Cricket-Score-board`) on Windows or `/opt/lampp/htdocs` on Linux
3. Navigate to `http://localhost/Cricket-Score-board/` in your browser

## Assumptions

- Only two batters exist in scope (Rahul and Rohit). Batting order beyond them is out of scope
- Byes/Leg-byes are provided as single-run buttons for simplicity
- Free Hit can also be toggled manually via the dedicated button (in addition to being granted by No Ball)
- Innings ends at 10 wickets; overs cap is not enforced unless requested

## Test notes (manual checklist)

- Runs 1/2/3/4/6:
  - Team score increases; striker’s runs/balls update; odd runs rotate strike; over-end rotates strike
- Wicket/LBW:
  - Wickets increase by 1, ball count increases; striker resets to Rahul; inputs disable at 10 wickets
- Wide:
  - +1 team; no ball increment; Free Hit (if any) remains active
- No Ball:
  - +1 team; no ball increment; Free Hit becomes active
- Free Hit → Wicket/LBW pressed next:
  - Ignore dismissal; do not increment ball; consume Free Hit
- Bye/Leg-bye:
  - +1 team; ball increment; striker’s balls +1, runs unchanged; strike rotates (odd)

## Project structure

- `index.html` – UI layout, semantic structure
- `styles.css` – Styling with responsive grid/flex and button themes
- `script.js` – All logic, modular functions, DOM updates
- `README.md` – This file
- `report.md` – One-page report on approach, challenges, and testing

## Acknowledgements

- Pure client-side app; no external libraries required