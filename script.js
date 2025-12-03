// script.js — PURE SINE MODE + FULLY SIMPLIFIED UI
// Minimal interface, simple keyboard input, pure sine synthesis, clean waveform visualizer

let synth, analyser, canvas, ctx;
const activeNotes = {};

window.addEventListener("DOMContentLoaded", async () => {
  canvas = document.getElementById("waveformCanvas");
  ctx = canvas.getContext("2d");

  // --- Pure sine wave poly synth ---
  analyser = new Tone.Analyser("waveform", 1024);

  synth = new Tone.PolySynth(Tone.Synth, {
    oscillator: { type: "sine" },
    envelope: { attack: 0.01, decay: 0.1, sustain: 0.9, release: 0.3 }
  }).toDestination();

  synth.connect(analyser);

  setupKeyboard();
  drawWaveform();

  await Tone.start();
});

// --- Simple letter → note mapping ---
const keyToNote = {
  a: "C4",
  s: "D4",
  d: "E4",
  f: "F4",
  g: "G4",
  h: "A4",
  j: "B4",
  k: "C5"
};

function setupKeyboard() {
  document.addEventListener("keydown", (e) => {
    const key = e.key.toLowerCase();
    if (!keyToNote[key] || activeNotes[key]) return;

    activeNotes[key] = true;
    synth.triggerAttack(keyToNote[key]);
  });

  document.addEventListener("keyup", (e) => {
    const key = e.key.toLowerCase();
    if (!keyToNote[key]) return;

    activeNotes[key] = false;
    synth.triggerRelease(keyToNote[key]);
  });
}

// --- Waveform visualization ---
function drawWaveform() {
  const values = analyser.getValue();

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.beginPath();

  const sliceWidth = canvas.width / values.length;
  let x = 0;

  for (let i = 0; i < values.length; i++) {
    const y = (values[i] + 1) * 0.5 * canvas.height;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
    x += sliceWidth;
  }

  ctx.lineWidth = 2;
  ctx.strokeStyle = "black";
  ctx.stroke();

  requestAnimationFrame(drawWaveform);
}

// --- Reset/Stop function ---
function clearAll() {
  synth.releaseAll();
  for (const key in activeNotes) activeNotes[key] = false;
}
