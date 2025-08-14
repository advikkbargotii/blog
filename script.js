// Theme management with improved error handling
(function() {
    'use strict';
    
    // Valid theme values
    const VALID_THEMES = ['light', 'dark'];
    const DEFAULT_THEME = 'light';
    
    let currentTheme = DEFAULT_THEME;
    
    // Safe localStorage operations with fallback
    const storage = {
        get: function(key) {
            try {
                return localStorage.getItem(key);
            } catch (e) {
                console.warn('localStorage not available:', e);
                return null;
            }
        },
        set: function(key, value) {
            try {
                localStorage.setItem(key, value);
            } catch (e) {
                console.warn('Could not save to localStorage:', e);
            }
        }
    };
    
    // Validate theme value
    function isValidTheme(theme) {
        return VALID_THEMES.includes(theme);
    }
    
    // Apply theme to document
    function applyTheme(theme) {
        if (!document.documentElement) {
            console.error('Document element not available');
            return;
        }
        
        if (theme === 'dark') {
            document.documentElement.setAttribute('data-theme', 'dark');
        } else {
            document.documentElement.removeAttribute('data-theme');
        }
    }
    
    // Toggle between light and dark theme
    function toggleTheme() {
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
    }
    
    // Set theme with validation
    function setTheme(theme) {
        if (!isValidTheme(theme)) {
            console.warn('Invalid theme:', theme, 'Using default:', DEFAULT_THEME);
            theme = DEFAULT_THEME;
        }
        
        currentTheme = theme;
        applyTheme(theme);
        storage.set('theme', theme);
    }
    
    // Load saved theme on page load
    function loadTheme() {
        const savedTheme = storage.get('theme');
        const themeToUse = isValidTheme(savedTheme) ? savedTheme : DEFAULT_THEME;
        setTheme(themeToUse);
    }
    
    // Get current theme (for external access if needed)
    function getCurrentTheme() {
        return currentTheme;
    }
    
    // Make functions globally available
    window.toggleTheme = toggleTheme;
    window.getCurrentTheme = getCurrentTheme;
    
    // Initialize theme when DOM is loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', loadTheme);
    } else {
        // DOM already loaded
        loadTheme();
    }
    
})();
