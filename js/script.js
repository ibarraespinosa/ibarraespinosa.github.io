document.addEventListener('DOMContentLoaded', function() {
    // Mobile Navigation
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    hamburger.addEventListener('click', function() {
        this.classList.toggle('active');
        navLinks.classList.toggle('active');
    });
    
    // Close mobile menu when clicking a link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 70,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Navbar scroll effect
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // Back to top button visibility
        const backToTop = document.getElementById('backToTop');
        if (backToTop) {
            if (window.scrollY > 300) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        }
    });
    
    // Back to top button
    const backToTopBtn = document.getElementById('backToTop');
    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    // Dark Mode Toggle
    const darkModeToggle = document.getElementById('darkModeToggle');
    const body = document.body;
    
    // Check for saved user preference
    if (darkModeToggle) {
        if (localStorage.getItem('darkMode') === 'enabled') {
            body.setAttribute('data-theme', 'dark');
            darkModeToggle.checked = true;
        }
        
        darkModeToggle.addEventListener('change', function() {
            if (this.checked) {
                body.setAttribute('data-theme', 'dark');
                localStorage.setItem('darkMode', 'enabled');
            } else {
                body.removeAttribute('data-theme');
                localStorage.setItem('darkMode', 'disabled');
            }
        });
    }
    
    // Publication Filters
    const filterButtons = document.querySelectorAll('.filter-btn');
    const publicationItems = document.querySelectorAll('.publication-item');
    const searchInput = document.getElementById('pubSearch');
    
    if (filterButtons.length > 0 && publicationItems.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Remove active class from all buttons
                filterButtons.forEach(btn => btn.classList.remove('active'));
                // Add active class to clicked button
                this.classList.add('active');
                
                const filterValue = this.getAttribute('data-filter');
                filterPublications(filterValue);
            });
        });
        
        // Search functionality
        if (searchInput) {
            searchInput.addEventListener('input', function() {
                const searchTerm = this.value.toLowerCase();
                const activeFilter = document.querySelector('.filter-btn.active')?.getAttribute('data-filter') || 'all';
                
                publicationItems.forEach(item => {
                    const text = item.textContent.toLowerCase();
                    const matchesSearch = text.includes(searchTerm);
                    const matchesFilter = activeFilter === 'all' || item.getAttribute('data-category').includes(activeFilter);
                    
                    if (matchesSearch && matchesFilter) {
                        item.style.display = 'flex';
                    } else {
                        item.style.display = 'none';
                    }
                });
            });
        }
    }
    
    function filterPublications(filter) {
        const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
        
        publicationItems.forEach(item => {
            const matchesFilter = filter === 'all' || item.getAttribute('data-category').includes(filter);
            const matchesSearch = item.textContent.toLowerCase().includes(searchTerm);
            
            if (matchesFilter && matchesSearch) {
                item.style.display = 'flex';
            } else {
                item.style.display = 'none';
            }
        });
    }
    
    // Initialize map
    if (document.getElementById('researchMap')) {
        const map = L.map('researchMap').setView([20, 0], 2);
        
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);
        
        // Add markers for research locations
        const locations = [
            {
                lat: 40.01499,
                lng: -105.27055,
                title: "NOAA GML - Boulder, CO",
                description: "Current position: Postdoctoral Researcher",
                type: "current"
            },
            {
                lat: -23.5505,
                lng: -46.6333,
                title: "Universidade de São Paulo",
                description: "PhD and Postdoc research on urban air quality",
                type: "collaboration"
            },
            {
                lat: 39.9042,
                lng: 116.4074,
                title: "Chinese Academy of Sciences",
                description: "Postdoc research on vehicle emissions in China",
                type: "collaboration"
            },
            {
                lat: 0.3136,
                lng: 32.5811,
                title: "Kampala, Uganda",
                description: "Aircraft measurements analysis",
                type: "field"
            },
            {
                lat: -33.4489,
                lng: -70.6693,
                title: "Santiago, Chile",
                description: "Early career research on urban emissions",
                type: "field"
            }
        ];
        
        const iconColors = {
            current: '#e74c3c',
            field: '#3498db',
            collaboration: '#2ecc71'
        };
        
        locations.forEach(loc => {
            const marker = L.marker([loc.lat, loc.lng], {
                icon: L.divIcon({
                    className: 'custom-icon',
                    html: `<div style="background-color: ${iconColors[loc.type]}; width: 20px; height: 20px; border-radius: 50%; border: 2px solid white;"></div>`,
                    iconSize: [24, 24]
                })
            }).addTo(map);
            
            marker.bindPopup(`
                <h3>${loc.title}</h3>
                <p>${loc.description}</p>
            `);
        });
    }
    
    // Form submission with formspree
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const submitBtn = this.querySelector('button[type="submit"]');
            const btnText = submitBtn.querySelector('.btn-text');
            const btnLoading = submitBtn.querySelector('.btn-loading');
            const formMessage = document.getElementById('formMessage');
            
            // Show loading state
            btnText.style.display = 'none';
            btnLoading.style.display = 'inline-block';
            formMessage.style.display = 'none';
            
            // Use the actual Formspree ID from your form's action
            const formAction = this.getAttribute('action');
            
            fetch(formAction, {
                method: 'POST',
                body: new FormData(this),
                headers: {
                    'Accept': 'application/json'
                }
            })
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('Network response was not ok');
                }
            })
            .then(data => {
                // Show success message
                formMessage.textContent = 'Thank you for your message! I will get back to you soon.';
                formMessage.classList.add('success');
                formMessage.style.display = 'block';
                contactForm.reset();
            })
            .catch(error => {
                // Show error message
                formMessage.textContent = 'There was a problem sending your message. Please try again later or email me directly.';
                formMessage.classList.add('error');
                formMessage.style.display = 'block';
                console.error('Error:', error);
            })
            .finally(() => {
                // Reset button state
                btnText.style.display = 'inline-block';
                btnLoading.style.display = 'none';
                
                // Hide message after 5 seconds
                setTimeout(() => {
                    formMessage.style.display = 'none';
                }, 5000);
            });
        });
    }
    
    // Animation on scroll
    const animateOnScroll = function() {
        const elements = document.querySelectorAll('.research-card, .software-card, .publication-item, .info-item, .blog-card');
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementPosition < windowHeight - 100) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    };
    
    // Set initial state for animated elements
    document.querySelectorAll('.research-card, .software-card, .publication-item, .info-item, .blog-card').forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    });
    
    // Run once on page load
    animateOnScroll();
    
    // Run on scroll
    window.addEventListener('scroll', animateOnScroll);
});