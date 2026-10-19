/* ===== SEASONAL & WEEKEND MOOD =====
   Adds a class to <html> so CSS can theme the site by season and by
   weekday/weekend. Set HEMISPHERE to 'south' to flip the seasons. */
(function () {
    const HEMISPHERE = 'north';
    const root = document.documentElement;
    const now = new Date();
    let month = now.getMonth(); // 0 = January ... 11 = December
    if (HEMISPHERE === 'south') month = (month + 6) % 12;

    let season;
    if (month >= 2 && month <= 4) {
        season = { name: 'spring', label: 'Spring', emoji: '🌸' };
    } else if (month >= 5 && month <= 7) {
        season = { name: 'summer', label: 'Summer', emoji: '☀️' };
    } else if (month >= 8 && month <= 10) {
        season = { name: 'autumn', label: 'Autumn', emoji: '🍂' };
    } else {
        season = { name: 'winter', label: 'Winter', emoji: '❄️' };
    }

    const day = now.getDay(); // 0 = Sunday ... 6 = Saturday
    const isWeekend = day === 0 || day === 6;

    root.classList.add('season-' + season.name);
    root.classList.add(isWeekend ? 'mode-weekend' : 'mode-weekday');

    window.seasonMood = { season: season, isWeekend: isWeekend };
})();

document.addEventListener('DOMContentLoaded', function() {
    // Sidebar Navigation Highlighting
    const navLinks = document.querySelectorAll('.sidebar-nav a');
    const sections = document.querySelectorAll('section');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= (sectionTop - 150)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });

    // Smooth Scrolling
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (!href) return;

            // Try to find the element on the current page
            // If the href is "index.html#software", we only want the "#software" part for querySelector
            const hash = href.includes('#') ? href.substring(href.indexOf('#')) : null;
            
            if (hash) {
                const targetSector = document.querySelector(hash);
                if (targetSector) {
                    e.preventDefault();
                    window.scrollTo({
                        top: targetSector.offsetTop - 20,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // Simple Card Hover Animation (JS backup for CSS)
    const cards = document.querySelectorAll('.bento-item');
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-4px)';
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
        });
    });

    // Mobile Hamburger (Optional - Sidebar is simple enough for now)
    const hamburger = document.querySelector('.hamburger');
    const sidebar = document.querySelector('.sidebar');
    if (hamburger) {
        hamburger.addEventListener('click', () => {
            sidebar.classList.toggle('mobile-active');
        });
    }

    // Dark Mode Functionality
    const darkModeToggle = document.getElementById('darkModeToggle');
    const htmlElement = document.documentElement;

    // Check for saved user preference
    const savedDarkMode = localStorage.getItem('darkMode');
    if (savedDarkMode === 'enabled') {
        htmlElement.classList.add('dark-mode');
        if (darkModeToggle) darkModeToggle.checked = true;
    }

    // Toggle Dark Mode
    if (darkModeToggle) {
        darkModeToggle.addEventListener('change', () => {
            if (darkModeToggle.checked) {
                htmlElement.classList.add('dark-mode');
                localStorage.setItem('darkMode', 'enabled');
            } else {
                htmlElement.classList.remove('dark-mode');
                localStorage.setItem('darkMode', 'disabled');
            }
        });
    }

    // Seasonal / weekend chip in the sidebar
    const mood = window.seasonMood;
    const sidebarEl = document.querySelector('.sidebar');
    if (mood && sidebarEl && !document.querySelector('.season-chip')) {
        const chip = document.createElement('div');
        chip.className = 'season-chip';
        chip.title = mood.isWeekend
            ? 'Weekend mood: taking it a little slower'
            : 'Weekday mood: focus mode';

        const emoji = document.createElement('span');
        emoji.className = 'season-chip-emoji';
        emoji.setAttribute('aria-hidden', 'true');
        emoji.textContent = mood.season.emoji;

        const label = document.createElement('span');
        label.textContent = mood.season.label + ' · ' + (mood.isWeekend ? 'Weekend' : 'Weekday');

        chip.appendChild(emoji);
        chip.appendChild(label);

        const footer = sidebar.querySelector('.sidebar-footer');
        if (footer) {
            sidebar.insertBefore(chip, footer);
        } else {
            sidebar.appendChild(chip);
        }
    }
});