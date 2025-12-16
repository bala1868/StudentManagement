document.addEventListener('DOMContentLoaded', async function() {
    console.log('🚀 DOM Content Loaded - Initializing...');
    
    await initializeLocalStorage();
    
    const navToggle = document.getElementById('navToggle');
    const navRight = document.getElementById('navRight');
    const navMenu = document.getElementById('navMenu');
    
    // Mobile menu toggle with overlay
    if (navToggle && navRight) {
        navToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            navRight.classList.toggle('active');
            navToggle.classList.toggle('active');
            document.body.classList.toggle('menu-open');
        });
    }

    // Close menu when clicking outside (on overlay)
    document.addEventListener('click', function(event) {
        if (navRight && navToggle) {
            const isClickInsideNav = navRight.contains(event.target) || navToggle.contains(event.target);
            if (!isClickInsideNav && navRight.classList.contains('active')) {
                navRight.classList.remove('active');
                navToggle.classList.remove('active');
                document.body.classList.remove('menu-open');
            }
        }
    });

    // Close menu when clicking on a link
    if (navMenu) {
        const navLinks = navMenu.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                if (window.innerWidth <= 768) {
                    if (navRight) navRight.classList.remove('active');
                    if (navToggle) navToggle.classList.remove('active');
                    document.body.classList.remove('menu-open');
                }
            });
        });
    }

    // Close menu on window resize if opened
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            if (navRight) navRight.classList.remove('active');
            if (navToggle) navToggle.classList.remove('active');
            document.body.classList.remove('menu-open');
        }
    });

    // Prevent scroll on body when menu is open on mobile
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.attributeName === 'class') {
                if (document.body.classList.contains('menu-open')) {
                    document.body.style.overflow = 'hidden';
                } else {
                    document.body.style.overflow = '';
                }
            }
        });
    });

    observer.observe(document.body, {
        attributes: true
    });

    initializeTheme();
    
    if (document.querySelector('.hero-carousel')) {
        initializeCarousel();
    }

    if (document.getElementById('countdown')) {
        initializeCountdown();
    }

    if (document.getElementById('recentStudentsList')) {
        loadRecentStudents();
        loadEditingStudentData();
    }
    
    console.log('✅ Initialization complete');
});

// ==================== THEME TOGGLER ====================
function initializeTheme() {
    const themeToggle = document.getElementById('themeToggle');
    const currentTheme = localStorage.getItem('theme') || 'light';
    
    document.documentElement.setAttribute('data-theme', currentTheme);
    
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            const theme = document.documentElement.getAttribute('data-theme');
            const newTheme = theme === 'light' ? 'dark' : 'light';
            
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
        });
    }
}