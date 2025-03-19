// Chat List Management
class ChatList {
    constructor() {
        this.currentFilter = 'recent';
        this.initializeElements();
        this.bindEvents();
    }

    initializeElements() {
        this.filterTabs = document.querySelectorAll('.filter-tab');
        this.chatsList = document.querySelector('.chats-list');
        this.searchInput = document.querySelector('.chat-search input');
    }

    bindEvents() {
        // Filter tab clicks
        this.filterTabs.forEach(tab => {
            tab.addEventListener('click', () => this.handleFilterChange(tab));
        });

        // Search input
        if (this.searchInput) {
            this.searchInput.addEventListener('input', (e) => this.handleSearch(e.target.value));
        }
    }

    handleFilterChange(selectedTab) {
        // Remove active class from all tabs
        this.filterTabs.forEach(tab => tab.classList.remove('active'));
        
        // Add active class to selected tab
        selectedTab.classList.add('active');
        
        // Update current filter
        this.currentFilter = selectedTab.dataset.filter;
        
        // Apply filter with smooth animation
        this.applyFilter();
    }

    applyFilter() {
        const chatItems = document.querySelectorAll('.chat-item');
        
        chatItems.forEach(chat => {
            chat.style.opacity = '0';
            chat.style.transform = 'translateX(-10px)';
            
            setTimeout(() => {
                // Show/hide based on filter
                switch(this.currentFilter) {
                    case 'unread':
                        chat.style.display = chat.querySelector('.unread-count') ? 'flex' : 'none';
                        break;
                    case 'groups':
                        chat.style.display = chat.querySelector('.chat-badge') ? 'flex' : 'none';
                        break;
                    default: // recent
                        chat.style.display = 'flex';
                }
                
                // Animate back in if visible
                if (chat.style.display === 'flex') {
                    chat.style.opacity = '1';
                    chat.style.transform = 'translateX(0)';
                }
            }, 300);
        });
    }

    handleSearch(query) {
        const chatItems = document.querySelectorAll('.chat-item');
        query = query.toLowerCase();
        
        chatItems.forEach(chat => {
            const chatName = chat.querySelector('.chat-name').textContent.toLowerCase();
            const lastMessage = chat.querySelector('.last-message').textContent.toLowerCase();
            
            if (chatName.includes(query) || lastMessage.includes(query)) {
                chat.style.display = 'flex';
                chat.style.opacity = '1';
                chat.style.transform = 'translateX(0)';
            } else {
                chat.style.display = 'none';
            }
        });
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const chatList = new ChatList();
});