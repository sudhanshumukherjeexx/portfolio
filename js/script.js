// script.js
document.addEventListener('DOMContentLoaded', function() {
    // Get the toggle switch element
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;

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

    // Check for saved theme preference or use system preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    const savedTheme = localStorage.getItem('dark-theme');

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
});