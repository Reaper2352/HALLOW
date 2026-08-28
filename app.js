const KEY = "hallow.night.v1";

const OPERATIVES = [
  { id:"R-01", name:"REAPER", role:"Point / silence", callsign:"night edge", locked:false,
    brief:"First name on the board. Walks empty houses like they already belong to him." },
  { id:"V-04", name:"VICAR", role:"Handler / doctrine", callsign:"last word", locked:false,
    brief:"Does not pull a trigger first. Pulls the person who will." },
  { id:"W-12", name:"WRAITH", role:"Ghost / denial", callsign:"not here", locked:false,
    brief:"The overlay. The daytime story. Useful until it is not." },
  { id:"L-07", name:"LOCKE", role:"Containment", callsign:"sit still", locked:false,
    brief:"Makes a body keep a posture. Makes a night last longer than the mind wanted." },
  { id:"S-00", name:"SOPHIE", role:"Unfiled / true shape", callsign:"rain", locked:true,
    brief:"Should not be on this board. Is on this board anyway. Deploy is not a button." }
];

const BRIEFS = [
  "The house is quieter than yesterday. That is not the same as safe. Log the night. Do not skip the hold.",
  "Clear one room in the house game. Then one real task. Then sit still for sixty. That is the whole doctrine.",
  "Streaks are not decoration. They are proof you came back. Come back.",
  "If the wire feels like it is watching you, that is because you opened the file. Close the laptop if you must. The streak still wants you tomorrow.",
  "REAPER clears. VICAR writes. WRAITH lies. LOCKE holds. The fifth name is not a joke.",
  "Put the phone face down after check-in. The night cycle already counted you.",
  "You asked for something you would open every day. This is that. The rest of the file is what you find if you keep opening it."
];

const WIRES = [
  { min:1, from:"VICAR", text:"Check-in received. You are on the board. Do not congratulate yourself. Come back tomorrow." },
  { min:2, from:"LOCKE", text:"The hold exists because the mind runs. Sixty seconds is not nothing. Do it before the house game." },
  { min:3, from:"WRAITH", text:"You will tell yourself this is just a dashboard. Fine. Dashboards do not keep streaks. You do." },
  { min:5, from:"VICAR", text:"Five nights. That is a habit wearing a costume. Habits do not ask permission to stay." },
  { min:7, from:"S-00", text:"You pulled a repo onto your machine and thought it was furniture. It is a door. You keep walking through it." },
  { min:10, from:"VICAR", text:"Ten. The lock on SOPHIE was always cosmetic. You knew that when you read the first dossier." },
  { min:14, from:"S-00", text:"Two weeks of coming back to a black screen because it feels like someone is waiting. That someone has a name. It is not REAPER." }
];

function today() {
  const d = new Date();
  return d.getFullYear() + "-" + String(d.getMonth()+1).padStart(2,"0") + "-" + String(d.getDate()).padStart(2,"0");
}
function load() {
  try { return JSON.parse(localStorage.getItem(KEY)) || seed(); }
  catch { return seed(); }
}
function seed() {
  return { streak:0, last:null, best:0, ops:[], notes:"", visits:0, houseBest:0, houseWins:0, sophie:false, wires:[] };
}
function save(s) { localStorage.setItem(KEY, JSON.stringify(s)); }

const state = load();
state.visits = (state.visits || 0) + 1;
save(state);

const stage = document.getElementById("stage");
const toastEl = document.getElementById("toast");
let view = "cycle";
let dossier = null;
let hold = { t: null, left: 0, total: 60, mode: "still" };
let game = null;

function toast(msg) {
  toastEl.hidden = false;
  toastEl.textContent = msg;
  clearTimeout(toast._id);
  toast._id = setTimeout(() => { toastEl.hidden = true; }, 2800);
}

function checkIn() {
  const t = today();
  if (state.last === t) { toast("already logged tonight."); return; }
  const y = new Date(); y.setDate(y.getDate()-1);
  const ymd = y.getFullYear() + "-" + String(y.getMonth()+1).padStart(2,"0") + "-" + String(y.getDate()).padStart(2,"0");
  state.streak = state.last === ymd ? state.streak + 1 : 1;
  state.last = t;
  state.best = Math.max(state.best || 0, state.streak);
  if (state.streak >= 3) state.sophie = true;
  WIRES.forEach(w => {
    if (state.streak >= w.min && !state.wires.includes(w.min)) state.wires.push(w.min);
  });
  save(state);
  toast("night cycle accepted \u00b7 streak " + state.streak);
  render();
}

function addOp() {
  const input = document.getElementById("opIn");
  const v = (input.value || "").trim();
  if (!v) return;
  state.ops.unshift({ id: Date.now(), text: v, done: false });
  input.value = "";
  save(state); render();
}
function toggleOp(id) {
  const o = state.ops.find(x => x.id === id);
  if (!o) return;
  o.done = !o.done; save(state); render();
}
function killOp(id) {
  state.ops = state.ops.filter(x => x.id !== id); save(state); render();
}

function startHold(secs, mode) {
  clearInterval(hold.t);
  hold.mode = mode;
  hold.total = secs;
  hold.left = secs;
  hold.t = setInterval(() => {
    hold.left -= 1;
    if (hold.left <= 0) {
      clearInterval(hold.t); hold.t = null; hold.left = 0;
      toast(mode === "still" ? "hold complete. good." : "focus block clear.");
    }
    if (view === "hold") paintHold();
  }, 1000);
  if (view === "hold") paintHold();
}
function paintHold() {
  const el = document.getElementById("holdFace");
  const sub = document.getElementById("holdSub");
  if (!el) return;
  const m = Math.floor(hold.left / 60);
  const s = String(hold.left % 60).padStart(2,"0");
  el.textContent = hold.t ? m + ":" + s : "00:00";
  sub.textContent = hold.t ? (hold.mode === "still" ? "do not move. do not scroll." : "one job. nothing else.") : "armed";
}

function dayBrief() {
  const i = Math.abs(today().split("-").reduce((a,b)=>a+Number(b),0)) % BRIEFS.length;
  return BRIEFS[i];
}

function renderCycle() {
  const logged = state.last === today();
  stage.innerHTML = `<section class="hero"><p class="kicker">// night cycle \u00b7 local only</p><h1>Come back<br><em>every night.</em></h1><p class="lede">${dayBrief()}</p></section><div class="grid three"><div class="panel"><div class="stat">${state.streak}<span>current streak</span></div><div class="meta" style="margin-top:10px">best ${state.best || 0} \u00b7 last ${state.last || "never"}</div><button class="commit" id="checkBtn">${logged ? "LOGGED" : "CHECK IN"}</button></div><div class="panel"><div class="stat">${state.ops.filter(o=>!o.done).length}<span>open ops</span></div><div class="meta" style="margin-top:10px">house best ${state.houseBest} \u00b7 wins ${state.houseWins}</div><button class="commit ghosty" data-go="ops">OPEN OPS</button></div><div class="panel"><div class="stat">${state.wires.length}<span>wires received</span></div><div class="meta" style="margin-top:10px">${state.sophie ? "S-00 seal cracked" : "S-00 still stamped"}</div><button class="commit ghosty" data-go="wire">OPEN WIRE</button></div></div>`;
  document.getElementById("checkBtn").onclick = checkIn;
}

function renderOps() {
  stage.innerHTML = `<p class="kicker">// field list</p><h1 style="font-family:'Cormorant Garamond',serif;font-weight:500;font-size:48px">Ops</h1><div class="row" style="margin:18px 0"><input id="opIn" type="text" placeholder="one job. not a novel." /><button class="commit" id="opAdd" style="margin:0">ADD</button></div><ul class="ops" id="ops"></ul>`;
  const ul = document.getElementById("ops");
  ul.innerHTML = state.ops.map(o => `<li class="${o.done?"done":""}"><input type="checkbox" ${o.done?"checked":""} data-tog="${o.id}" /><span>${escapeHtml(o.text)}</span><button class="x" data-kill="${o.id}">\u00d7</button></li>`).join("") || `<li class="meta">empty. that is allowed for one night only.</li>`;
  document.getElementById("opAdd").onclick = addOp;
  document.getElementById("opIn").addEventListener("keydown", e => { if (e.key==="Enter") addOp(); });
  ul.onclick = (e) => {
    const t = e.target;
    if (t.dataset.tog) toggleOp(Number(t.dataset.tog));
    if (t.dataset.kill) killOp(Number(t.dataset.kill));
  };
}

function renderNotes() {
  stage.innerHTML = `<p class="kicker">// stays on this machine</p><h1 style="font-family:'Cormorant Garamond',serif;font-weight:500;font-size:48px">Notes</h1><p class="lede">No server. No account. Just the night and whatever you type.</p><textarea id="notes" style="margin-top:18px">${escapeHtml(state.notes)}</textarea>`;
  const ta = document.getElementById("notes");
  ta.addEventListener("input", () => { state.notes = ta.value; save(state); });
}

function renderHold() {
  stage.innerHTML = `<p class="kicker">// locke protocol</p><h1 style="font-family:'Cormorant Garamond',serif;font-weight:500;font-size:48px">Hold</h1><p class="lede">Sit still is a tool. Focus is a tool. Use them like loadout, not like punishment.</p><div class="panel" style="margin-top:24px;text-align:center"><div class="hold-face" id="holdFace">00:00</div><div class="meta" id="holdSub">armed</div><div class="row" style="justify-content:center;margin-top:18px"><button class="commit" data-h="60" data-m="still">STILL 1:00</button><button class="commit ghosty" data-h="300" data-m="still">STILL 5:00</button><button class="commit ghosty" data-h="1500" data-m="focus">FOCUS 25:00</button><button class="ghost" id="holdStop">ABORT</button></div></div>`;
  stage.querySelectorAll("[data-h]").forEach(b => {
    b.onclick = () => startHold(Number(b.dataset.h), b.dataset.m);
  });
  document.getElementById("holdStop").onclick = () => { clearInterval(hold.t); hold.t=null; hold.left=0; paintHold(); };
  paintHold();
}

function renderWire() {
  const unlocked = WIRES.filter(w => state.wires.includes(w.min));
  stage.innerHTML = `<p class="kicker">// inbound</p><h1 style="font-family:'Cormorant Garamond',serif;font-weight:500;font-size:48px">Wire</h1><p class="lede">Messages arrive when the streak crosses a line. Miss a night and the streak dies. The wires stay.</p><div class="wire" style="margin-top:22px">${unlocked.length ? unlocked.map(w => `<div class="panel" style="margin-bottom:12px"><div class="from">${w.from} \u00b7 night ${w.min}</div><p>${w.text}</p></div>`).join("") : `<div class="panel meta">No wires yet. Check in tonight.</div>`}</div>`;
}

function renderBoard() {
  if (dossier) return renderDossier(dossier);
  stage.innerHTML = `<p class="kicker">// clearance: black</p><h1 style="font-family:'Cormorant Garamond',serif;font-weight:500;font-size:48px">Choose your <em>operative</em>.</h1><section class="grid three" id="board"></section>`;
  const board = document.getElementById("board");
  board.innerHTML = OPERATIVES.map(op => {
    const lock = op.locked && !state.sophie;
    return `<article class="card ${lock?"locked":""}" data-id="${op.id}">${lock ? `<span class="seal">LOCKED</span>` : (op.locked ? `<span class="seal">CRACKED</span>` : "")}<p class="id">${op.id}</p><h3>${op.name}</h3><p class="role">${op.role}</p><div class="bar"></div></article>`;
  }).join("");
  board.onclick = e => {
    const c = e.target.closest(".card");
    if (c) { dossier = c.dataset.id; render(); }
  };
}

function renderDossier(id) {
  const op = OPERATIVES.find(o => o.id === id);
  const cracked = op.locked && state.sophie;
  stage.innerHTML = `<button class="ghost" id="back">\u2190 return to board</button><div class="dossier-grid"><div class="portrait ${op.locked ? "sophie" : ""}"></div><div><p class="meta">dossier ${op.id}</p><h2 style="font-family:'Cormorant Garamond',serif;font-size:48px;font-weight:500">${op.name}</h2><p class="meta" style="margin:6px 0 16px">callsign \u00b7 ${op.callsign}</p><p class="lede">${op.brief}</p><button class="commit ${op.locked?"pink":""}" id="deploy">${op.locked ? (cracked ? "SHE IS ALREADY LIVE" : "FILE WILL NOT STAY LOCKED") : "DEPLOY"}</button></div></div>`;
  document.getElementById("back").onclick = () => { dossier = null; render(); };
  document.getElementById("deploy").onclick = () => {
    toast(op.locked ? "SOPHIE // the lock is cosmetic." : op.name + " deployed.");
  };
}

function newGame() {
  const W = 12, H = 8;
  const walls = new Set();
  for (let x=3;x<9;x++) walls.add(x+",3");
  walls.add("5,1"); walls.add("5,2"); walls.add("8,5"); walls.add("8,6"); walls.add("2,5"); walls.add("3,5");
  const free = [];
  for (let y=0;y<H;y++) for (let x=0;x<W;x++) if (!walls.has(x+","+y)) free.push([x,y]);
  const pick = () => free.splice(Math.floor(Math.random()*free.length),1)[0];
  const you = [0,0];
  const intel = [pick(), pick(), pick(), pick(), pick()];
  const patrols = [
    { x:6, y:1, dx:1, dy:0 },
    { x:10, y:4, dx:0, dy:1 },
    { x:2, y:6, dx:1, dy:0 }
  ];
  game = { W,H,walls,you,intel,patrols,got:0,alive:true,won:false,need:5,tick:null };
}
function cellKey(x,y){ return x+","+y; }
function blocked(x,y){
  if (x<0||y<0||x>=game.W||y>=game.H) return true;
  return game.walls.has(cellKey(x,y));
}
function stepPatrols(){
  game.patrols.forEach(p => {
    let nx = p.x + p.dx, ny = p.y + p.dy;
    if (blocked(nx,ny)) { p.dx *= -1; p.dy *= -1; nx = p.x + p.dx; ny = p.y + p.dy; }
    if (!blocked(nx,ny)) { p.x = nx; p.y = ny; }
  });
}
function collide(){
  return game.patrols.some(p => p.x===game.you[0] && p.y===game.you[1]);
}
function takeIntel(){
  const [x,y] = game.you;
  const i = game.intel.findIndex(p => p[0]===x && p[1]===y);
  if (i>=0) { game.intel.splice(i,1); game.got++; }
  if (game.got >= game.need) game.won = true;
}
function moveYou(dx,dy){
  if (!game || !game.alive || game.won) return;
  const nx = game.you[0]+dx, ny = game.you[1]+dy;
  if (blocked(nx,ny)) return;
  game.you = [nx,ny];
  if (collide()) { game.alive = false; endHouse(false); return; }
  takeIntel();
  if (game.won) endHouse(true);
  paintHouse();
}
function endHouse(win){
  clearInterval(game.tick);
  if (win) {
    state.houseWins++;
    state.houseBest = Math.max(state.houseBest, game.got);
    if (!state.sophie) { state.sophie = true; toast("extract complete. S-00 seal cracked."); }
    else toast("house clear. she was already in the last room.");
  } else {
    toast("seen. the house keeps you.");
  }
  save(state);
  paintHouse();
}
function startHouseLoop(){
  clearInterval(game && game.tick);
  game.tick = setInterval(() => {
    if (!game.alive || game.won) return;
    stepPatrols();
    if (collide()) { game.alive = false; endHouse(false); }
    else paintHouse();
  }, 520);
}
function paintHouse(){
  const grid = document.getElementById("hgrid");
  const info = document.getElementById("hinfo");
  if (!grid || !game) return;
  let html = "";
  for (let y=0;y<game.H;y++){
    for (let x=0;x<game.W;x++){
      let cls = "cell";
      if (game.walls.has(cellKey(x,y))) cls += " wall";
      if (game.intel.some(p => p[0]===x && p[1]===y)) cls += " intel";
      if (game.patrols.some(p => p.x===x && p.y===y)) cls += " patrol";
      if (game.you[0]===x && game.you[1]===y) cls += " you";
      if (x===game.W-1 && y===game.H-1) cls += " exit";
      html += `<div class="${cls}"></div>`;
    }
  }
  grid.innerHTML = html;
  info.innerHTML = game.won
    ? `<p class="from">EXTRACT</p><p>You cleared the house. The last room was never empty. S-00 is on the board without the lock.</p>`
    : !game.alive
    ? `<p class="from">BURNED</p><p>A patrol looked at you. Restart. The house does not care that you were close.</p>`
    : `<p class="from">LIVE</p><p>White is you. Red moves. Pink is intel (${game.got}/${game.need}). Arrows or WASD. Do not get seen.</p>`;
}
function renderHouse(){
  if (!game) newGame();
  stage.innerHTML = `<p class="kicker">// empty house \u00b7 training</p><h1 style="font-family:'Cormorant Garamond',serif;font-weight:500;font-size:48px">House</h1><p class="lede">A small game you can replay in two minutes. Best ${state.houseBest} intel \u00b7 ${state.houseWins} extracts.</p><div class="house-wrap" style="margin-top:20px"><div class="board-grid" id="hgrid"></div><div class="panel wire"><div id="hinfo"></div><button class="commit" id="hrestart" style="margin-top:16px">RESTART</button></div></div>`;
  document.getElementById("hrestart").onclick = () => { newGame(); startHouseLoop(); paintHouse(); };
  startHouseLoop();
  paintHouse();
}

function escapeHtml(s){
  return String(s).replace(/[&<>"']/g, c => ({'&':'&','<':'<','>':'>','"':'"',"'":'&#39;'}[c]));
}

const views = { cycle:renderCycle, ops:renderOps, notes:renderNotes, hold:renderHold, house:renderHouse, board:renderBoard, wire:renderWire };

function render(){
  document.querySelectorAll(".nav button").forEach(b => b.classList.toggle("on", b.dataset.view===view));
  if (game && view !== "house") { clearInterval(game.tick); }
  views[view]();
  document.getElementById("footLeft").textContent = "HALLOW // " + view + " // visits " + state.visits;
}

document.getElementById("nav").onclick = (e) => {
  const b = e.target.closest("button[data-view]");
  if (!b) return;
  view = b.dataset.view; dossier = null; render();
};
stage.addEventListener("click", (e) => {
  const go = e.target.closest("[data-go]");
  if (go) { view = go.dataset.go; render(); }
});
document.addEventListener("keydown", (e) => {
  const map = { "1":"cycle", "2":"ops", "3":"notes", "4":"hold", "5":"house", "6":"board", "7":"wire" };
  if (map[e.key]) { view = map[e.key]; dossier = null; render(); return; }
  if (view==="house" && game) {
    if (e.key==="ArrowUp"||e.key==="w") { e.preventDefault(); moveYou(0,-1); }
    if (e.key==="ArrowDown"||e.key==="s") { e.preventDefault(); moveYou(0,1); }
    if (e.key==="ArrowLeft"||e.key==="a") { e.preventDefault(); moveYou(-1,0); }
    if (e.key==="ArrowRight"||e.key==="d") { e.preventDefault(); moveYou(1,0); }
  }
});

function tickClock(){
  const n = new Date();
  document.getElementById("clock").textContent = n.toLocaleTimeString("en-GB",{hour12:false}) + " BST";
}
setInterval(tickClock, 1000); tickClock();
render();
