class PhysicsMelodyBuilder {
  constructor() {
    this.notes = [];
    this.rootNote = "C";
    this.scaleType = "major";
    this.currentInstrument = "violin";
    this.currentCategory = "strings";
    this.instruments = {};

    this.instrumentLibrary = this.createInstrumentLibrary();
    this.initializeApp();
  }

  createInstrumentLibrary() {
    return {
      strings: {
        violin: {
          description:
            "String instrument played with a bow - produces rich harmonic content",
          createSynth: () => this.createViolin(),
          waveformColor: "#e74c3c",
        },
        cello: {
          description: "Lower string instrument - warmer, darker tone",
          createSynth: () => this.createCello(),
          waveformColor: "#c0392b",
        },
        harp: {
          description: "Plucked string instrument - bell-like, decaying tone",
          createSynth: () => this.createHarp(),
          waveformColor: "#d35400",
        },
      },
      woodwinds: {
        flute: {
          description: "Air instrument - pure, breathy tone with few harmonics",
          createSynth: () => this.createFlute(),
          waveformColor: "#27ae60",
        },
        clarinet: {
          description:
            "Single reed woodwind - warm, woody tone with odd harmonics",
          createSynth: () => this.createClarinet(),
          waveformColor: "#16a085",
        },
        saxophone: {
          description:
            "Single reed brass-like instrument - bright, expressive tone",
          createSynth: () => this.createSaxophone(),
          waveformColor: "#1abc9c",
        },
      },
      brass: {
        trumpet: {
          description: "Bright brass instrument - piercing, brilliant tone",
          createSynth: () => this.createTrumpet(),
          waveformColor: "#f39c12",
        },
        trombone: {
          description: "Slide brass instrument - smooth, mellow tone",
          createSynth: () => this.createTrombone(),
          waveformColor: "#e67e22",
        },
        frenchHorn: {
          description: "Conical brass instrument - warm, mellow tone",
          createSynth: () => this.createFrenchHorn(),
          waveformColor: "#d35400",
        },
      },
    };
  }

  // String Instruments
  createViolin() {
    // Violin: Multiple oscillators for rich harmonic content
    const synth = new Tone.PolySynth(Tone.Synth, {
      oscillator: {
        type: "sawtooth",
        partials: [1, 0.5, 0.3, 0.2, 0.1], // Rich harmonic content
      },
      envelope: {
        attack: 0.1, // Slow attack like bowing
        decay: 0.2,
        sustain: 0.6,
        release: 0.5,
      },
      volume: -8,
    }).toDestination();

    // Add some vibrato for realism
    const vibrato = new Tone.Vibrato(5, 0.2).toDestination();
    synth.connect(vibrato);

    return synth;
  }

  createCello() {
    // Cello: Darker, warmer tone with low frequencies emphasized
    const synth = new Tone.MonoSynth({
      oscillator: {
        type: "sawtooth",
        partials: [1, 0.4, 0.2, 0.1], // Fewer high harmonics
      },
      envelope: {
        attack: 0.15, // Slower attack
        decay: 0.3,
        sustain: 0.7,
        release: 0.6,
      },
      filter: {
        type: "lowpass",
        frequency: 800, // Darker tone
        rolloff: -12,
      },
      volume: -6,
    }).toDestination();

    return synth;
  }

  createHarp() {
    // Harp: Plucked, bell-like sound
    const synth = new Tone.MonoSynth({
      oscillator: {
        type: "sine",
      },
      envelope: {
        attack: 0.001, // Very fast attack
        decay: 0.5, // Long decay
        sustain: 0, // No sustain - plucked instrument
        release: 1.0, // Long release
      },
      volume: -10,
    }).toDestination();

    return synth;
  }

  // Woodwind Instruments
  createFlute() {
    // Flute: Pure tone with breath noise
    const synth = new Tone.MonoSynth({
      oscillator: {
        type: "sine", // Pure tone
        modulationType: "square", // Add some character
        modulationIndex: 0.2,
      },
      envelope: {
        attack: 0.1, // Gentle attack
        decay: 0.2,
        sustain: 0.7,
        release: 0.3,
      },
      volume: -12,
    }).toDestination();

    // Add some "breath" noise
    const noise = new Tone.Noise("pink").start();
    const filter = new Tone.Filter(2000, "lowpass").toDestination();
    noise.connect(filter);
    noise.volume.value = -30;

    return synth;
  }

  createClarinet() {
    // Clarinet: Odd harmonics (square wave characteristic)
    const synth = new Tone.MonoSynth({
      oscillator: {
        type: "square", // Odd harmonics
        width: 0.5,
      },
      envelope: {
        attack: 0.05, // Quick attack
        decay: 0.3,
        sustain: 0.6,
        release: 0.4,
      },
      volume: -8,
    }).toDestination();

    return synth;
  }

  createSaxophone() {
    // Saxophone: Bright, expressive with some growl
    const synth = new Tone.MonoSynth({
      oscillator: {
        type: "sawtooth",
        partials: [1, 0.8, 0.6, 0.4, 0.2], // Bright harmonics
      },
      envelope: {
        attack: 0.1, // Moderate attack
        decay: 0.2,
        sustain: 0.8,
        release: 0.3,
      },
      filter: {
        type: "bandpass",
        frequency: 1200,
        Q: 1,
      },
      volume: -6,
    }).toDestination();

    return synth;
  }

  // Brass Instruments
  createTrumpet() {
    // Trumpet: Bright, brassy with fast attack
    const synth = new Tone.MonoSynth({
      oscillator: {
        type: "sawtooth",
        partials: [1, 0.9, 0.8, 0.7, 0.6, 0.5], // Very bright
      },
      envelope: {
        attack: 0.01, // Very fast attack
        decay: 0.2,
        sustain: 0.8,
        release: 0.2,
      },
      filter: {
        type: "highpass",
        frequency: 500, // Emphasize high frequencies
        rolloff: -12,
      },
      volume: -4,
    }).toDestination();

    return synth;
  }

  createTrombone() {
    // Trombone: Mellow brass with slide characteristic
    const synth = new Tone.MonoSynth({
      oscillator: {
        type: "sawtooth",
        partials: [1, 0.6, 0.4, 0.2], // Fewer high harmonics
      },
      envelope: {
        attack: 0.05, // Moderate attack
        decay: 0.3,
        sustain: 0.7,
        release: 0.4,
      },
      filter: {
        type: "lowpass",
        frequency: 600, // Mellow tone
        rolloff: -12,
      },
      volume: -6,
    }).toDestination();

    // Add slight portamento for slide effect
    synth.portamento = 0.05;

    return synth;
  }

  createFrenchHorn() {
    // French Horn: Warm, mellow conical brass
    const synth = new Tone.MonoSynth({
      oscillator: {
        type: "sawtooth",
        partials: [1, 0.5, 0.3, 0.1], // Dark tone
      },
      envelope: {
        attack: 0.15, // Slow attack
        decay: 0.4,
        sustain: 0.6,
        release: 0.5,
      },
      filter: {
        type: "lowpass",
        frequency: 400, // Very mellow
        rolloff: -12,
      },
      volume: -8,
    }).toDestination();

    return synth;
  }

  initializeApp() {
    this.createInstrumentSelector();
    this.createKeyboard();
    this.setupEventListeners();
    this.updateRecommendedNotes();
    this.updateInstrument();
    this.updateInstrumentInfo();
  }

  createInstrumentSelector() {
    const categorySelect = document.getElementById("instrument-category");
    const instrumentSelect = document.getElementById("instrument-type");

    // Populate categories
    Object.keys(this.instrumentLibrary).forEach((category) => {
      const option = document.createElement("option");
      option.value = category;
      option.textContent = this.formatName(category);
      categorySelect.appendChild(option);
    });

    // Populate instruments for initial category
    this.updateInstrumentOptions();

    categorySelect.addEventListener("change", (e) => {
      this.currentCategory = e.target.value;
      this.updateInstrumentOptions();
      this.updateInstrument();
      this.updateInstrumentInfo();
    });

    instrumentSelect.addEventListener("change", (e) => {
      this.currentInstrument = e.target.value;
      this.updateInstrument();
      this.updateInstrumentInfo();
    });
  }

  updateInstrumentOptions() {
    const instrumentSelect = document.getElementById("instrument-type");
    const instruments = this.instrumentLibrary[this.currentCategory];

    instrumentSelect.innerHTML = "";
    Object.keys(instruments).forEach((key) => {
      const option = document.createElement("option");
      option.value = key;
      option.textContent = this.formatName(key);
      instrumentSelect.appendChild(option);
    });

    // Set first instrument as default
    this.currentInstrument = Object.keys(instruments)[0];
  }

  updateInstrument() {
    const instrumentConfig =
      this.instrumentLibrary[this.currentCategory][this.currentInstrument];

    // Remove all instrument mode classes
    document.body.classList.remove(
      "strings-mode",
      "woodwinds-mode",
      "brass-mode",
      "synthetic-mode"
    );

    // Add current instrument mode class
    document.body.classList.add(`${this.currentCategory}-mode`);

    // ... rest of your updateInstrument code ...
  }

  updateInstrumentInfo() {
    // Create or update instrument info display
    let infoPanel = document.querySelector(".instrument-info");
    if (!infoPanel) {
      infoPanel = document.createElement("div");
      infoPanel.className = "instrument-info";
      document.querySelector(".controls").after(infoPanel);
    }

    const categoryInfo = this.instrumentLibrary[this.currentCategory];
    const instrumentConfig = categoryInfo[this.currentInstrument];
    const instrumentName = this.formatInstrumentName(this.currentInstrument);
    const categoryName = this.formatInstrumentName(this.currentCategory);

    // Create a badge based on instrument family
    const badgeClass = `${this.currentCategory}-badge`;

    infoPanel.innerHTML = `
            <h4>${instrumentName} <span class="instrument-badge ${badgeClass}">${categoryName}</span></h4>
            <p>${categoryInfo.description}</p>
            <p><small>${instrumentConfig.description || ""}</small></p>
            <small>Envelope: A${instrumentConfig.attack || 0.1} D${
      instrumentConfig.decay || 0.3
    } 
        S${instrumentConfig.sustain || 0.6} R${
      instrumentConfig.release || 0.5
    }</small>`;
  }

  getCurrentSynth() {
    if (
      this.instruments[this.currentCategory] &&
      this.instruments[this.currentCategory][this.currentInstrument]
    ) {
      return this.instruments[this.currentCategory][this.currentInstrument];
    }
    return null;
  }

  formatName(name) {
    return name
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase());
  }

  // Keep the rest of your existing methods (getNoteFrequencies, createKeyboard, etc.)
  // but update the playNote method:

  playNote(frequency) {
    const synth = this.getCurrentSynth();
    if (synth) {
      // Different synths have different trigger methods
      if (synth.triggerAttackRelease) {
        synth.triggerAttackRelease(frequency, "8n");
      } else if (synth.triggerAttack) {
        synth.triggerAttack(frequency);
        setTimeout(() => {
          synth.triggerRelease();
        }, 300);
      }
    }
    this.updatePhysicsInfo(frequency);
  }

  // Update the drawWaveform method to use the instrument's color:
  drawWaveform(ctx, frequency, width, height) {
    const instrumentConfig =
      this.instrumentLibrary[this.currentCategory][this.currentInstrument];

    ctx.beginPath();
    ctx.moveTo(0, height / 2);

    const amplitude = height / 3;
    const cycles = 4;

    for (let x = 0; x < width; x++) {
      const normalizedX = (x / width) * cycles * Math.PI * 2;
      let y = height / 2;

      // Draw waveform based on instrument type
      const instrumentName = this.currentInstrument.toLowerCase();

      if (
        instrumentName.includes("violin") ||
        instrumentName.includes("cello") ||
        instrumentName.includes("saxophone") ||
        instrumentName.includes("trumpet") ||
        instrumentName.includes("trombone") ||
        instrumentName.includes("frenchhorn")
      ) {
        // Sawtooth-like instruments
        y += (((normalizedX / (2 * Math.PI)) % 1) * 2 - 1) * amplitude;
      } else if (
        instrumentName.includes("clarinet") ||
        instrumentName.includes("bright")
      ) {
        // Square-like instruments
        y +=
          (Math.sin(normalizedX * (frequency / 261.63)) > 0 ? 1 : -1) *
          amplitude *
          0.8;
      } else if (
        instrumentName.includes("harp") ||
        instrumentName.includes("flute")
      ) {
        // Sine-like instruments
        y += Math.sin(normalizedX * (frequency / 261.63)) * amplitude;
      } else {
        y += Math.sin(normalizedX * (frequency / 261.63)) * amplitude;
      }

      ctx.lineTo(x, y);
    }

    // Use instrument's specific color
    ctx.strokeStyle = instrumentConfig.waveformColor;
    ctx.lineWidth = 3;
    ctx.stroke();

    // Add labels
    ctx.fillStyle = "#2c3e50";
    ctx.font = "bold 16px Arial";
    ctx.fillText(
      `${this.formatName(this.currentInstrument)} - ${frequency.toFixed(1)} Hz`,
      20,
      30
    );

    // Add waveform type
    let waveType = "Complex";
    if (
      this.currentInstrument.includes("flute") ||
      this.currentInstrument.includes("harp")
    ) {
      waveType = "Sine-like";
    } else if (this.currentInstrument.includes("clarinet")) {
      waveType = "Square-like";
    } else {
      waveType = "Sawtooth-like";
    }
    ctx.fillText(`Waveform: ${waveType}`, width - 200, 30);
  }
}
