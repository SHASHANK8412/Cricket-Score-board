/**
 * Cricket Scoreboard Logic (modular, commented)
 * - State: team runs, wickets, overs/balls (legal deliveries only), striker, player scores, freeHit, inningsOver
 * - API: addRun, addExtra, addWicket, switchStriker, resetAll
 * - Rules:
 *   - Runs add to team and striker; odd runs rotate strike; legal delivery increments ball
 *   - Extras: bye/leg-bye are legal (increment ball, no striker runs, odd rotates); wides/no-balls illegal (no ball increment)
 *   - No Ball grants Free Hit; Free Hit prevents wicket and ball increment on next delivery if wicket/LBW pressed
 *   - Wicket/LBW: +1 wicket (max 10), legal ball, then replace striker with a new named batter; after 10 wickets, inputs disabled
 */

(() => {
  // ---------- State ----------
  const state = {
    runs: 0,
    wickets: 0,
    balls: 0,
    overs: 0,
    batters: {
      rahul: { name: 'Rahul', runs: 0, balls: 0 },
      rohit: { name: 'Rohit', runs: 0, balls: 0 },
    },
    striker: 'rahul',
    freeHit: false,
    inningsOver: false,
    nextBatterIndex: 3, // used to auto-name new players if user cancels prompt
  };

  // ---------- DOM ----------
  const el = {
    teamScore: document.getElementById('teamScore'),
    wickets: document.getElementById('wickets'),
    overs: document.getElementById('overs'),
    rahulRuns: document.getElementById('rahulRuns'),
    rahulBalls: document.getElementById('rahulBalls'),
    rohitRuns: document.getElementById('rohitRuns'),
    rohitBalls: document.getElementById('rohitBalls'),
    rahulStriker: document.getElementById('rahulStriker'),
    rohitStriker: document.getElementById('rohitStriker'),
    freeHitBadge: document.getElementById('freeHitBadge'),
    status: document.getElementById('statusMsg'),
    controls: document.querySelector('.controls'),
    rahulSR: document.getElementById('rahulSR'),
    rohitSR: document.getElementById('rohitSR'),
    rahulName: document.getElementById('rahulName'),
    rohitName: document.getElementById('rohitName'),
    eventFeed: document.getElementById('eventFeed'),
  };

  // ---------- Utilities ----------
  function safeSR(runs, balls) {
    if (!balls) return '0.0';
    return (Math.round((runs / balls) * 1000) / 10).toFixed(1);
  }

  function setStatus(message) {
    if (message) el.status.textContent = message;
  }

  function updateBatterNames() {
    el.rahulName.textContent = state.batters.rahul.name;
    el.rohitName.textContent = state.batters.rohit.name;
  }

  function updateUI(message) {
    el.teamScore.textContent = String(state.runs);
    el.wickets.textContent = String(state.wickets);
    el.overs.textContent = `${state.overs}.${state.balls}`;

    el.rahulRuns.textContent = String(state.batters.rahul.runs);
    el.rahulBalls.textContent = String(state.batters.rahul.balls);
    el.rohitRuns.textContent = String(state.batters.rohit.runs);
    el.rohitBalls.textContent = String(state.batters.rohit.balls);

    // Strike Rate
    if (el.rahulSR) el.rahulSR.textContent = safeSR(state.batters.rahul.runs, state.batters.rahul.balls);
    if (el.rohitSR) el.rohitSR.textContent = safeSR(state.batters.rohit.runs, state.batters.rohit.balls);

    // Names
    updateBatterNames();

    const rahulOn = state.striker === 'rahul';
    el.rahulStriker.classList.toggle('hidden', !rahulOn);
    el.rohitStriker.classList.toggle('hidden', rahulOn);

    el.freeHitBadge.classList.toggle('hidden', !state.freeHit);

    setInputsEnabled(!state.inningsOver);
    if (message) setStatus(message);
  }

  function setInputsEnabled(enabled) {
    if (!el.controls) return;
    const buttons = el.controls.querySelectorAll('button');
    buttons.forEach((btn) => {
      const action = btn.getAttribute('data-action');
      if (action === 'reset') {
        btn.disabled = false;
      } else {
        btn.disabled = !enabled;
      }
    });
  }

  function incrementLegalBall() {
    state.balls += 1;
    if (state.balls >= 6) {
      state.overs += 1;
      state.balls = 0;
      internalSwitchStriker();
    }
  }

  function internalSwitchStriker() {
    state.striker = state.striker === 'rahul' ? 'rohit' : 'rahul';
  }

  function addRunsToStriker(n) {
    const batter = state.batters[state.striker];
    batter.runs += n;
    batter.balls += 1;
  }

  function addBallFacedWithoutRuns() {
    const batter = state.batters[state.striker];
    batter.balls += 1;
  }

  function checkInningsOver() {
    if (state.wickets >= 10) {
      state.inningsOver = true;
      setStatus('Innings over.');
    }
  }

  function promptNewBatterName() {
    const suggestion = `Player ${state.nextBatterIndex}`;
    const name = window.prompt('Enter new batter name:', suggestion);
    state.nextBatterIndex += 1;
    const finalName = (name && name.trim()) ? name.trim() : suggestion;
    return finalName;
  }

  function replaceOutStrikerWithNewBatter() {
    const newName = promptNewBatterName();
    state.batters[state.striker] = { name: newName, runs: 0, balls: 0 };
  }

  function pushEvent(text, tone = 'info') {
    if (!el.eventFeed) return;
    const card = document.createElement('div');
    card.className = `event-card ${tone}`;
    card.textContent = text;
    el.eventFeed.prepend(card);
    // remove after animation
    setTimeout(() => card.remove(), 5000);
  }

  function pulseScore() {
    el.teamScore.classList.remove('pulse');
    void el.teamScore.offsetWidth; // reflow to restart animation
    el.teamScore.classList.add('pulse');
  }

  // ---------- API ----------
  function addRun(value) {
    if (state.inningsOver) return;
    const n = Number(value);
    state.runs += n;
    addRunsToStriker(n);
    incrementLegalBall();
    if (n % 2 === 1) internalSwitchStriker();
    state.freeHit = false;
  const name = state.batters[state.striker].name;
  pushEvent(`${name} scored ${n}`, 'good');
  pulseScore();
  updateUI(`+${n} run${n > 1 ? 's' : ''}`);
  }

  function addExtra(type) {
    if (state.inningsOver) return;
    switch (type) {
      case 'wide': {
        state.runs += 1;
  pushEvent('Wide +1', 'info');
  updateUI('Wide +1 (no ball count)');
        break;
      }
      case 'noball': {
        state.runs += 1;
        state.freeHit = true;
  pushEvent('No Ball +1 (Free Hit)', 'info');
  updateUI('No Ball +1 (Free Hit)');
        break;
      }
      case 'bye': {
        state.runs += 1;
        addBallFacedWithoutRuns();
        incrementLegalBall();
        internalSwitchStriker();
        state.freeHit = false;
  pushEvent('Bye +1', 'info');
  updateUI('Bye +1');
        break;
      }
      case 'legbye': {
        state.runs += 1;
        addBallFacedWithoutRuns();
        incrementLegalBall();
        internalSwitchStriker();
        state.freeHit = false;
  pushEvent('Leg Bye +1', 'info');
  updateUI('Leg Bye +1');
        break;
      }
      case 'freehit': {
        state.freeHit = true;
  pushEvent('Free Hit set', 'info');
  updateUI('Free Hit set');
        break;
      }
      default:
        break;
    }
  }

  function addWicket(kind = 'Wicket') {
    if (state.inningsOver) return;
    if (state.freeHit) {
      state.freeHit = false;
      pushEvent(`${kind} ignored due to Free Hit`, 'info');
      updateUI(`${kind} ignored due to Free Hit`);
      return;
    }
    state.wickets = Math.min(10, state.wickets + 1);
    addBallFacedWithoutRuns();
    incrementLegalBall();
    // Flash the out player's row
    const outKey = state.striker;
    const rowEl = outKey === 'rahul' ? document.getElementById('rahulRow') : document.getElementById('rohitRow');
    if (rowEl) {
      rowEl.classList.add('flash', 'bad');
      setTimeout(() => rowEl.classList.remove('flash', 'bad'), 600);
    }
    const outName = state.batters[outKey].name;
    pushEvent(`${outName} OUT (${kind})`, 'bad');
    replaceOutStrikerWithNewBatter();
    state.freeHit = false;
    checkInningsOver();
    updateUI(`${kind}!`);
  }

  function switchStriker() {
    if (state.inningsOver) return;
    internalSwitchStriker();
  pushEvent('Striker switched', 'info');
    updateUI('Striker switched');
  }

  function resetAll() {
    state.runs = 0;
    state.wickets = 0;
    state.balls = 0;
    state.overs = 0;
    state.batters.rahul = { name: 'Rahul', runs: 0, balls: 0 };
    state.batters.rohit = { name: 'Rohit', runs: 0, balls: 0 };
    state.striker = 'rahul';
    state.freeHit = false;
    state.inningsOver = false;
    state.nextBatterIndex = 3;
    updateUI('Reset. Ready.');
  }

  // ---------- Wiring ----------
  function handleAction(action, value) {
    switch (action) {
      case 'run': return addRun(value);
      case 'wicket': return addWicket('Wicket');
      case 'lbw': return addWicket('LBW');
      case 'wide': return addExtra('wide');
      case 'bye': return addExtra('bye');
      case 'legbye': return addExtra('legbye');
      case 'noball': return addExtra('noball');
      case 'freehit': return addExtra('freehit');
      case 'switch': return switchStriker();
      case 'reset': return resetAll();
      default: return;
    }
  }

  el.controls.addEventListener('click', (e) => {
    const target = e.target;
    if (!(target instanceof HTMLElement)) return;
    const action = target.getAttribute('data-action');
    if (!action) return;
    const value = target.getAttribute('data-value');
    handleAction(action, value);
  });

  // Initial UI
  updateUI('Ready.');
})();
