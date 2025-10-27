class PhysicsMelodyBuilder {
    constructor() {
        this.notes = [];
        this.rootNote = 'C';
        this.scaleType = 'major';
        this.currentInstrument = 'violin';
        this.currentCategory = 'strings';
        this.synth = null;
        
        this.instrumentLibrary = this.createInstrumentLibrary();
        this.initializeApp();
    }

    createInstrumentLibrary() {
        return {
            strings: {
                violin: { type: 'sawtooth', attack: 0.1, decay: 0.3, sustain: 0.6, release: 0.5 },
                cello: { type: 'sawtooth', attack: 0.2, decay: 0.4, sustain: 0.7, release: 0.6, filter: { frequency: 400 } },
                harp: { type: 'sine', attack: 0.01, decay: 0.5, sustain: 0.3, release: 1.0 },
                description: "String instruments produce sound through vibrating strings"
            },
            woodwinds: {
                flute: { type: 'sine', attack: 0.1, decay: 0.2, sustain: 0.7, release: 0.3 },
                clarinet: { type: 'square', attack: 0.05, decay: 0.3, sustain: 0.6, release: 0.4 },
                saxophone: { type: 'sawtooth', attack: 0.1, decay: 0.2, sustain: 0.8, release: 0.3, filter: { frequency: 800 } },
                description: "Woodwinds use air vibration in tubes with reeds or openings"
            },
            brass: {
                trumpet: { type: 'sawtooth', attack: 0.05, decay: 0.2, sustain: 0.8, release: 0.2, filter: { frequency: 1200 } },
                trombone: { type: 'sawtooth', attack: 0.1, decay: 0.3, sustain: 0.7, release: 0.4, filter: { frequency: 300 } },
                frenchHorn: { type: 'sawtooth', attack: 0.15, decay: 0.4, sustain: 0.6, release: 0.5, filter: { frequency: 500 } },
                description: "Brass instruments use lip vibration and long metal tubes"
            },
            synthetic: {
                basic: { type: 'sine', attack: 0.01, decay: 0.1, sustain: 0.7, release: 0.3 },
                warm: { type: 'triangle', attack: 0.1, decay: 0.3, sustain: 0.6, release: 0.8 },
                bright: { type: 'square', attack: 0.01, decay: 0.1, sustain: 0.8, release: 0.1, filter: { frequency: 1500 } },
                description: "Synthetic tones demonstrate pure waveform characteristics"
            }
        };
    }

    initializeApp() {
        this.createInstrumentSelector();
        this.createKeyboard();
        this.setupEventListeners();
        this.updateRecommendedNotes();
        this.updateInstrumentInfo();
    }

    createInstrumentSelector() {
        const categorySelect = document.getElementById('instrument-category');
        const instrumentSelect = document.getElementById('instrument-type');
        
        // Populate instrument select based on initial category
        this.updateInstrumentOptions();
        
        categorySelect.addEventListener('change', (e) => {
            this.currentCategory = e.target.value;
            this.updateInstrumentOptions();
            this.updateInstrument();
            this.updateInstrumentInfo();
        });
        
        instrumentSelect.addEventListener('change', (e) => {
            this.currentInstrument = e.target.value;
            this.updateInstrument();
            this.updateInstrumentInfo();
        });
    }

    updateInstrumentOptions() {
        const instrumentSelect = document.getElementById('instrument-type');
        const instruments = this.instrumentLibrary[this.currentCategory];
        
        instrumentSelect.innerHTML = '';
        Object.keys(instruments).forEach(key => {
            if (key !== 'description') {
                const option = document.createElement('option');
                option.value = key;
                option.textContent = this.formatInstrumentName(key);
                instrumentSelect.appendChild(option);
            }
        });
        
        // Set the first instrument as default
        this.currentInstrument = Object.keys(instruments)[0];
    }

    formatInstrumentName(name) {
        return name.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
    }

    updateInstrument() {
        const instrumentConfig = this.instrumentLibrary[this.currentCategory][this.currentInstrument];
        
        // Dispose of old synth if it exists
        if (this.synth) {
            this.synth.dispose();
        }
        
        // Create new synth with instrument settings
        this.synth = new Tone.Synth({
            oscillator: { type: instrumentConfig.type },
            envelope: {
                attack: instrumentConfig.attack,
                decay: instrumentConfig.decay,
                sustain: instrumentConfig.sustain,
                release: instrumentConfig.release
            }
        }).toDestination();
        
        // Apply filter if specified
        if (instrumentConfig.filter) {
            const filter = new Tone.Filter(instrumentConfig.filter).toDestination();
            this.synth.connect(filter);
        }
    }

    updateInstrumentInfo() {
        // Create or update instrument info display
        let infoPanel = document.querySelector('.instrument-info');
        if (!infoPanel) {
            infoPanel = document.createElement('div');
            infoPanel.className = 'instrument-info';
            document.querySelector('.controls').after(infoPanel);
        }
        
        const categoryInfo = this.instrumentLibrary[this.currentCategory];
        const instrumentName = this.formatInstrumentName(this.currentInstrument);
        const categoryName = this.formatInstrumentName(this.currentCategory);
        
        infoPanel.innerHTML = `
            <h4>${instrumentName} (${categoryName})</h4>
            <p>${categoryInfo.description}</p>
            <small>Waveform: ${this.instrumentLibrary[this.currentCategory][this.currentInstrument].type}</small>
        `;
    }

    getNoteFrequencies() {
        return {
            'C4': 261.63, 'D4': 293.66, 'E4': 329.63, 'F4': 349.23,
            'G4': 392.00, 'A4': 440.00, 'B4': 493.88,
            'C5': 523.25, 'D5': 587.33, 'E5': 659.25, 'F5': 698.46,
            'G5': 783.99, 'A5': 880.00, 'B5': 987.77
        };
    }

    getScalePatterns() {
        return {
            'major': [0, 2, 4, 5, 7, 9, 11],
            'minor': [0, 2, 3, 5, 7, 8, 10],
            'pentatonic': [0, 2, 4, 7, 9]
        };
    }

    createKeyboard() {
        const keyboard = document.getElementById('keyboard');
        const frequencies = this.getNoteFrequencies();
        
        keyboard.innerHTML = '';
        Object.keys(frequencies).forEach(note => {
            const btn = document.createElement('button');
            btn.className = 'note-btn';
            btn.textContent = note;
            btn.dataset.note = note;
            btn.dataset.frequency = frequencies[note];
            
            btn.addEventListener('click', () => this.addNote(note, frequencies[note]));
            keyboard.appendChild(btn);
        });
    }

    addNote(note, frequency) {
        this.notes.push({ note, frequency, time: new Date() });
        this.playNote(frequency);
        this.updateVisualization();
        this.updateMelodyDisplay();
        this.updateNoteButtons();
    }

    playNote(frequency) {
        if (this.synth) {
            this.synth.triggerAttackRelease(frequency, "8n");
        }
        this.updatePhysicsInfo(frequency);
    }

    updatePhysicsInfo(frequency) {
        const speedOfSound = 343;
        const wavelength = speedOfSound / frequency;
        const period = (1 / frequency) * 1000;
        
        document.getElementById('frequency').textContent = `${frequency.toFixed(2)} Hz`;
        document.getElementById('wavelength').textContent = `${wavelength.toFixed(2)} m`;
        document.getElementById('period').textContent = `${period.toFixed(2)} ms`;
    }

    updateRecommendedNotes() {
        const scalePattern = this.getScalePatterns()[this.scaleType];
        const allNotes = Object.keys(this.getNoteFrequencies());
        const rootNotes = allNotes.filter(note => note.startsWith(this.rootNote));
        
        if (rootNotes.length === 0) return;
        
        const rootNote = rootNotes[0];
        const rootIndex = allNotes.indexOf(rootNote);
        
        const recommendedNotes = scalePattern.map(interval => {
            const noteIndex = (rootIndex + interval) % allNotes.length;
            return allNotes[noteIndex];
        });

        document.querySelectorAll('.note-btn').forEach(btn => {
            const isRecommended = recommendedNotes.includes(btn.dataset.note);
            btn.classList.toggle('recommended', isRecommended);
        });
    }

    updateNoteButtons() {
        document.querySelectorAll('.note-btn').forEach(btn => {
            const isActive = this.notes.some(noteObj => noteObj.note === btn.dataset.note);
            btn.classList.toggle('active', isActive);
        });
    }

    updateMelodyDisplay() {
        const display = document.getElementById('melody-notes');
        if (this.notes.length === 0) {
            display.textContent = 'No notes yet...';
            return;
        }
        
        const noteNames = this.notes.map(noteObj => noteObj.note);
        display.textContent = noteNames.join(' → ');
    }

    updateVisualization() {
        const canvas = document.getElementById('waveform-canvas');
        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;
        
        ctx.clearRect(0, 0, width, height);
        
        if (this.notes.length === 0) return;
        
        const lastNote = this.notes[this.notes.length - 1];
        this.drawWaveform(ctx, lastNote.frequency, width, height);
    }

    drawWaveform(ctx, frequency, width, height) {
        const instrumentConfig = this.instrumentLibrary[this.currentCategory][this.currentInstrument];
        
        ctx.beginPath();
        ctx.moveTo(0, height / 2);
        
        const amplitude = height / 3;
        const cycles = 4;
        
        for (let x = 0; x < width; x++) {
            const normalizedX = (x / width) * cycles * Math.PI * 2;
            let y = height / 2;
            
            // Draw different waveforms based on instrument type
            switch(instrumentConfig.type) {
                case 'sine':
                    y += Math.sin(normalizedX * (frequency / 261.63)) * amplitude;
                    break;
                case 'sawtooth':
                    y += ((normalizedX / (2 * Math.PI)) % 1) * 2 - 1 * amplitude;
                    break;
                case 'square':
                    y += (Math.sin(normalizedX * (frequency / 261.63)) > 0 ? 1 : -1) * amplitude * 0.8;
                    break;
                case 'triangle':
                    y += (Math.asin(Math.sin(normalizedX * (frequency / 261.63))) / (Math.PI/2)) * amplitude;
                    break;
            }
            
            ctx.lineTo(x, y);
        }
        
        ctx.strokeStyle = this.getWaveformColor();
        ctx.lineWidth = 3;
        ctx.stroke();
        
        // Add labels
        ctx.fillStyle = '#2c3e50';
        ctx.font = 'bold 16px Arial';
        ctx.fillText(`${this.formatInstrumentName(this.currentInstrument)} - ${frequency.toFixed(1)} Hz`, 20, 30);
        ctx.fillText(`Waveform: ${instrumentConfig.type}`, width - 200, 30);
    }

    getWaveformColor() {
        const colors = {
            'strings': '#e74c3c',
            'woodwinds': '#27ae60', 
            'brass': '#f39c12',
            'synthetic': '#9b59b6'
        };
        return colors[this.currentCategory] || '#3498db';
    }

    playMelody() {
        if (this.notes.length === 0 || !this.synth) return;
        
        const now = Tone.now();
        this.notes.forEach((note, index) => {
            this.synth.triggerAttackRelease(note.frequency, "8n", now + index * 0.3);
        });
    }

    clearMelody() {
        this.notes = [];
        this.updateVisualization();
        this.updateMelodyDisplay();
        this.updateNoteButtons();
        document.getElementById('frequency').textContent = '-- Hz';
        document.getElementById('wavelength').textContent = '-- m';
        document.getElementById('period').textContent = '-- ms';
    }

    setupEventListeners() {
        document.getElementById('root-note').addEventListener('change', (e) => {
            this.rootNote = e.target.value;
            this.updateRecommendedNotes();
        });

        document.getElementById('scale-type').addEventListener('change', (e) => {
            this.scaleType = e.target.value;
            this.updateRecommendedNotes();
        });

        document.getElementById('play-btn').addEventListener('click', () => {
            this.playMelody();
        });

        document.getElementById('clear-btn').addEventListener('click', () => {
            this.clearMelody();
        });
    }
}

// Initialize when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new PhysicsMelodyBuilder();
});