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
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSector = document.querySelector(targetId);
            
            if (targetSector) {
                const sidebarWidth = window.innerWidth > 768 ? 0 : 0; // Adjust if needed
                window.scrollTo({
                    top: targetSector.offsetTop - 20,
                    behavior: 'smooth'
                });
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
});