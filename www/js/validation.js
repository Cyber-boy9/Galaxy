class FormValidator {
    static validatePassword(password) {
        const strength = {
            score: 0,
            hasLower: /[a-z]/.test(password),
            hasUpper: /[A-Z]/.test(password),
            hasNumber: /[0-9]/.test(password),
            hasSpecial: /[!@#$%^&*]/.test(password),
            isLongEnough: password.length >= 8
        };

        // Calculate score
        strength.score = Object.values(strength).filter(Boolean).length - 1;

        return {
            score: strength.score,
            feedback: this.getStrengthFeedback(strength.score),
            isValid: strength.score >= 3
        };
    }

    static getStrengthFeedback(score) {
        switch (score) {
            case 0:
            case 1:
                return {
                    message: 'Weak password',
                    class: 'strength-weak'
                };
            case 2:
            case 3:
                return {
                    message: 'Medium strength',
                    class: 'strength-medium'
                };
            case 4:
                return {
                    message: 'Strong password',
                    class: 'strength-strong'
                };
            default:
                return {
                    message: 'Enter password',
                    class: ''
                };
        }
    }

    static validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    static validateUsername(username) {
        return username.length >= 3 && username.length <= 30 && /^[a-zA-Z0-9_-]+$/.test(username);
    }
}