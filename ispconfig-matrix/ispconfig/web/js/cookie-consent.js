/**
 * GDPR Cookie Consent Manager
 * MATRIX CBS Kft.
 *
 * Features:
 * - GDPR Article 7 compliant (opt-in approach)
 * - Cookie categories: necessary, statistics, marketing
 * - LocalStorage based preferences
 * - Conditional loading of third-party scripts
 */

(function() {
    'use strict';

    const CONSENT_KEY = 'matrixcbs_cookie_consent';
    const CONSENT_VERSION = '1.0';

    // Default consent state (all optional categories off)
    const defaultConsent = {
        version: CONSENT_VERSION,
        necessary: true,
        statistics: false,
        marketing: false,
        timestamp: null
    };

    /**
     * Get current consent from localStorage
     */
    function getConsent() {
        try {
            const stored = localStorage.getItem(CONSENT_KEY);
            if (stored) {
                const consent = JSON.parse(stored);
                if (consent.version === CONSENT_VERSION) {
                    return consent;
                }
            }
        } catch (e) {
            console.error('Error reading cookie consent:', e);
        }
        return null;
    }

    /**
     * Save consent to localStorage
     */
    function saveConsent(consent) {
        try {
            consent.timestamp = new Date().toISOString();
            localStorage.setItem(CONSENT_KEY, JSON.stringify(consent));
        } catch (e) {
            console.error('Error saving cookie consent:', e);
        }
    }

    /**
     * Check if user has given consent for a specific category
     */
    function hasConsent(category) {
        const consent = getConsent();
        if (!consent) return false;
        return consent[category] === true;
    }

    /**
     * Load Google Analytics if statistics consent given
     */
    function loadGoogleAnalytics() {
        if (hasConsent('statistics')) {
            if (typeof gtag === 'function') {
                gtag('consent', 'update', {
                    'analytics_storage': 'granted'
                });
                gtag('config', 'G-4H0BCH8311');
            }
        }
    }

    /**
     * Load Facebook Messenger if marketing consent given
     */
    function loadFacebookMessenger() {
        if (hasConsent('marketing')) {
            window.fbAsyncInit = function() {
                FB.init({
                    xfbml: true,
                    version: 'v18.0'
                });
            };

            (function(d, s, id) {
                var js, fjs = d.getElementsByTagName(s)[0];
                if (d.getElementById(id)) return;
                js = d.createElement(s); js.id = id;
                js.src = 'https://connect.facebook.net/hu_HU/sdk/xfbml.customerchat.js';
                fjs.parentNode.insertBefore(js, fjs);
            }(document, 'script', 'facebook-jssdk'));

            const fbChat = document.querySelector('.fb-customerchat');
            if (fbChat) {
                fbChat.style.display = 'block';
            }
        }
    }

    /**
     * Create a DOM element with attributes and children
     */
    function createElement(tag, attrs, children) {
        const el = document.createElement(tag);
        if (attrs) {
            Object.keys(attrs).forEach(function(key) {
                if (key === 'className') {
                    el.className = attrs[key];
                } else if (key === 'textContent') {
                    el.textContent = attrs[key];
                } else if (key.startsWith('on')) {
                    el.addEventListener(key.substring(2).toLowerCase(), attrs[key]);
                } else {
                    el.setAttribute(key, attrs[key]);
                }
            });
        }
        if (children) {
            children.forEach(function(child) {
                if (typeof child === 'string') {
                    el.appendChild(document.createTextNode(child));
                } else if (child) {
                    el.appendChild(child);
                }
            });
        }
        return el;
    }

    /**
     * Create cookie option element
     */
    function createCookieOption(id, name, desc, checked, disabled) {
        const label = createElement('label', { className: 'cookie-option' + (disabled ? ' disabled' : '') });

        const checkbox = createElement('input', {
            type: 'checkbox',
            id: id
        });
        if (checked) checkbox.checked = true;
        if (disabled) checkbox.disabled = true;

        const nameSpan = createElement('span', { className: 'cookie-option-name', textContent: name });
        const descSpan = createElement('span', { className: 'cookie-option-desc', textContent: desc });

        const textDiv = createElement('div', {}, [nameSpan, descSpan]);

        label.appendChild(checkbox);
        label.appendChild(textDiv);

        return label;
    }

    /**
     * Create and show the cookie consent banner
     */
    function showBanner() {
        if (getConsent()) {
            return;
        }

        // Create banner structure using DOM methods
        const banner = createElement('div', { id: 'cookie-consent-banner', className: 'cookie-consent-banner' });
        const content = createElement('div', { className: 'cookie-consent-content' });

        // Header
        const header = createElement('div', { className: 'cookie-consent-header' });
        const icon = createElement('i', { className: 'fas fa-cookie-bite' });
        const title = createElement('h4', { textContent: 'Cookie beallitasok' });
        header.appendChild(icon);
        header.appendChild(title);

        // Description
        const desc = createElement('p');
        desc.appendChild(document.createTextNode('Weboldalunk sutiket (cookie-kat) hasznal a felhasznaloi elmeny javitasa, latogatottsagi statisztikak gyujtese es marketing celokra. '));
        const privacyLink = createElement('a', { href: 'adatvedelem.html', target: '_blank', textContent: 'Adatvedelmi tajekoztato' });
        desc.appendChild(privacyLink);

        // Options
        const options = createElement('div', { className: 'cookie-consent-options' });
        options.appendChild(createCookieOption('consent-necessary', 'Szukseges', 'A weboldal mukodesehez elengedhetetlen', true, true));
        options.appendChild(createCookieOption('consent-statistics', 'Statisztika', 'Google Analytics latogatottsagi adatok', false, false));
        options.appendChild(createCookieOption('consent-marketing', 'Marketing', 'Facebook Messenger, hirdetesek', false, false));

        // Buttons
        const buttons = createElement('div', { className: 'cookie-consent-buttons' });

        const rejectBtn = createElement('button', {
            type: 'button',
            className: 'btn-cookie btn-cookie-reject',
            textContent: 'Csak szuksegesek',
            onClick: rejectAll
        });

        const saveBtn = createElement('button', {
            type: 'button',
            className: 'btn-cookie btn-cookie-save',
            textContent: 'Kivalasztottak mentese',
            onClick: saveSelected
        });

        const acceptBtn = createElement('button', {
            type: 'button',
            className: 'btn-cookie btn-cookie-accept',
            textContent: 'Osszes elfogadasa',
            onClick: acceptAll
        });

        buttons.appendChild(rejectBtn);
        buttons.appendChild(saveBtn);
        buttons.appendChild(acceptBtn);

        // Assemble
        content.appendChild(header);
        content.appendChild(desc);
        content.appendChild(options);
        content.appendChild(buttons);
        banner.appendChild(content);

        document.body.appendChild(banner);

        // Animate in
        setTimeout(function() {
            banner.classList.add('show');
        }, 100);
    }

    /**
     * Accept all cookies
     */
    function acceptAll() {
        const consent = {
            version: CONSENT_VERSION,
            necessary: true,
            statistics: true,
            marketing: true
        };
        saveConsent(consent);
        hideBanner();
        applyConsent();
    }

    /**
     * Reject all optional cookies
     */
    function rejectAll() {
        const consent = {
            version: CONSENT_VERSION,
            necessary: true,
            statistics: false,
            marketing: false
        };
        saveConsent(consent);
        hideBanner();
    }

    /**
     * Save selected options
     */
    function saveSelected() {
        const statsCheckbox = document.getElementById('consent-statistics');
        const marketingCheckbox = document.getElementById('consent-marketing');

        const consent = {
            version: CONSENT_VERSION,
            necessary: true,
            statistics: statsCheckbox ? statsCheckbox.checked : false,
            marketing: marketingCheckbox ? marketingCheckbox.checked : false
        };
        saveConsent(consent);
        hideBanner();
        applyConsent();
    }

    /**
     * Hide the consent banner
     */
    function hideBanner() {
        const banner = document.getElementById('cookie-consent-banner');
        if (banner) {
            banner.classList.remove('show');
            setTimeout(function() {
                banner.remove();
            }, 300);
        }
    }

    /**
     * Apply consent settings (load allowed scripts)
     */
    function applyConsent() {
        loadGoogleAnalytics();
        loadFacebookMessenger();
    }

    /**
     * Reset consent (for settings page)
     */
    function resetConsent() {
        localStorage.removeItem(CONSENT_KEY);
        location.reload();
    }

    /**
     * Initialize on DOM ready
     */
    function init() {
        // Set default GA consent to denied
        if (typeof gtag === 'function') {
            gtag('consent', 'default', {
                'analytics_storage': 'denied',
                'ad_storage': 'denied'
            });
        }

        // Hide FB Messenger by default
        const fbChat = document.querySelector('.fb-customerchat');
        if (fbChat) {
            fbChat.style.display = 'none';
        }

        // Check if user already consented
        const consent = getConsent();
        if (consent) {
            applyConsent();
        } else {
            showBanner();
        }
    }

    // Expose functions globally
    window.CookieConsent = {
        hasConsent: hasConsent,
        resetConsent: resetConsent,
        showBanner: showBanner
    };

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
