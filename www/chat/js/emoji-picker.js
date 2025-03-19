class EmojiPicker {
    constructor() {
        this.isOpen = false;
        this.recentEmojis = JSON.parse(localStorage.getItem('recentEmojis')) || [];
        this.initializeElements();
        this.bindEvents();
        this.loadEmojis();
    }

    initializeElements() {
        this.picker = document.querySelector('.emoji-picker');
        this.emojiBtn = document.querySelector('.input-actions .fa-smile').parentElement;
        this.emojiGrid = document.querySelector('.emoji-grid');
        this.searchInput = document.querySelector('.emoji-search input');
        this.categoryBtns = document.querySelectorAll('.category-btn');
        this.recentContainer = document.querySelector('.recent-emojis');
    }

    bindEvents() {
        // Toggle picker
        this.emojiBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.togglePicker();
        });

        // Close picker when clicking outside
        document.addEventListener('click', (e) => {
            if (!this.picker.contains(e.target)) {
                this.closePicker();
            }
        });

        // Search functionality
        this.searchInput.addEventListener('input', (e) => {
            this.searchEmojis(e.target.value);
        });

        // Category switching
        this.categoryBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                this.switchCategory(btn.dataset.category);
            });
        });
    }

    togglePicker() {
    this.isOpen = !this.isOpen;
    if (this.isOpen) {
        this.picker.style.opacity = '1';
        this.picker.style.visibility = 'visible';
        this.picker.style.transform = 'translateY(0) scale(1)';
        this.searchInput.focus();
    } else {
        this.picker.style.opacity = '0';
        this.picker.style.visibility = 'hidden';
        this.picker.style.transform = 'translateY(10px) scale(0.98)';
    }
}

    closePicker() {
    this.isOpen = false;
    this.picker.style.opacity = '0';
    this.picker.style.visibility = 'hidden';
    this.picker.style.transform = 'translateY(10px) scale(0.98)';
}

    // Sample emoji data - you can expand this
    loadEmojis(category = 'smileys') {
        const emojis = {
            smileys: ['😀', '😃', '😄', '😁', '😅', '😂', '🤣', '😊', '😇', '🙂', '🙃', '😉', '😌', '😍', '🥰'],
            nature: ['🌸', '🌹', '🌺', '🌻', '🌼', '🌷', '🌱', '🌲', '🌳', '🌴', '🌵', '🌾', '🌿', '☘️', '🍀'],
            food: ['🍎', '🍐', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🫐', '🍈', '🍒', '🍑', '🥭', '🍍', '🥥'],
            activities: ['⚽️', '🏀', '🏈', '⚾️', '🥎', '🎾', '🏐', '🏉', '🥏', '🎱', '🪀', '🏓', '🏸', '🏒', '🏑'],
            travel: ['🚀', '✨', '🌟', '⭐️', '🌙', '🌘', '🌍', '🌎', '🌏', '🪐', '💫', '☄️', '🌠', '🌌', '🛸'],
            objects: ['📱', '💻', '⌨️', '🖥️', '🖨️', '🖱️', '🖲️', '📷', '🎮', '🕹️', '🎲', '🎭', '🎨', '🎼', '🎧'],
            symbols: ['❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔', '❣️', '💕', '💞', '💓', '💗']
        };

        this.emojiGrid.innerHTML = '';
        emojis[category].forEach(emoji => {
            const div = document.createElement('div');
            div.className = 'emoji-item';
            div.textContent = emoji;
            div.addEventListener('click', () => this.selectEmoji(emoji));
            this.emojiGrid.appendChild(div);
        });
    }

    selectEmoji(emoji) {
        const input = document.querySelector('.input-wrapper input');
        const cursorPos = input.selectionStart;
        const textBefore = input.value.substring(0, cursorPos);
        const textAfter = input.value.substring(cursorPos);
        
        input.value = textBefore + emoji + textAfter;
        input.focus();
        
        // Update recent emojis
        this.updateRecentEmojis(emoji);
        
        // Optional: close picker after selection
        this.closePicker();
    }

    updateRecentEmojis(emoji) {
        this.recentEmojis = [emoji, ...this.recentEmojis.filter(e => e !== emoji)].slice(0, 15);
        localStorage.setItem('recentEmojis', JSON.stringify(this.recentEmojis));
        this.loadRecentEmojis();
    }

    loadRecentEmojis() {
        this.recentContainer.innerHTML = '';
        this.recentEmojis.forEach(emoji => {
            const div = document.createElement('div');
            div.className = 'emoji-item';
            div.textContent = emoji;
            div.addEventListener('click', () => this.selectEmoji(emoji));
            this.recentContainer.appendChild(div);
        });
    }

    searchEmojis(query) {
        // Implement emoji search logic here
        // For now, just switch to smileys category
        this.loadEmojis('smileys');
    }

    switchCategory(category) {
        this.categoryBtns.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.category === category);
        });
        this.loadEmojis(category);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const emojiPicker = new EmojiPicker();
});