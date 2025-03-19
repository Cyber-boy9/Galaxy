class VoiceRecorder {
    constructor() {
        this.isRecording = false;
        this.recordingTime = 0;
        this.timerInterval = null;
        this.mediaRecorder = null;
        this.audioChunks = [];
        
        this.initializeElements();
        this.bindEvents();
        this.createWaveform();
    }

    initializeElements() {
        this.recorder = document.querySelector('.voice-recorder');
        this.micButton = document.querySelector('.input-actions .fa-microphone').parentElement;
        this.stopButton = document.querySelector('.record-btn.stop');
        this.sendButton = document.querySelector('.record-btn.send');
        this.timer = document.querySelector('.recording-timer');
        this.waveBars = document.querySelector('.wave-bars');
    }

    bindEvents() {
        this.micButton.addEventListener('click', () => this.startRecording());
        this.stopButton.addEventListener('click', () => this.stopRecording());
        this.sendButton.addEventListener('click', () => this.sendRecording());
    }

    createWaveform() {
        // Create 50 bars with random heights
        for (let i = 0; i < 50; i++) {
            const bar = document.createElement('div');
            bar.className = 'wave-bar';
            bar.style.animationDelay = `${i * 0.05}s`;
            this.waveBars.appendChild(bar);
        }
    }

    async startRecording() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            this.mediaRecorder = new MediaRecorder(stream);
            this.audioChunks = [];

            this.mediaRecorder.ondataavailable = (event) => {
                this.audioChunks.push(event.data);
            };

            this.mediaRecorder.start();
            this.isRecording = true;
            this.recorder.classList.add('active');
            this.startTimer();
            
            // Animate wave bars
            this.animateWaveform();

        } catch (err) {
            console.error('Error accessing microphone:', err);
            // Show error notification
        }
    }

    stopRecording() {
        if (this.mediaRecorder && this.isRecording) {
            this.mediaRecorder.stop();
            this.isRecording = false;
            this.stopTimer();
        }
    }

    async sendRecording() {
        if (this.audioChunks.length > 0) {
            const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
            // Here you would normally upload the audio file
            // For demo, we'll create an audio message UI
            this.createVoiceMessage(audioBlob);
            this.resetRecorder();
        }
    }

    createVoiceMessage(blob) {
        const url = URL.createObjectURL(blob);
        const duration = this.formatTime(this.recordingTime);
        
        const messageHTML = `
            <div class="message outgoing">
                <div class="message-content">
                    <div class="message-bubble voice-message">
                        <div class="voice-play">
                            <i class="fas fa-play"></i>
                        </div>
                        <div class="voice-waveform">
                            <div class="voice-progress"></div>
                        </div>
                        <div class="voice-time">${duration}</div>
                    </div>
                    <div class="message-meta">
                        <span class="message-time">now</span>
                        <div class="message-status status-sent">
                            <i class="fas fa-check"></i>
                        </div>
                    </div>
                </div>
            </div>
        `;

        const messagesContainer = document.querySelector('.messages-container');
        messagesContainer.insertAdjacentHTML('beforeend', messageHTML);

        // Add play functionality
        const lastMessage = messagesContainer.lastElementChild;
        const playButton = lastMessage.querySelector('.voice-play');
        const audio = new Audio(url);
        
        playButton.addEventListener('click', () => {
            if (audio.paused) {
                audio.play();
                playButton.innerHTML = '<i class="fas fa-pause"></i>';
            } else {
                audio.pause();
                playButton.innerHTML = '<i class="fas fa-play"></i>';
            }
        });

        // Update progress bar
        const progressBar = lastMessage.querySelector('.voice-progress');
        audio.addEventListener('timeupdate', () => {
            const progress = (audio.currentTime / audio.duration) * 100;
            progressBar.style.setProperty('--progress', `${progress}%`);
        });

        audio.addEventListener('ended', () => {
            playButton.innerHTML = '<i class="fas fa-play"></i>';
            progressBar.style.setProperty('--progress', '0%');
        });
    }

    startTimer() {
        this.recordingTime = 0;
        this.timerInterval = setInterval(() => {
            this.recordingTime++;
            this.timer.textContent = this.formatTime(this.recordingTime);
        }, 1000);
    }

    stopTimer() {
        clearInterval(this.timerInterval);
    }

    formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        seconds = seconds % 60;
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }

    resetRecorder() {
        this.recorder.classList.remove('active');
        this.recordingTime = 0;
        this.timer.textContent = '0:00';
        this.audioChunks = [];
    }

    animateWaveform() {
        const bars = this.waveBars.children;
        for (let bar of bars) {
            bar.style.height = `${20 + Math.random() * 60}%`;
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const voiceRecorder = new VoiceRecorder();
});