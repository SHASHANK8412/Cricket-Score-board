# Cricket Scoreboard – One-page Report

## Approach

- Built a semantic, responsive UI in HTML5 with clear sections: header, scoreboard, players, controls, status, and footer.
- Encapsulated state and logic in a self-invoking module in `script.js` with a small API: `addRun`, `addExtra`, `addWicket`, `switchStriker`, `resetAll`.
- Maintained state for team runs, wickets, overs/balls (legal deliveries only), striker, individual stats for Rahul and Rohit, a `freeHit` flag, and an `inningsOver` flag.
- Centralized UI updates with `updateUI()` which re-computes text and toggles indicators and input disabled states.

## Challenges and solutions

1. Free Hit rules
   - Challenge: The next delivery cannot result in a wicket, and if a wicket action is pressed it should neither add a wicket nor count a ball.
   - Solution: When `freeHit` is true and `addWicket()` is called, ignore the action, do not increment balls, and clear `freeHit`. Legal deliveries consume Free Hit.

2. Overs handling (overs.balls)
   - Challenge: Only legal deliveries should increment ball count, with strike rotation at end of the over.
   - Solution: Used `incrementLegalBall()` to handle ball/over transitions and rotate strike automatically when balls reach 6.

3. Maximum 10 wickets
   - Challenge: Stop inputs and mark innings over at exactly 10 wickets.
   - Solution: Clamp wickets to a max of 10, set `inningsOver = true`, show status “Innings over.”, and disable all control buttons except Reset.

4. Striker behavior on dismissal
   - Challenge: Assignment requires resetting striker to Rahul after wicket/LBW.
   - Solution: In `addWicket()`, after processing the legal ball, set `state.striker = 'rahul'`.

## Testing coverage (manual)

- Runs: Verified scoring, odd-run strike rotation, over-end rotation, and Free Hit consumption on legal balls.
- Wicket/LBW: Verified wicket increments, ball increments, striker reset to Rahul, innings lockout after 10 wickets.
- Extras:
  - Wide: +1, no ball increment
  - No Ball: +1, no ball increment, `freeHit = true`
  - Free Hit + Wicket/LBW: dismissal ignored; ball not incremented; `freeHit` cleared
  - Bye/Leg Bye: +1 team, ball increment, striker balls +1 (no runs), odd rotates
- UI/UX: Checked striker star and row highlight toggle, Free Hit badge visibility, button hover effects, and mobile responsiveness.

## Conclusion

The app fulfills the assignment requirements with a clean UI and a modular logic layer. It enforces Free Hit behavior, legal vs. illegal deliveries, over counting, and innings termination at 10 wickets. Further extensions (e.g., configurable overs limit, more batters) can be added without changing the core API.
