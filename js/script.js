// script.js

document.addEventListener('DOMContentLoaded', function() {
    // Theme Management
    initializeTheme();
    
    // Smooth Scrolling
    initializeSmoothScroll();
});

// Theme Management Functions
function initializeTheme() {
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    const savedTheme = localStorage.getItem('dark-theme');

    // Function to set theme
    function setTheme(isDark) {
        if (isDark) {
            body.classList.add('dark-theme');
            themeToggle.checked = true;
        } else {
            body.classList.remove('dark-theme');
            themeToggle.checked = false;
        }
        localStorage.setItem('dark-theme', isDark);
    }

    // Set initial theme
    if (savedTheme !== null) {
        setTheme(savedTheme === 'true');
    } else {
        setTheme(prefersDark.matches);
    }

    // Listen for toggle changes
    themeToggle.addEventListener('change', (e) => {
        setTheme(e.target.checked);
    });

    // Listen for system theme changes
    prefersDark.addEventListener('change', (e) => {
        if (localStorage.getItem('dark-theme') === null) {
            setTheme(e.matches);
        }
    });
}

// Read More Toggle Function
function toggleContent() {
    const moreContent = document.getElementById('more-content');
    const readMoreBtn = document.querySelector('.read-more-btn');
    
    if (moreContent.classList.contains('show')) {
        moreContent.classList.remove('show');
        readMoreBtn.textContent = 'Read More';
        
        // Smooth scroll to about section
        document.querySelector('.about-section').scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
    } else {
        moreContent.classList.add('show');
        readMoreBtn.textContent = 'Read Less';
    }
}

// Smooth Scrolling Function
function initializeSmoothScroll() {
    // Get all navigation links
    const navLinks = document.querySelectorAll('.nav-links a');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Get the target section id from the href
            const targetId = this.getAttribute('href');
            
            // Check if it's an internal link (starts with #)
            if (targetId.startsWith('#')) {
                e.preventDefault();
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    // Scroll to the target section
                    targetSection.scrollIntoView({ 
                        behavior: 'smooth',
                        block: 'start'
                    });
                    
                    // Update URL without page reload
                    history.pushState(null, '', targetId);
                }
            }
        });
    });

    // Handle initial hash in URL
    if (window.location.hash) {
        const targetSection = document.querySelector(window.location.hash);
        if (targetSection) {
            setTimeout(() => {
                targetSection.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                });
            }, 100);
        }
    }
}