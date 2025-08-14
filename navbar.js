// Navbar component with improved error handling
(function() {
    'use strict';
    
    // Navbar configuration
    const NAVBAR_CONFIG = {
        brandName: 'advik.blog',
        containerId: 'navbar-container',
        navItems: [
            { text: 'About', href: 'https://www.advikbargoti.dev' },
            { text: 'Archives', href: '#' },
            { text: 'Contact', href: '#' }
        ]
    };
    
    // Create navigation items HTML
    function createNavItems(items) {
        if (!Array.isArray(items)) {
            console.warn('Invalid nav items provided, using empty array');
            items = [];
        }
        
        return items.map(item => {
            const href = item.href || '#';
            const text = item.text || 'Link';
            return `<a href="${href}" class="nav-link">${text}</a>`;
        }).join('');
    }
    
    // Create navbar HTML
    function createNavbar() {
        const navItems = createNavItems(NAVBAR_CONFIG.navItems);
        
        return `
            <nav class="navbar">
                <div class="navbar-brand">
                    <a href="/" class="domain-name">${NAVBAR_CONFIG.brandName}</a>
                </div>
                <div class="navbar-nav">
                    ${navItems}
                </div>
                <button class="theme-toggle" type="button" aria-label="Toggle theme">
                    <svg class="sun-icon" viewBox="0 0 24 24" aria-hidden="true">
                        <circle cx="12" cy="12" r="5"/>
                        <line x1="12" y1="1" x2="12" y2="3"/>
                        <line x1="12" y1="21" x2="12" y2="23"/>
                        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
                        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                        <line x1="1" y1="12" x2="3" y2="12"/>
                        <line x1="21" y1="12" x2="23" y2="12"/>
                        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
                        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
                    </svg>
                </button>
            </nav>
        `;
    }
    
    // Add event listeners to navbar
    function addNavbarEventListeners() {
        const themeToggle = document.querySelector('.theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', function(e) {
                e.preventDefault();
                if (typeof window.toggleTheme === 'function') {
                    window.toggleTheme();
                } else {
                    console.warn('toggleTheme function not available');
                }
            });
        }
    }
    
    // Load navbar into container
    function loadNavbar() {
        const container = document.getElementById(NAVBAR_CONFIG.containerId);
        
        if (!container) {
            console.error(`Navbar container with id '${NAVBAR_CONFIG.containerId}' not found`);
            return;
        }
        
        try {
            container.innerHTML = createNavbar();
            // Add event listeners after DOM insertion
            setTimeout(addNavbarEventListeners, 0);
        } catch (error) {
            console.error('Error loading navbar:', error);
        }
    }
    
    // Initialize navbar when DOM is ready
    function initNavbar() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', loadNavbar);
        } else {
            // DOM already loaded
            loadNavbar();
        }
    }
    
    // Start initialization
    initNavbar();
    
})();
