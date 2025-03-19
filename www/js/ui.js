class UI {
    static init() {
        this.initializePasswordToggles();
        this.initializeProfileUpload();
        this.initializeInterestTags();
        this.initializeCharCounter();
        this.initializePasswordStrength();
    }

    static initializePasswordToggles() {
        document.querySelectorAll('.toggle-password').forEach(toggle => {
            toggle.addEventListener('click', (e) => {
                const input = e.target.previousElementSibling;
                const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
                input.setAttribute('type', type);
                e.target.classList.toggle('fa-eye');
                e.target.classList.toggle('fa-eye-slash');
            });
        });
    }

    static initializeProfileUpload() {
        const profilePreview = document.getElementById('profile-preview');
        const uploadInput = document.getElementById('profile-upload');

        if (profilePreview && uploadInput) {
            profilePreview.parentElement.addEventListener('click', () => {
                uploadInput.click();
            });

            uploadInput.addEventListener('change', (e) => {
                if (e.target.files && e.target.files[0]) {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        profilePreview.src = e.target.result;
                    };
                    reader.readAsDataURL(e.target.files[0]);
                }
            });
        }
    }

    static initializeInterestTags() {
        document.querySelectorAll('.tag').forEach(tag => {
            tag.addEventListener('click', () => {
                tag.classList.toggle('selected');
            });
        });
    }

    static initializeCharCounter() {
        const bioTextarea = document.querySelector('textarea');
        const charCount = document.querySelector('.char-count');

        if (bioTextarea && charCount) {
            bioTextarea.addEventListener('input', () => {
                const length = bioTextarea.value.length;
                charCount.textContent = `${length}/150`;
                
                // Add visual feedback when approaching limit
                if (length > 130) {
                    charCount.style.color = '#FFA000';
                } else if (length === 150) {
                    charCount.style.color = 'var(--error-color)';
                } else {
                    charCount.style.color = 'var(--gray-text)';
                }
            });
        }
    }

    static initializePasswordStrength() {
        const passwordInput = document.querySelector('input[type="password"]');
        const strengthBar = document.querySelector('.strength-bar');
        const strengthText = document.querySelector('.strength-text');

        if (passwordInput && strengthBar && strengthText) {
            passwordInput.addEventListener('input', () => {
                const result = FormValidator.validatePassword(passwordInput.value);
                
                // Remove all strength classes
                strengthBar.className = 'strength-bar';
                
                // Add appropriate strength class
                if (result.feedback.class) {
                    strengthBar.classList.add(result.feedback.class);
                }
                
                // Update strength text
                strengthText.textContent = result.feedback.message;
            });
        }
    }

    static showLoading(button) {
        const originalContent = button.innerHTML;
        button.disabled = true;
        button.innerHTML = `
            <div class="button-loader">
                <div class="spinner"></div>
            </div>
        `;
        return originalContent;
    }

    static hideLoading(button, originalContent) {
        button.disabled = false;
        button.innerHTML = originalContent;
    }

    static showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.innerHTML = `
            <i class="fas fa-exclamation-circle"></i>
            <span>${message}</span>
        `;
        
        document.body.appendChild(errorDiv);
        
        // Remove after 3 seconds
        setTimeout(() => {
            errorDiv.remove();
        }, 3000);
    }

    static showSuccess(message) {
        const successDiv = document.createElement('div');
        successDiv.className = 'success-message';
        successDiv.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <span>${message}</span>
        `;
        
        document.body.appendChild(successDiv);
        
        // Remove after 3 seconds
        setTimeout(() => {
            successDiv.remove();
        }, 3000);
    }

    // Modal handling
    static showModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('hidden');
            modal.classList.add('fade-in');
        }
    }

    static hideModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('fade-out');
            setTimeout(() => {
                modal.classList.add('hidden');
                modal.classList.remove('fade-out');
            }, 300);
        }
    }

    // Form handling
    static getFormData(formId) {
        const form = document.getElementById(formId);
        const formData = new FormData(form);
        const data = {};
        
        for (let [key, value] of formData.entries()) {
            data[key] = value;
        }
        
        // Add selected interests
        if (formId === 'signup-form') {
            data.interests = Array.from(document.querySelectorAll('.tag.selected'))
                .map(tag => tag.dataset.interest);
        }
        
        return data;
    }

    // Input validation feedback
    static showInputError(input, message) {
        const status = input.nextElementSibling;
        input.classList.add('error');
        if (status) {
            status.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
            status.classList.add('error');
        }
    }

    static showInputSuccess(input) {
        const status = input.nextElementSibling;
        input.classList.remove('error');
        input.classList.add('success');
        if (status) {
            status.innerHTML = `<i class="fas fa-check-circle"></i>`;
            status.classList.add('success');
        }
    }

    static clearInputStatus(input) {
        const status = input.nextElementSibling;
        input.classList.remove('error', 'success');
        if (status) {
            status.innerHTML = '';
            status.classList.remove('error', 'success');
        }
    }
}

// Initialize UI when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    UI.init();
});