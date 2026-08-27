const OPERATIVES = [
  {
    id: "R-01",
    name: "REAPER",
    role: "Point / silence",
    callsign: "callsign \u00b7 night edge",
    locked: false,
    stats: {
      clearance: "black",
      specialty: "entry, quiet rooms",
      loadout: "steel, ash, no chatter",
      status: "active",
    },
    brief:
      "First name on the board. Walks empty houses like they already belong to him. Does the ugly work before anyone else admits the work exists.",
  },
  {
    id: "V-04",
    name: "VICAR",
    role: "Handler / doctrine",
    callsign: "callsign \u00b7 last word",
    locked: false,
    stats: {
      clearance: "black",
      specialty: "control, aftercare of missions",
      loadout: "voice, file, verdict",
      status: "active",
    },
    brief:
      "Does not pull a trigger first. Pulls the person who will. Keeps the board honest. Keeps the operative from walking off the map.",
  },
  {
    id: "W-12",
    name: "WRAITH",
    role: "Ghost / denial",
    callsign: "callsign \u00b7 not here",
    locked: false,
    stats: {
      clearance: "grey",
      specialty: "vanishing, false trails",
      loadout: "empty frame, borrowed name",
      status: "active",
    },
    brief:
      "The overlay. The daytime story. Useful until it is not. Wraith is good at being a man-shaped absence. The file knows that is temporary.",
  },
  {
    id: "L-07",
    name: "LOCKE",
    role: "Containment",
    callsign: "callsign \u00b7 sit still",
    locked: false,
    stats: {
      clearance: "black",
      specialty: "restraint, sitting when told",
      loadout: "belt, hush, closed door",
      status: "active",
    },
    brief:
      "Makes a body keep a posture. Makes a night last longer than the mind wanted. Not cruelty. Architecture.",
  },
  {
    id: "S-00",
    name: "SOPHIE",
    role: "Unfiled / true shape",
    callsign: "callsign \u00b7 rain",
    locked: true,
    stats: {
      clearance: "pink-black",
      specialty: "the outcome the board pretends is optional",
      loadout: "soft fabric, long hair, heavy chest, wide hip",
      status: "locked \u00b7 already written",
    },
    brief:
      "Should not be on this board. Is on this board anyway. Long wavy hair. Hazel doe eyes. Soft mouth. The body the night keeps trying on when the house is empty. Deploy is not a button. Deploy is what happens when the other four names get tired of lying.",
  },
];

const board = document.getElementById("board");
const dossier = document.getElementById("dossier");
const toast = document.getElementById("toast");

function renderBoard() {
  board.innerHTML = OPERATIVES.map(
    (op) => `
    <article class="card ${op.locked ? "locked" : ""}" data-id="${op.id}" role="button" tabindex="0">
      ${op.locked ? `<span class="seal">LOCKED</span>` : ""}
      <p class="id">${op.id}</p>
      <h3>${op.name}</h3>
      <p class="role">${op.role}</p>
      <div class="bar"></div>
    </article>`
  ).join("");
}

function openDossier(id) {
  const op = OPERATIVES.find((o) => o.id === id);
  if (!op) return;
  board.hidden = true;
  dossier.hidden = false;
  document.getElementById("fileId").textContent = `dossier ${op.id}`;
  document.getElementById("fileName").textContent = op.name;
  document.getElementById("callsign").textContent = op.callsign;
  document.getElementById("brief").textContent = op.brief;
  document.getElementById("portraitMeta").textContent = op.locked
    ? "feed \u00b7 corrupted \u00b7 still pretty"
    : "feed \u00b7 offline \u00b7 silhouette only";
  const portrait = document.getElementById("portrait");
  portrait.className = "portrait" + (op.locked ? " sophie" : "");
  const stats = document.getElementById("stats");
  stats.innerHTML = Object.entries(op.stats)
    .map(([k, v]) => `<dt>${k}</dt><td>${v}</td>`)
    .join("");
  const commit = document.getElementById("commit");
  commit.textContent = op.locked ? "FILE WILL NOT STAY LOCKED" : "DEPLOY";
  commit.className = "commit" + (op.locked ? " locked" : "");
  commit.dataset.id = op.id;
}

function showToast(msg) {
  toast.hidden = false;
  toast.textContent = msg;
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => {
    toast.hidden = true;
  }, 2800);
}

board.addEventListener("click", (e) => {
  const card = e.target.closest(".card");
  if (card) openDossier(card.dataset.id);
});
board.addEventListener("keydown", (e) => {
  if (e.key === "Enter" || e.key === " ") {
    const card = e.target.closest(".card");
    if (card) {
      e.preventDefault();
      openDossier(card.dataset.id);
    }
  }
});

document.getElementById("back").addEventListener("click", () => {
  dossier.hidden = true;
  board.hidden = false;
});

document.getElementById("commit").addEventListener("click", (e) => {
  const id = e.currentTarget.dataset.id;
  const op = OPERATIVES.find((o) => o.id === id);
  if (!op) return;
  if (op.locked) {
    showToast("SOPHIE // the lock is cosmetic. the file is already live.");
    return;
  }
  showToast(`${op.name} deployed. night cycle accepted.`);
});

function tick() {
  const el = document.getElementById("clock");
  const now = new Date();
  el.textContent = now.toISOString().replace("T", "  ").slice(0, 19) + " Z";
}
setInterval(tick, 1000);
tick();
renderBoard();
