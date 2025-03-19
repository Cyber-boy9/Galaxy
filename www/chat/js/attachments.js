class AttachmentEditor {
    constructor() {
        this.initializeElements();
        this.bindEvents();
        this.currentImage = null;
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.textOverlays = [];
        this.selectedColor = '#ffffff';
        this.currentAspectRatio = 'Free';
    }

    initializeElements() {
        this.modalOverlay = document.querySelector('.modal-overlay');
        this.attachBtn = document.querySelector('.input-actions .fa-paperclip').parentElement;
        this.attachOptions = document.querySelectorAll('.attach-option');
        this.imageEditor = document.querySelector('.image-editor');
        this.editPreview = document.querySelector('.edit-preview');
        this.cancelBtn = document.querySelector('.editor-btn.cancel');
        this.saveBtn = document.querySelector('.editor-btn.save');
        this.textInput = document.querySelector('.text-input');
        this.textControls = document.querySelectorAll('.text-control');
        this.colorOptions = document.querySelectorAll('.color-option');
        this.aspectRatios = document.querySelectorAll('.aspect-ratio-btn');
        this.locationOverlay = document.querySelector('.location-overlay');
        this.locationCancelBtn = document.querySelector('.location-cancel');
        this.locationShareBtn = document.querySelector('.location-share');
    }

    bindEvents() {
        // Toggle modal
        this.attachBtn.addEventListener('click', () => this.toggleModal());
        
        // Close modal when clicking overlay
        this.modalOverlay.addEventListener('click', (e) => {
            if (e.target === this.modalOverlay) this.toggleModal();
        });

        // Attachment options
        this.attachOptions.forEach(option => {
            option.addEventListener('click', () => this.handleAttachmentSelect(option));
        });

        // Editor controls
        this.cancelBtn.addEventListener('click', () => this.closeEditor());
        this.saveBtn.addEventListener('click', () => this.saveEdit());
        
        // Text overlay
        this.textInput.addEventListener('input', () => this.updateTextOverlay());
        this.textControls.forEach(control => {
            control.addEventListener('click', () => this.handleTextControl(control));
        });
        
        // Color selection
        this.colorOptions.forEach(color => {
            color.addEventListener('click', () => this.handleColorSelect(color));
        });
        
        // Aspect ratio selection
        this.aspectRatios.forEach(ratio => {
            ratio.addEventListener('click', () => this.handleAspectRatio(ratio));
        });

        // Location sharing
        this.locationCancelBtn.addEventListener('click', () => this.closeLocationOverlay());
        this.locationShareBtn.addEventListener('click', () => this.shareLocation());
    }

    toggleModal() {
        this.modalOverlay.classList.toggle('active');
    }

    handleAttachmentSelect(option) {
        const type = option.dataset.type;
        
        switch(type) {
            case 'image':
                this.openImageSelect();
                break;
            case 'document':
                this.openDocumentSelect();
                break;
            case 'audio':
                this.openAudioSelect();
                break;
            case 'location':
                this.openLocationSelect();
                break;
        }
        
        this.toggleModal();
    }

    openImageSelect() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.multiple = true;
        
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                this.loadImage(file);
            }
        };
        
        input.click();
    }

    loadImage(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                this.currentImage = img;
                this.initializeCanvas();
                this.openEditor();
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }

    initializeCanvas() {
        this.canvas.width = this.currentImage.width;
        this.canvas.height = this.currentImage.height;
        this.ctx.drawImage(this.currentImage, 0, 0);
        this.editPreview.innerHTML = '';
        this.editPreview.appendChild(this.canvas);
    }

    openEditor() {
        this.imageEditor.classList.add('active');
    }

    closeEditor() {
        this.imageEditor.classList.remove('active');
        this.textOverlays = [];
        this.currentAspectRatio = 'Free';
        this.aspectRatios.forEach(btn => btn.classList.remove('active'));
        this.aspectRatios[0].classList.add('active'); // Set 'Free' as active
    }

    updateTextOverlay() {
        const text = this.textInput.value;
        this.redrawCanvas();
        
        if (text) {
            const overlay = {
                text: text,
                font: '24px Arial',
                color: this.selectedColor,
                x: 20,
                y: 40,
                bold: false,
                italic: false,
                size: 24
            };
            this.textOverlays.push(overlay);
            this.ctx.font = overlay.font;
            this.ctx.fillStyle = overlay.color;
            this.ctx.fillText(text, overlay.x, overlay.y);
        }
    }

    redrawCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.drawImage(this.currentImage, 0, 0);
        
        // Redraw all text overlays
        this.textOverlays.forEach(overlay => {
            this.ctx.font = overlay.font;
            this.ctx.fillStyle = overlay.color;
            this.ctx.fillText(overlay.text, overlay.x, overlay.y);
        });
    }

    handleTextControl(control) {
        const action = control.dataset.action;
        let currentOverlay = this.textOverlays[this.textOverlays.length - 1];
        
        if (!currentOverlay && this.textInput.value) {
            currentOverlay = {
                text: this.textInput.value,
                font: '24px Arial',
                color: this.selectedColor,
                x: 20,
                y: 40,
                bold: false,
                italic: false,
                size: 24
            };
            this.textOverlays.push(currentOverlay);
        }

        if (currentOverlay) {
            switch(action) {
                case 'bold':
                    currentOverlay.bold = !currentOverlay.bold;
                    break;
                case 'italic':
                    currentOverlay.italic = !currentOverlay.italic;
                    break;
                case 'size-up':
                    currentOverlay.size = Math.min(72, currentOverlay.size + 4);
                    break;
                case 'move':
                    this.enableTextDragging(currentOverlay);
                    break;
            }

            // Update font string
            const fontStyle = [
                currentOverlay.italic ? 'italic' : '',
                currentOverlay.bold ? 'bold' : '',
                `${currentOverlay.size}px`,
                'Arial'
            ].filter(Boolean).join(' ');

            currentOverlay.font = fontStyle;
            this.redrawCanvas();
        }
    }

    enableTextDragging(overlay) {
        let isDragging = false;
        let startX, startY;

        const handleMouseDown = (e) => {
            isDragging = true;
            startX = e.clientX - overlay.x;
            startY = e.clientY - overlay.y;
            this.canvas.style.cursor = 'move';
        };

        const handleMouseMove = (e) => {
            if (!isDragging) return;
            
            overlay.x = e.clientX - startX;
            overlay.y = e.clientY - startY;
            
            // Keep text within canvas bounds
            overlay.x = Math.max(0, Math.min(overlay.x, this.canvas.width - 100));
            overlay.y = Math.max(overlay.size, Math.min(overlay.y, this.canvas.height - 10));
            
            this.redrawCanvas();
        };

        const handleMouseUp = () => {
            isDragging = false;
            this.canvas.style.cursor = 'default';
        };

        this.canvas.addEventListener('mousedown', handleMouseDown);
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);

        // Clean up after 10 seconds of no interaction
        setTimeout(() => {
            this.canvas.removeEventListener('mousedown', handleMouseDown);
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        }, 10000);
    }

    handleColorSelect(color) {
        this.selectedColor = getComputedStyle(color).backgroundColor;
        let currentOverlay = this.textOverlays[this.textOverlays.length - 1];
        
        if (currentOverlay) {
            currentOverlay.color = this.selectedColor;
            this.redrawCanvas();
        }
    }

    handleAspectRatio(ratio) {
        this.aspectRatios.forEach(btn => btn.classList.remove('active'));
        ratio.classList.add('active');
        
        const aspectRatio = ratio.textContent;
        let width = this.canvas.width;
        let height = this.canvas.height;
        
        switch(aspectRatio) {
            case '1:1':
                height = width;
                break;
            case '4:3':
                height = (width * 3) / 4;
                break;
            case '16:9':
                height = (width * 9) / 16;
                break;
        }

        this.cropCanvas(width, height);
    }

    cropCanvas(width, height) {
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = width;
        tempCanvas.height = height;
        const tempCtx = tempCanvas.getContext('2d');

        // Calculate position to center the crop
        const x = (this.canvas.width - width) / 2;
        const y = (this.canvas.height - height) / 2;

        tempCtx.drawImage(
            this.canvas,
            x, y, width, height,  // Source rectangle
            0, 0, width, height   // Destination rectangle
        );

        // Update main canvas
        this.canvas.width = width;
        this.canvas.height = height;
        this.ctx.drawImage(tempCanvas, 0, 0);
    }

    saveEdit() {
        // Convert canvas to blob
        this.canvas.toBlob((blob) => {
            // Create message with edited image
            const url = URL.createObjectURL(blob);
            this.createImageMessage(url);
            this.closeEditor();
        }, 'image/jpeg', 0.85); // 85% quality JPEG
    }

    createImageMessage(imageUrl) {
        const messageHTML = `
            <div class="message outgoing">
                <div class="message-content">
                    <div class="message-bubble image">
                        <img src="${imageUrl}" alt="Edited image">
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
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    // File handling methods for other types
    openDocumentSelect() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.pdf,.doc,.docx,.xls,.xlsx,.txt';
        input.multiple = true;
        input.click();
        
        input.onchange = (e) => {
            Array.from(e.target.files).forEach(file => {
                this.handleDocumentUpload(file);
            });
        };
    }

    openAudioSelect() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'audio/*';
        input.multiple = true;
        input.click();
        
        input.onchange = (e) => {
            Array.from(e.target.files).forEach(file => {
                this.handleAudioUpload(file);
            });
        };
    }

    openLocationSelect() {
        this.locationOverlay.classList.add('active');
    }

    closeLocationOverlay() {
        this.locationOverlay.classList.remove('active');
    }

    shareLocation() {
        const locationMessageHTML = `
            <div class="message outgoing">
                <div class="message-content">
                    <div class="message-bubble location">
                        <i class="fas fa-map-marker-alt"></i>
                        <span class="location-text">Shared Location</span>
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
        messagesContainer.insertAdjacentHTML('beforeend', locationMessageHTML);
        this.closeLocationOverlay();
    }

    handleDocumentUpload(file) {
        // Create document message
        const messageHTML = `
            <div class="message outgoing">
                <div class="message-content">
                    <div class="message-bubble document">
                        <i class="fas fa-file-alt"></i>
                        <span class="doc-name">${file.name}</span>
                        <span class="doc-size">${this.formatFileSize(file.size)}</span>
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
    }

    handleAudioUpload(file) {
        // Create audio message
        const messageHTML = `
            <div class="message outgoing">
                <div class="message-content">
                    <div class="message-bubble audio">
                        <i class="fas fa-play"></i>
                        <div class="audio-wave"></div>
                        <span class="audio-duration">0:00</span>
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
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const attachmentEditor = new AttachmentEditor();
});