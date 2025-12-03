class PhysicsMelodyBuilder {
    constructor() {
        this.notes = [];
        this.rootNote = 'C';
        this.scaleType = 'major';
        this.currentInstrument = 'violin';
        this.currentCategory = 'strings';
        this.visualizationMode = 'waveform';
        this.Tone = window.Tone;
        
        this.instrumentLibrary = this.createInstrumentLibrary();
        this.initializeApp();
    }

    createInstrumentLibrary() {
        return {
            strings: {
                violin: {
                    name: "Violin",
                    description: "Rich harmonic series with strong fundamental and harmonics. Real violins have many harmonics due to string vibration modes.",
                    harmonics: [1.0, 2.0, 3.0, 4.0, 5.0, 6.0, 7.0, 8.0],
                    amplitudes: [1.0, 0.7, 0.5, 0.3, 0.2, 0.15, 0.1, 0.05],
                    envelope: { attack: 0.1, decay: 0.2, sustain: 0.6, release: 0.5 },
                    color: '#e74c3c'
                },
                cello: {
                    name: "Cello",
                    description: "Warmer tone with emphasis on lower harmonics. Longer strings produce deeper, resonant tones.",
                    harmonics: [1.0, 2.0, 3.0, 4.0, 5.0],
                    amplitudes: [1.0, 0.8, 0.6, 0.3, 0.2],
                    envelope: { attack: 0.15, decay: 0.3, sustain: 0.7, release: 0.6 },
                    color: '#c0392b'
                },
                harp: {
                    name: "Harp",
                    description: "Bell-like tone with clear, distinct harmonics. Plucked strings produce sharp attacks and long decays.",
                    harmonics: [1.0, 2.0, 3.0, 4.0],
                    amplitudes: [1.0, 0.4, 0.2, 0.1],
                    envelope: { attack: 0.01, decay: 0.5, sustain: 0, release: 1.0 },
                    color: '#d35400'
                }
            },
            woodwinds: {
                flute: {
                    name: "Flute",
                    description: "Nearly pure sine wave with very weak harmonics. Air column vibrations produce clean, breathy tones.",
                    harmonics: [1.0, 2.0, 3.0],
                    amplitudes: [1.0, 0.2, 0.05],
                    envelope: { attack: 0.1, decay: 0.2, sustain: 0.7, release: 0.3 },
                    color: '#27ae60'
                },
                clarinet: {
                    name: "Clarinet",
                    description: "Odd harmonics only (1f, 3f, 5f...) due to cylindrical bore physics. Creates a hollow, woody tone.",
                    harmonics: [1.0, 3.0, 5.0, 7.0, 9.0],
                    amplitudes: [1.0, 0.6, 0.3, 0.15, 0.07],
                    envelope: { attack: 0.05, decay: 0.3, sustain: 0.6, release: 0.4 },
                    color: '#16a085'
                },
                saxophone: {
                    name: "Saxophone",
                    description: "Both even and odd harmonics for rich, complex tone. Conical bore produces bright, expressive sound.",
                    harmonics: [1.0, 2.0, 3.0, 4.0, 5.0, 6.0],
                    amplitudes: [1.0, 0.7, 0.5, 0.3, 0.2, 0.1],
                    envelope: { attack: 0.1, decay: 0.2, sustain: 0.8, release: 0.3 },
                    color: '#1abc9c'
                }
            },
            brass: {
                trumpet: {
                    name: "Trumpet",
                    description: "Bright, brilliant tone with many strong harmonics. Lip vibration excites many vibration modes.",
                    harmonics: [1.0, 2.0, 3.0, 4.0, 5.0, 6.0, 7.0, 8.0],
                    amplitudes: [1.0, 0.9, 0.8, 0.7, 0.6, 0.5, 0.4, 0.3],
                    envelope: { attack: 0.01, decay: 0.2, sustain: 0.8, release: 0.2 },
                    color: '#f39c12'
                },
                trombone: {
                    name: "Trombone",
                    description: "Mellow brass tone with emphasis on first few harmonics. Slide allows smooth frequency transitions.",
                    harmonics: [1.0, 2.0, 3.0, 4.0, 5.0],
                    amplitudes: [1.0, 0.6, 0.4, 0.2, 0.1],
                    envelope: { attack: 0.05, decay: 0.3, sustain: 0.7, release: 0.4 },
                    color: '#e67e22'
                },
                frenchHorn: {
                    name: "French Horn",
                    description: "Warm, mellow tone with conical bore. Hand-stopping technique affects harmonic content.",
                    harmonics: [1.0, 2.0, 3.0, 4.0],
                    amplitudes: [1.0, 0.5, 0.2, 0.1],
                    envelope: { attack: 0.15, decay: 0.4, sustain: 0.6, release: 0.5 },
                    color: '#d35400'
                }
            }
        };
    }

    initializeApp() {
        // Start audio context on first user interaction
        document.addEventListener('click', () => {
            if (this.Tone.context.state !== 'running') {
                this.Tone.context.resume();
            }
        }, { once: true });

        this.createInstrumentSelector();
        this.createKeyboard();
        this.setupEventListeners();
        this.updateInstrumentInfo();
        this.updateVisualizationMode();
    }

    createInstrumentSelector() {
        const categorySelect = document.getElementById('instrument-category');
        const instrumentSelect = document.getElementById('instrument-type');
        
        // Populate categories
        Object.keys(this.instrumentLibrary).forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = this.formatName(category);
            categorySelect.appendChild(option);
        });
        
        // Populate instruments for initial category
        this.updateInstrumentOptions();
        
        // Event listeners
        categorySelect.addEventListener('change', (e) => {
            this.currentCategory = e.target.value;
            this.updateInstrumentOptions();
            this.updateInstrumentInfo();
            this.updateVisualization();
        });
        
        instrumentSelect.addEventListener('change', (e) => {
            this.currentInstrument = e.target.value;
            this.updateInstrumentInfo();
            this.updateVisualization();
        });
    }

    updateInstrumentOptions() {
        const instrumentSelect = document.getElementById('instrument-type');
        const instruments = this.instrumentLibrary[this.currentCategory];
        
        instrumentSelect.innerHTML = '';
        Object.keys(instruments).forEach(key => {
            const option = document.createElement('option');
            option.value = key;
            option.textContent = instruments[key].name;
            instrumentSelect.appendChild(option);
        });
        
        // Set first instrument as default
        this.currentInstrument = Object.keys(instruments)[0];
    }

    updateInstrumentInfo() {
        const instrumentConfig = this.instrumentLibrary[this.currentCategory][this.currentInstrument];
        
        document.getElementById('current-instrument').textContent = 
            `${instrumentConfig.name} (${this.formatName(this.currentCategory)})`;
        document.getElementById('instrument-description').textContent = 
            instrumentConfig.description;
        
        // Update harmonics count
        document.getElementById('harmonics-count').textContent = 
            `${instrumentConfig.harmonics.length} harmonics`;
    }

    formatName(name) {
        return name.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
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
        
        this.updateRecommendedNotes();
    }

    addNote(note, frequency) {
        this.notes.push({ note, frequency, time: new Date() });
        this.playNote(frequency);
        this.updateVisualization();
        this.updateMelodyDisplay();
        this.updateNoteButtons();
        
        // Visual feedback
        const btn = document.querySelector(`.note-btn[data-note="${note}"]`);
        btn.classList.add('playing');
        setTimeout(() => btn.classList.remove('playing'), 300);
    }

    playNote(frequency) {
        // Create additive synthesis using multiple oscillators
        const instrumentConfig = this.instrumentLibrary[this.currentCategory][this.currentInstrument];
        const now = this.Tone.now();
        const duration = 0.5; // seconds
        
        // Create and play each harmonic
        instrumentConfig.harmonics.forEach((harmonic, index) => {
            const freq = frequency * harmonic;
            const amplitude = instrumentConfig.amplitudes[index];
            
            const osc = new this.Tone.Oscillator(freq, 'sine').toDestination();
            const env = new this.Tone.AmplitudeEnvelope({
                attack: instrumentConfig.envelope.attack,
                decay: instrumentConfig.envelope.decay,
                sustain: instrumentConfig.envelope.sustain,
                release: instrumentConfig.envelope.release
            }).toDestination();
            
            osc.connect(env);
            osc.start(now);
            osc.stop(now + duration);
            env.triggerAttackRelease(duration, now, amplitude * 0.3);
        });
       // Creates multiple sine wave oscillators for each harmonic
      instrumentConfig.harmonics.forEach((harmonic, index) => {
        const freq = frequency * harmonic;  // Calculate harmonic frequency
        const osc = new this.Tone.Oscillator(freq, 'sine').toDestination();
        // Each harmonic is a pure sine wave!
      });
        
        this.updatePhysicsInfo(frequency, instrumentConfig);
    }

    updatePhysicsInfo(frequency, instrumentConfig) {
        const speedOfSound = 343; // m/s at 20°C
        const wavelength = speedOfSound / frequency;
        const period = (1 / frequency) * 1000; // ms
        
        document.getElementById('frequency').textContent = `${frequency.toFixed(2)} Hz`;
        document.getElementById('wavelength').textContent = `${wavelength.toFixed(3)} m`;
        document.getElementById('period').textContent = `${period.toFixed(2)} ms`;
        
        if (instrumentConfig) {
            document.getElementById('harmonics-count').textContent = 
                `${instrumentConfig.harmonics.length} harmonics`;
        }
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
        const noteCount = document.getElementById('note-count');
        const freqRange = document.getElementById('freq-range');
        
        if (this.notes.length === 0) {
            display.textContent = 'No notes yet...';
            noteCount.textContent = '0';
            freqRange.textContent = '-- Hz';
            return;
        }
        
        const noteNames = this.notes.map(noteObj => noteObj.note);
        display.textContent = noteNames.join(' → ');
        noteCount.textContent = this.notes.length;
        
        // Calculate frequency range
        const frequencies = this.notes.map(note => note.frequency);
        const minFreq = Math.min(...frequencies);
        const maxFreq = Math.max(...frequencies);
        freqRange.textContent = `${minFreq.toFixed(0)}-${maxFreq.toFixed(0)} Hz`;
    }

    updateVisualizationMode() {
        const modeRadios = document.querySelectorAll('input[name="vis-mode"]');
        const canvasLabel = document.getElementById('canvas-label');
        
        modeRadios.forEach(radio => {
            radio.addEventListener('change', (e) => {
                this.visualizationMode = e.target.value;
                switch(this.visualizationMode) {
                    case 'waveform':
                        canvasLabel.textContent = 'Waveform Visualization';
                        break;
                    case 'harmonics':
                        canvasLabel.textContent = 'Harmonic Series Analysis';
                        break;
                    case 'interference':
                        canvasLabel.textContent = 'Wave Interference Patterns';
                        break;
                }
                this.updateVisualization();
            });
        });
    }

    updateVisualization() {
        const canvas = document.getElementById('waveform-canvas');
        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;
        
        ctx.clearRect(0, 0, width, height);
        
        if (this.notes.length === 0) {
            this.drawEmptyVisualization(ctx, width, height);
            return;
        }
        
        const lastNote = this.notes[this.notes.length - 1];
        const instrumentConfig = this.instrumentLibrary[this.currentCategory][this.currentInstrument];
        
        switch(this.visualizationMode) {
            case 'waveform':
                this.drawWaveform(ctx, lastNote.frequency, instrumentConfig, width, height);
                break;
            case 'harmonics':
                this.drawHarmonicSeries(ctx, lastNote.frequency, instrumentConfig, width, height);
                break;
            case 'interference':
                if (this.notes.length >= 2) {
                    this.drawInterference(ctx, this.notes[this.notes.length - 2].frequency, 
                                         lastNote.frequency, width, height);
                } else {
                    this.drawWaveform(ctx, lastNote.frequency, instrumentConfig, width, height);
                }
                break;
        }
    }

    drawEmptyVisualization(ctx, width, height) {
        ctx.fillStyle = '#f8f9fa';
        ctx.fillRect(0, 0, width, height);
        
        ctx.strokeStyle = '#bdc3c7';
        ctx.lineWidth = 1;
        ctx.setLineDash([5, 5]);
        
        // Draw grid
        for (let y = 0; y <= height; y += height/4) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(width, y);
            ctx.stroke();
        }
        
        ctx.setLineDash([]);
        
        ctx.fillStyle = '#7f8c8d';
        ctx.font = '24px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('Play a note to see the waveform visualization', width/2, height/2);
        
        ctx.font = '16px Arial';
        ctx.fillStyle = '#95a5a6';
        ctx.fillText('Each instrument produces a unique combination of sine wave harmonics', width/2, height/2 + 40);
    }

    drawWaveform(ctx, frequency, instrumentConfig, width, height) {
        ctx.fillStyle = '#f8f9fa';
        ctx.fillRect(0, 0, width, height);
        
        // Draw grid
        ctx.strokeStyle = '#e0e0e0';
        ctx.lineWidth = 0.5;
        for (let x = 0; x <= width; x += width/8) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, height);
            ctx.stroke();
        }
        for (let y = 0; y <= height; y += height/4) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(width, y);
            ctx.stroke();
        }
        
        // Draw waveform
        ctx.beginPath();
        ctx.moveTo(0, height/2);
        
        const cycles = 4;
        for (let x = 0; x < width; x++) {
            let y = height/2;
            const t = (x / width) * cycles * Math.PI * 2;
            
            // Sum all harmonics
            for (let i = 0; i < instrumentConfig.harmonics.length; i++) {
                const harmonicFreq = frequency * instrumentConfig.harmonics[i];
                const amplitude = (height/4) * instrumentConfig.amplitudes[i];
                y += Math.sin(t * (harmonicFreq / 261.63)) * amplitude;
            }
            
            ctx.lineTo(x, y);
        }
        
        ctx.strokeStyle = instrumentConfig.color;
        ctx.lineWidth = 3;
        ctx.stroke();
        
        // Draw labels
        ctx.fillStyle = '#2c3e50';
        ctx.font = 'bold 18px Arial';
        ctx.textAlign = 'left';
        ctx.fillText(`${instrumentConfig.name} Waveform`, 20, 30);
        ctx.fillText(`${frequency.toFixed(1)} Hz (${this.getNoteName(frequency)})`, 20, 55);
        
        ctx.font = '14px Arial';
        ctx.fillText(`Fundamental + ${instrumentConfig.harmonics.length - 1} harmonics`, width - 200, 30);
    }

    drawHarmonicSeries(ctx, frequency, instrumentConfig, width, height) {
        ctx.fillStyle = '#f8f9fa';
        ctx.fillRect(0, 0, width, height);
        
        const centerY = height/2;
        const barWidth = 15;
        const spacing = 5;
        const maxBars = 10;
        
        // Draw individual harmonic waves at the top
        const waveHeight = 80;
        const waveSpacing = waveHeight / Math.min(instrumentConfig.harmonics.length, 4);
        
        for (let i = 0; i < Math.min(instrumentConfig.harmonics.length, 4); i++) {
            const waveY = 20 + i * waveSpacing;
            const harmonicFreq = frequency * instrumentConfig.harmonics[i];
            const amplitude = waveHeight/4 * instrumentConfig.amplitudes[i];
            
            ctx.beginPath();
            ctx.moveTo(50, waveY);
            
            for (let x = 50; x < 250; x++) {
                const t = ((x - 50) / 200) * Math.PI * 4;
                const y = waveY + Math.sin(t * (harmonicFreq / 261.63)) * amplitude;
                ctx.lineTo(x, y);
            }
            
            ctx.strokeStyle = instrumentConfig.color;
            ctx.lineWidth = 2;
            ctx.stroke();
            
            // Label each harmonic
            ctx.fillStyle = '#2c3e50';
            ctx.font = '12px Arial';
            ctx.fillText(`${instrumentConfig.harmonics[i]}f`, 20, waveY + 5);
        }
        
        // Draw harmonic amplitude bars
        const barStartX = width - 250;
        const barMaxHeight = 100;
        
        for (let i = 0; i < Math.min(instrumentConfig.harmonics.length, maxBars); i++) {
            const barX = barStartX + i * (barWidth + spacing);
            const barHeight = instrumentConfig.amplitudes[i] * barMaxHeight;
            
            // Draw bar
            ctx.fillStyle = instrumentConfig.color;
            ctx.fillRect(barX, centerY - barHeight, barWidth, barHeight);
            
            // Draw frequency label
            ctx.fillStyle = '#2c3e50';
            ctx.font = '11px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(`${instrumentConfig.harmonics[i]}f`, barX + barWidth/2, centerY + 15);
            
            // Draw amplitude percentage
            ctx.fillStyle = '#7f8c8d';
            ctx.font = '10px Arial';
            ctx.fillText(`${Math.round(instrumentConfig.amplitudes[i] * 100)}%`, 
                        barX + barWidth/2, centerY - barHeight - 5);
        }
        
        // Draw title
        ctx.fillStyle = '#2c3e50';
        ctx.font = 'bold 18px Arial';
        ctx.textAlign = 'left';
        ctx.fillText('Harmonic Series Composition', 20, height - 20);
        
        // Draw legend
        ctx.fillStyle = instrumentConfig.color;
        ctx.fillRect(width - 150, 30, 20, 20);
        ctx.fillStyle = '#2c3e50';
        ctx.font = '14px Arial';
        ctx.fillText('Harmonic Amplitude', width - 125, 45);
    }

    drawInterference(ctx, freq1, freq2, width, height) {
        ctx.fillStyle = '#f8f9fa';
        ctx.fillRect(0, 0, width, height);
        
        const centerY = height/2;
        const ratio = freq2 / freq1;
        
        // Draw individual waves
        ctx.beginPath();
        ctx.moveTo(0, centerY);
        for (let x = 0; x < width; x++) {
            const t = (x / width) * Math.PI * 8;
            const y = centerY - 50 + Math.sin(t) * 40;
            ctx.lineTo(x, y);
        }
        ctx.strokeStyle = '#3498db';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(0, centerY);
        for (let x = 0; x < width; x++) {
            const t = (x / width) * Math.PI * 8;
            const y = centerY + 50 + Math.sin(t * ratio) * 40;
            ctx.lineTo(x, y);
        }
        ctx.strokeStyle = '#e74c3c';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Draw interference pattern
        ctx.beginPath();
        ctx.moveTo(0, centerY);
        for (let x = 0; x < width; x++) {
            const t = (x / width) * Math.PI * 8;
            const wave1 = Math.sin(t) * 40;
            const wave2 = Math.sin(t * ratio) * 40;
            const y = centerY + wave1 + wave2;
            ctx.lineTo(x, y);
        }
        ctx.strokeStyle = '#2c3e50';
        ctx.lineWidth = 3;
        ctx.stroke();
        
        // Calculate interval ratio
        const simpleRatio = this.findSimpleRatio(ratio);
        
        // Draw labels
        ctx.fillStyle = '#2c3e50';
        ctx.font = 'bold 18px Arial';
        ctx.fillText('Wave Interference Pattern', 20, 30);
        
        ctx.font = '16px Arial';
        ctx.fillStyle = '#3498db';
        ctx.fillText(`Wave 1: ${freq1.toFixed(1)} Hz`, 20, 60);
        ctx.fillStyle = '#e74c3c';
        ctx.fillText(`Wave 2: ${freq2.toFixed(1)} Hz`, 20, 85);
        
        ctx.fillStyle = '#2c3e50';
        ctx.fillText(`Ratio: ${freq2.toFixed(1)}:${freq1.toFixed(1)} ≈ ${simpleRatio}`, 20, 110);
        
        // Determine consonance/dissonance
        const intervalType = this.getIntervalType(ratio);
        const consonance = this.getConsonanceDescription(ratio);
        
        ctx.font = 'bold 16px Arial';
        ctx.fillStyle = intervalType === 'consonant' ? '#27ae60' : '#e74c3c';
        ctx.fillText(`${intervalType.toUpperCase()}: ${consonance}`, 20, 140);
    }

    findSimpleRatio(ratio) {
        const commonRatios = [
            {ratio: 1/1, name: "1:1 (Unison)"},
            {ratio: 16/15, name: "16:15 (Minor 2nd)"},
            {ratio: 9/8, name: "9:8 (Major 2nd)"},
            {ratio: 6/5, name: "6:5 (Minor 3rd)"},
            {ratio: 5/4, name: "5:4 (Major 3rd)"},
            {ratio: 4/3, name: "4:3 (Perfect 4th)"},
            {ratio: 45/32, name: "45:32 (Tritone)"},
            {ratio: 3/2, name: "3:2 (Perfect 5th)"},
            {ratio: 8/5, name: "8:5 (Minor 6th)"},
            {ratio: 5/3, name: "5:3 (Major 6th)"},
            {ratio: 9/5, name: "9:5 (Minor 7th)"},
            {ratio: 15/8, name: "15:8 (Major 7th)"},
            {ratio: 2/1, name: "2:1 (Octave)"}
        ];
        
        let closest = commonRatios[0];
        let minDiff = Math.abs(ratio - closest.ratio);
        
        commonRatios.forEach(r => {
            const diff = Math.abs(ratio - r.ratio);
            if (diff < minDiff) {
                minDiff = diff;
                closest = r;
            }
        });
        
        return closest.name;
    }

    getIntervalType(ratio) {
        const simpleRatios = [1/1, 2/1, 3/2, 4/3, 5/4, 5/3, 6/5];
        const complexRatios = [16/15, 9/8, 45/32, 8/5, 9/5, 15/8];
        
        let isConsonant = false;
        simpleRatios.forEach(r => {
            if (Math.abs(ratio - r) < 0.05) isConsonant = true;
        });
        
        return isConsonant ? 'consonant' : 'dissonant';
    }

    getConsonanceDescription(ratio) {
        if (Math.abs(ratio - 1.5) < 0.05) return "Perfect Fifth - Smooth interference";
        if (Math.abs(ratio - 1.333) < 0.05) return "Perfect Fourth - Stable pattern";
        if (Math.abs(ratio - 1.25) < 0.05) return "Major Third - Pleasing harmony";
        if (Math.abs(ratio - 1.067) < 0.05) return "Minor Second - Strong beating";
        if (Math.abs(ratio - 1.125) < 0.05) return "Major Second - Moderate beating";
        if (Math.abs(ratio - 1.414) < 0.05) return "Tritone - Maximum dissonance";
        return "Complex interference pattern";
    }

    getNoteName(frequency) {
        const notes = this.getNoteFrequencies();
        for (const [note, freq] of Object.entries(notes)) {
            if (Math.abs(freq - frequency) < 0.5) {
                return note;
            }
        }
        return `${frequency.toFixed(0)} Hz`;
    }

    playMelody() {
        if (this.notes.length === 0) return;
        
        const now = this.Tone.now();
        this.notes.forEach((note, index) => {
            setTimeout(() => {
                this.playNote(note.frequency);
            }, index * 500);
        });
    }

    clearMelody() {
        this.notes = [];
        this.updateVisualization();
        this.updateMelodyDisplay();
        this.updateNoteButtons();
        
        // Reset physics display
        document.getElementById('frequency').textContent = '-- Hz';
        document.getElementById('wavelength').textContent = '-- m';
        document.getElementById('period').textContent = '-- ms';
        document.getElementById('harmonics-count').textContent = '--';
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

        // Initialize visualization mode
        this.updateVisualizationMode();
    }
}

// Initialize when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new PhysicsMelodyBuilder();
});