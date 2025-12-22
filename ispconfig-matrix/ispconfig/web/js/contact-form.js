/**
 * Contact Form Handler for MATRIX CBS Kft.
 * Client-side validation, CAPTCHA generation, and AJAX submission
 */

(function() {
    'use strict';

    // CAPTCHA Generation
    const CaptchaManager = {
        num1: 0,
        num2: 0,
        answer: 0,

        generate: function() {
            this.num1 = Math.floor(Math.random() * 10) + 1;
            this.num2 = Math.floor(Math.random() * 10) + 1;
            this.answer = this.num1 + this.num2;

            const questionEl = document.getElementById('captcha-question');
            const answerEl = document.getElementById('captcha_answer');

            if (questionEl && answerEl) {
                questionEl.textContent = 'Mennyi ' + this.num1 + ' + ' + this.num2 + '?';
                answerEl.value = this.answer.toString();
            }
        },

        validate: function(userAnswer) {
            return parseInt(userAnswer, 10) === this.answer;
        }
    };

    // CSRF Token Manager
    const CsrfManager = {
        fetchToken: async function() {
            try {
                const formData = new FormData();
                formData.append('action', 'get_token');

                const response = await fetch('send-mail.php', {
                    method: 'POST',
                    body: formData
                });

                const data = await response.json();
                const tokenEl = document.getElementById('csrf_token');
                if (tokenEl && data.token) {
                    tokenEl.value = data.token;
                }
            } catch (error) {
                console.error('Failed to fetch CSRF token:', error);
            }
        }
    };

    // Form Validator
    const FormValidator = {
        validators: {
            name: function(value) {
                return value.length >= 2 && value.length <= 100;
            },
            email: function(value) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                return emailRegex.test(value);
            },
            subject: function(value) {
                return value.length >= 3 && value.length <= 200;
            },
            message: function(value) {
                return value.length >= 10 && value.length <= 5000;
            },
            captcha: function(value) {
                return CaptchaManager.validate(value);
            }
        },

        validateField: function(field) {
            const value = field.value.trim();
            const fieldName = field.name;
            const validator = this.validators[fieldName];

            if (validator && !validator(value)) {
                field.classList.add('is-invalid');
                field.classList.remove('is-valid');
                return false;
            } else if (validator) {
                field.classList.remove('is-invalid');
                field.classList.add('is-valid');
                return true;
            }
            return true;
        },

        validateForm: function(form) {
            let isValid = true;
            const fields = ['name', 'email', 'subject', 'message', 'captcha'];

            fields.forEach(fieldName => {
                const field = form.querySelector('[name="' + fieldName + '"]');
                if (field && !this.validateField(field)) {
                    isValid = false;
                }
            });

            return isValid;
        }
    };

    // Message Display
    const MessageDisplay = {
        show: function(message, isSuccess) {
            const messagesEl = document.getElementById('form-messages');
            if (messagesEl) {
                messagesEl.textContent = message;
                messagesEl.className = 'alert ' + (isSuccess ? 'alert-success' : 'alert-danger');
                messagesEl.classList.remove('d-none');
                messagesEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
        },

        hide: function() {
            const messagesEl = document.getElementById('form-messages');
            if (messagesEl) {
                messagesEl.classList.add('d-none');
            }
        }
    };

    // Button State Manager - uses safe DOM methods instead of innerHTML
    const ButtonState = {
        originalContent: null,

        setLoading: function(btn) {
            // Store original children
            this.originalContent = Array.from(btn.childNodes).map(node => node.cloneNode(true));

            // Clear button
            while (btn.firstChild) {
                btn.removeChild(btn.firstChild);
            }

            // Add spinner icon
            const spinner = document.createElement('i');
            spinner.className = 'fas fa-spinner fa-spin me-2';
            btn.appendChild(spinner);

            // Add text
            btn.appendChild(document.createTextNode('Kuldes...'));
        },

        restore: function(btn) {
            if (this.originalContent) {
                // Clear button
                while (btn.firstChild) {
                    btn.removeChild(btn.firstChild);
                }

                // Restore original content
                this.originalContent.forEach(node => {
                    btn.appendChild(node);
                });

                this.originalContent = null;
            }
        }
    };

    // Form Submission Handler
    const FormHandler = {
        isSubmitting: false,

        submit: async function(form) {
            if (this.isSubmitting) return;

            const submitBtn = form.querySelector('#submitBtn');

            try {
                this.isSubmitting = true;
                submitBtn.disabled = true;
                ButtonState.setLoading(submitBtn);
                MessageDisplay.hide();

                // Client-side validation
                if (!FormValidator.validateForm(form)) {
                    throw new Error('Kerem, toltse ki helyesen az osszes kotelezo mezot.');
                }

                // Submit form via AJAX
                const formData = new FormData(form);
                const response = await fetch(form.action, {
                    method: 'POST',
                    body: formData
                });

                const data = await response.json();

                if (data.success) {
                    MessageDisplay.show(data.message, true);
                    form.reset();
                    form.querySelectorAll('.is-valid').forEach(el => el.classList.remove('is-valid'));
                    CaptchaManager.generate();
                    CsrfManager.fetchToken();
                } else {
                    throw new Error(data.message || 'Ismeretlen hiba tortent.');
                }

            } catch (error) {
                MessageDisplay.show(error.message, false);
                CaptchaManager.generate();
            } finally {
                this.isSubmitting = false;
                submitBtn.disabled = false;
                ButtonState.restore(submitBtn);
            }
        }
    };

    // Initialize on DOM ready
    document.addEventListener('DOMContentLoaded', function() {
        const form = document.getElementById('contactForm');

        if (!form) return;

        // Generate initial CAPTCHA
        CaptchaManager.generate();

        // Fetch CSRF token
        CsrfManager.fetchToken();

        // Add real-time validation
        const fields = form.querySelectorAll('input, textarea');
        fields.forEach(field => {
            field.addEventListener('blur', function() {
                FormValidator.validateField(this);
            });

            field.addEventListener('input', function() {
                if (this.classList.contains('is-invalid')) {
                    FormValidator.validateField(this);
                }
            });
        });

        // Form submission
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            FormHandler.submit(form);
        });
    });

})();
