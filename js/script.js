// script.js
document.addEventListener('DOMContentLoaded', function() {
    // Initialize smooth scroll
    initializeSmoothScroll();
});

function toggleContent() {
    const moreContent = document.getElementById('more-content');
    const readMoreBtn = document.querySelector('.read-more-btn');
    
    if (moreContent.classList.contains('show')) {
        moreContent.classList.remove('show');
        readMoreBtn.textContent = 'Read More';
        
        // Scroll to the about section
        document.querySelector('.about-section').scrollIntoView({ behavior: 'smooth' });
    } else {
        moreContent.classList.add('show');
        readMoreBtn.textContent = 'Read Less';
    }
}

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