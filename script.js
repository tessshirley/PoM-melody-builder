class PhysicsMelodyBuilder {
    constructor() {
        this.notes = [];
        this.rootNote = 'C';
        this.scaleType = 'major';
        this.synth = new Tone.Synth({
            oscillator: { type: 'sine' },
            envelope: { attack: 0.01, decay: 0.1, sustain: 0.5, release: 0.5 }
        }).toDestination();
        
        this.initializeApp();
    }

    initializeApp() {
        this.createKeyboard();
        this.setupEventListeners();
        this.updateRecommendedNotes();
    }

    getNoteFrequencies() {
        // Frequencies for one octave (C4 to B4)
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
        this.synth.triggerAttackRelease(frequency, "8n");
        this.updatePhysicsInfo(frequency);
    }

    updatePhysicsInfo(frequency) {
        const speedOfSound = 343; // m/s at 20°C
        const wavelength = speedOfSound / frequency;
        const period = (1 / frequency) * 1000; // ms
        
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
        ctx.beginPath();
        ctx.moveTo(0, height / 2);
        
        const amplitude = height / 3;
        const cycles = 4;
        
        for (let x = 0; x < width; x++) {
            const normalizedX = (x / width) * cycles * Math.PI * 2;
            const y = height / 2 + Math.sin(normalizedX * (frequency / 261.63)) * amplitude;
            ctx.lineTo(x, y);
        }
        
        ctx.strokeStyle = '#e74c3c';
        ctx.lineWidth = 3;
        ctx.stroke();
        
        // Add labels
        ctx.fillStyle = '#2c3e50';
        ctx.font = 'bold 16px Arial';
        ctx.fillText(`Frequency: ${frequency.toFixed(1)} Hz`, 20, 30);
        ctx.fillText(`Waveform Preview`, width - 150, 30);
    }

    playMelody() {
        if (this.notes.length === 0) return;
        
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