// DOM Elements
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const heroBackgrounds = document.querySelectorAll('.hero-bg');
const heroContents = document.querySelectorAll('.hero-content');
const heroBackgroundsContainer = document.querySelector('.hero-backgrounds');
const bgDots = document.querySelectorAll('.bg-dot');
const navPrev = document.querySelector('.nav-prev');
const navNext = document.querySelector('.nav-next');
const contactForm = document.querySelector('.contact-form');
const categoryBtns = document.querySelectorAll('.category-btn');
const productCards = document.querySelectorAll('.product-card');
const statNumbers = document.querySelectorAll('.stat-number');
const searchInput = document.getElementById('product-search');
const scrollToTopBtn = document.getElementById('scrollToTop');
const progressBar = document.getElementById('progressBar');
const loadingOverlay = document.getElementById('loadingOverlay');
const timelineItems = document.querySelectorAll('.timeline-item');

// ===== SAFETY HELPERS =====
function safeSelect(selector, root = document) {
    const el = root.querySelector(selector);
    if (!el) {
        console.warn(`Selector not found: ${selector}`);
    }
    return el;
}

function safeSelectAll(selector, root = document) {
    const list = root.querySelectorAll(selector);
    if (!list || list.length === 0) {
        console.warn(`Selector list empty: ${selector}`);
    }
    return list;
}

function safeInit(name, fn) {
    try {
        if (typeof fn === 'function') fn();
    } catch (err) {
        console.error(`[Init Error] ${name}:`, err);
        try { showNotification(`${name} failed to initialize. Some features may be limited.`, 'info'); } catch (_) {}
    }
}

// Safe fetch with timeout
async function fetchWithTimeout(resource, options = {}) {
    const { timeout = 10000 } = options;
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
    try {
        const response = await fetch(resource, { ...options, signal: controller.signal });
        clearTimeout(id);
        return response;
    } catch (e) {
        clearTimeout(id);
        throw e;
    }
}

// Current slide index
let currentSlide = 0;
const totalSlides = heroBackgrounds.length;

// Auto-slide interval
let autoSlideInterval;

// Initialize the website
document.addEventListener('DOMContentLoaded', function() {
    safeInit('Loading Screen', initializeLoadingScreen);
    safeInit('Carousel', initializeCarousel);
    safeInit('Navigation', initializeNavigation);
    safeInit('Scroll Effects', initializeScrollEffects);
    safeInit('Contact Form', initializeContactForm);
    safeInit('Product Filtering', initializeProductFiltering);
    safeInit('Counter Animation', initializeCounterAnimation);
    safeInit('Scroll To Top', initializeScrollToTop);
    safeInit('Progress Bar', initializeProgressBar);
    safeInit('Timeline Animation', initializeTimelineAnimation);
});

// ===== CAROUSEL FUNCTIONALITY =====

function initializeCarousel() {
    if (!heroBackgroundsContainer || totalSlides === 0) {
        console.warn('Carousel disabled: missing container or slides');
        return;
    }
    try {
        // Initialize first slide
        heroBackgroundsContainer.classList.add('slide-0');
        // Set up auto-slide
        startAutoSlide();

        // Add event listeners for manual navigation safely
        if (bgDots && bgDots.length) {
            bgDots.forEach((dot, index) => {
                dot.addEventListener('click', () => goToSlide(index));
            });
        }
        if (navPrev) navPrev.addEventListener('click', previousSlide);
        if (navNext) navNext.addEventListener('click', nextSlide);

        // Pause auto-slide on hero hover if hero exists
        const heroSection = document.querySelector('.hero');
        if (heroSection) {
            heroSection.addEventListener('mouseenter', stopAutoSlide);
            heroSection.addEventListener('mouseleave', startAutoSlide);
            
            // Resume carousel when hero section comes back into view
            const heroObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        // Hero is visible, ensure carousel is running
                        startAutoSlide();
                    } else {
                        // Hero is not visible, optionally pause to save resources
                        // Comment out the line below if you want it to keep running
                        // stopAutoSlide();
                    }
                });
            }, { threshold: 0.1 });
            
            heroObserver.observe(heroSection);
        }

        // Keyboard navigation
        document.addEventListener('keydown', handleKeyboardNavigation);
    } catch (err) {
        console.error('[Carousel Error]', err);
        try { showNotification('Carousel failed to initialize. Some features may be limited.', 'info'); } catch (_) {}
    }
}

function goToSlide(slideIndex) {
    // Remove active class from current dot and content
    bgDots[currentSlide].classList.remove('active');
    
    // Check if we're on the contact page - if so, don't change text content
    const isContactPage = window.location.pathname.includes('contact.html') || document.title.includes('Contact');
    
    if (!isContactPage && heroContents.length > currentSlide) {
        heroContents[currentSlide].classList.remove('active');
    }
    
    // Remove all slide classes from container
    heroBackgroundsContainer.classList.remove('slide-0', 'slide-1', 'slide-2', 'slide-3');
    
    // Update current slide index
    currentSlide = slideIndex;
    
    // Add the appropriate slide class to create sliding effect
    heroBackgroundsContainer.classList.add(`slide-${currentSlide}`);
    
    // Add active class to new dot and content
    bgDots[currentSlide].classList.add('active');
    
    // Only change text content if not on contact page
    if (!isContactPage && heroContents.length > currentSlide) {
        heroContents[currentSlide].classList.add('active');
    } else if (isContactPage && heroContents.length > 0) {
        // Keep the first (and only) content active on contact page
        heroContents[0].classList.add('active');
    }
}

function nextSlide() {
    const nextIndex = (currentSlide + 1) % totalSlides;
    goToSlide(nextIndex);
}

function previousSlide() {
    const prevIndex = (currentSlide - 1 + totalSlides) % totalSlides;
    goToSlide(prevIndex);
}

function startAutoSlide() {
    stopAutoSlide(); // Clear any existing interval
    autoSlideInterval = setInterval(nextSlide, 3000); // Change slide every 3 seconds
}

function stopAutoSlide() {
    if (autoSlideInterval) {
        clearInterval(autoSlideInterval);
        autoSlideInterval = null;
    }
}

function handleKeyboardNavigation(e) {
    if (e.key === 'ArrowLeft') {
        previousSlide();
    } else if (e.key === 'ArrowRight') {
        nextSlide();
    }
}

// ===== NAVIGATION FUNCTIONALITY =====

function initializeNavigation() {
    // Mobile menu toggle
    if (hamburger) {
        hamburger.addEventListener('click', toggleMobileMenu);
    }
    
    // Close mobile menu when clicking on a link
    if (navLinks && navLinks.length > 0) {
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (navMenu) navMenu.classList.remove('active');
                if (hamburger) hamburger.classList.remove('active');
            });
        });
        
        // Smooth scrolling for navigation links
        navLinks.forEach(link => {
            link.addEventListener('click', handleSmoothScroll);
        });
    }
    
    // Update active navigation link on scroll
    window.addEventListener('scroll', updateActiveNavLink);
}

function toggleMobileMenu() {
    navMenu.classList.toggle('active');
    hamburger.classList.toggle('active');
}

function handleSmoothScroll(e) {
    const href = e.target.getAttribute('href');
    
    if (href.startsWith('#')) {
        e.preventDefault();
        const targetSection = document.querySelector(href);
        
        if (targetSection) {
            const offsetTop = targetSection.offsetTop - 80; // Account for fixed navbar
            
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    }
}

function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPos = window.scrollY + 100;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
        
        if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
            // Remove active class from all nav links
            navLinks.forEach(link => link.classList.remove('active'));
            // Add active class to current nav link
            if (navLink) {
                navLink.classList.add('active');
            }
        }
    });
}

// ===== SCROLL EFFECTS =====

function initializeScrollEffects() {
    // Navbar background on scroll
    window.addEventListener('scroll', handleNavbarScroll);
    
    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(handleIntersection, observerOptions);
    
    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.feature, .product-card, .section-header');
    animatedElements.forEach(el => observer.observe(el));
}

function handleNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = 'none';
    }
}

function handleIntersection(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}

// ===== CONTACT FORM =====

function initializeContactForm() {
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactSubmit);
    }
}

function handleContactSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(contactForm);
    const submitBtn = contactForm.querySelector('.submit-btn');
    const originalText = submitBtn.textContent;
    
    // Show loading state
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;
    
    // Simulate form submission (replace with actual form handling)
    setTimeout(() => {
        // Reset form
        contactForm.reset();
        
        // Show success message
        submitBtn.textContent = 'Message Sent!';
        submitBtn.style.background = '#28a745';
        
        // Reset button after 3 seconds
        setTimeout(() => {
            submitBtn.textContent = originalText;
            submitBtn.style.background = '#ff6b35';
            submitBtn.disabled = false;
        }, 3000);
    }, 2000);
}

// ===== UTILITY FUNCTIONS =====

// Debounce function for performance optimization
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Optimized scroll handler
const optimizedScrollHandler = debounce(() => {
    handleNavbarScroll();
    updateActiveNavLink();
}, 10);

// Replace the individual scroll listeners with the optimized one
window.removeEventListener('scroll', handleNavbarScroll);
window.removeEventListener('scroll', updateActiveNavLink);
window.addEventListener('scroll', optimizedScrollHandler);

// ===== PRELOADER (Optional) =====

function showPreloader() {
    const preloader = document.createElement('div');
    preloader.className = 'preloader';
    preloader.innerHTML = `
        <div class="preloader-content">
            <img src="Final SNV Logo.png" alt="SNV Logo" class="preloader-logo">
            <div class="loading-spinner"></div>
        </div>
    `;
    
    // Add preloader styles
    const style = document.createElement('style');
    style.textContent = `
        .preloader {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: white;
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999;
            transition: opacity 0.5s ease;
        }
        
        .preloader-content {
            text-align: center;
        }
        
        .preloader-logo {
            height: 80px;
            margin-bottom: 20px;
        }
        
        .loading-spinner {
            width: 40px;
            height: 40px;
            border: 4px solid #f3f3f3;
            border-top: 4px solid #ff6b35;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin: 0 auto;
        }
        
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(preloader);
    
    // Hide preloader after page load
    window.addEventListener('load', () => {
        setTimeout(() => {
            preloader.style.opacity = '0';
            setTimeout(() => {
                preloader.remove();
                style.remove();
            }, 500);
        }, 1000);
    });
}

// Initialize preloader
showPreloader();

// ===== PERFORMANCE OPTIMIZATIONS =====

// Lazy load background images
function lazyLoadBackgrounds() {
    const backgrounds = document.querySelectorAll('.hero-bg');
    
    backgrounds.forEach((bg, index) => {
        if (index === 0) return; // First image should load immediately
        
        const img = new Image();
        const bgImage = bg.style.backgroundImage.match(/url\(['"]?(.*?)['"]?\)/);
        
        if (bgImage) {
            img.onload = () => {
                bg.classList.add('loaded');
            };
            img.src = bgImage[1];
        }
    });
}

// Initialize lazy loading
lazyLoadBackgrounds();

// ===== ACCESSIBILITY ENHANCEMENTS =====

// Add ARIA labels and keyboard support
function enhanceAccessibility() {
    // Add ARIA labels to carousel controls
    bgDots.forEach((dot, index) => {
        dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
        dot.setAttribute('role', 'button');
        dot.setAttribute('tabindex', '0');
        
        // Add keyboard support for dots
        dot.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                goToSlide(index);
            }
        });
    });
    
    // Add ARIA live region for slide changes
    const liveRegion = document.createElement('div');
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.className = 'sr-only';
    liveRegion.style.cssText = 'position: absolute; left: -10000px; width: 1px; height: 1px; overflow: hidden;';
    document.body.appendChild(liveRegion);
    
    // Update live region when slide changes
    const originalGoToSlide = goToSlide;
    goToSlide = function(slideIndex) {
        originalGoToSlide(slideIndex);
        liveRegion.textContent = `Slide ${slideIndex + 1} of ${totalSlides}`;
    };
}

// Initialize accessibility enhancements
enhanceAccessibility();

// ===== ERROR HANDLING =====

// Global error handler
window.addEventListener('error', (e) => {
    console.error('JavaScript error:', e.error);
    // You can add error reporting here
});

// Handle missing images gracefully
document.addEventListener('DOMContentLoaded', () => {
    const images = document.querySelectorAll('img');
    
    images.forEach(img => {
        img.addEventListener('error', () => {
            img.style.display = 'none';
            console.warn(`Failed to load image: ${img.src}`);
        });
    });
});

// ===== PRODUCT FILTERING =====

function initializeProductFiltering() {
    if (categoryBtns.length === 0) return;

    categoryBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const category = btn.getAttribute('data-category');
            
            // Update active button
            categoryBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Filter products
            filterProducts(category);
        });
    });
}

function filterProducts(category) {
    productCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        
        if (category === 'all' || cardCategory === category) {
            card.classList.remove('hidden');
            // Add animation
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                card.style.transition = 'all 0.5s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, 100);
        } else {
            card.classList.add('hidden');
        }
    });
}

// ===== COUNTER ANIMATION =====

function initializeCounterAnimation() {
    if (statNumbers.length === 0) return;
    
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    statNumbers.forEach(stat => observer.observe(stat));
}

function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-target'));
    const duration = 2000; // 2 seconds
    const increment = target / (duration / 16); // 60fps
    let current = 0;
    
    const timer = setInterval(() => {
        current += increment;
        
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        
        // Format number with commas for large numbers
        const displayValue = Math.floor(current);
        element.textContent = displayValue.toLocaleString();
        
        // Add + sign for certain stats
        if (target >= 100 && element.textContent !== target.toString()) {
            element.textContent += '+';
        }
    }, 16);
}

// ===== ENHANCED CONTACT FORM =====

function initializeContactForm() {
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', handleEnhancedContactSubmit);
    
    // Add real-time validation
    const inputs = contactForm.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
        input.addEventListener('blur', validateField);
        input.addEventListener('input', clearFieldError);
    });
}

function handleEnhancedContactSubmit(e) {
    e.preventDefault();
    
    // Validate all fields
    const isValid = validateForm();
    if (!isValid) return;
    
    const submitBtn = contactForm.querySelector('.submit-btn');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoading = submitBtn.querySelector('.btn-loading');
    
    // Show loading state
    btnText.style.display = 'none';
    btnLoading.style.display = 'block';
    submitBtn.disabled = true;
    
    // Simulate form submission
    setTimeout(() => {
        // Reset form
        contactForm.reset();
        
        // Show success message
        btnLoading.style.display = 'none';
        btnText.textContent = 'Message Sent!';
        btnText.style.display = 'block';
        submitBtn.style.background = '#28a745';
        
        // Show success notification
        showNotification('Message sent successfully! We\'ll get back to you soon.', 'success');
        
        // Reset button after 3 seconds
        setTimeout(() => {
            btnText.textContent = 'Send Message';
            submitBtn.style.background = '#ff6b35';
            submitBtn.disabled = false;
        }, 3000);
    }, 2000);
}

function validateForm() {
    const requiredFields = contactForm.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!validateField({ target: field })) {
            isValid = false;
        }
    });
    
    return isValid;
}

function validateField(e) {
    const field = e.target;
    const value = field.value.trim();
    const fieldName = field.name;
    
    // Remove existing error
    clearFieldError({ target: field });
    
    // Validation rules
    let isValid = true;
    let errorMessage = '';
    
    if (field.hasAttribute('required') && !value) {
        isValid = false;
        errorMessage = 'This field is required';
    } else if (fieldName === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid email address';
        }
    } else if (fieldName === 'phone' && value) {
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        if (!phoneRegex.test(value.replace(/[\s\-\(\)]/g, ''))) {
            isValid = false;
            errorMessage = 'Please enter a valid phone number';
        }
    }
    
    if (!isValid) {
        showFieldError(field, errorMessage);
    }
    
    return isValid;
}

function showFieldError(field, message) {
    // Find the .form-group container to place the error consistently
    const group = field.closest('.form-group') || field.parentNode;
    group.classList.add('has-error');

    // Highlight borders for input-group wrappers too
    const inputGroup = field.closest('.input-group');
    if (inputGroup) {
        inputGroup.classList.add('has-error');
    } else {
        field.style.borderColor = '#dc3545';
    }

    // Avoid duplicating error messages
    if (group.querySelector('.field-error')) return;

    const errorElement = document.createElement('span');
    errorElement.className = 'field-error';
    errorElement.textContent = message;
    errorElement.style.cssText = 'color: #dc3545; font-size: 0.85rem; margin-top: 6px; display: block;';
    group.appendChild(errorElement);
}

function clearFieldError(e) {
    const field = e.target;
    const group = field.closest('.form-group') || field.parentNode;

    // Reset borders
    field.style.borderColor = '#e1e5e9';
    const inputGroup = field.closest('.input-group');
    if (inputGroup) {
        inputGroup.classList.remove('has-error');
    }
    group.classList.remove('has-error');

    const errorElement = group.querySelector('.field-error');
    if (errorElement) {
        errorElement.remove();
    }
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#28a745' : '#ff6b35'};
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 5 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 5000);
}

// ===== LOADING SCREEN =====

function initializeLoadingScreen() {
    if (!loadingOverlay) return;
    
    // Hide loading screen after page loads
    window.addEventListener('load', () => {
        setTimeout(() => {
            loadingOverlay.classList.add('hidden');
            setTimeout(() => {
                loadingOverlay.style.display = 'none';
            }, 500);
        }, 1500); // Show loading for at least 1.5 seconds
    });
}

// ===== SCROLL TO TOP BUTTON =====

function initializeScrollToTop() {
    if (!scrollToTopBtn) return;
    
    // Show/hide button based on scroll position
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            scrollToTopBtn.classList.add('visible');
        } else {
            scrollToTopBtn.classList.remove('visible');
        }
    });
    
    // Scroll to top when clicked
    scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ===== PROGRESS BAR =====

function initializeProgressBar() {
    if (!progressBar) return;
    
    window.addEventListener('scroll', () => {
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;
        const scrollTop = window.scrollY;
        const scrollPercent = (scrollTop / (documentHeight - windowHeight)) * 100;
        
        progressBar.style.width = Math.min(scrollPercent, 100) + '%';
    });
}

// ===== TIMELINE ANIMATION =====

function initializeTimelineAnimation() {
    if (timelineItems.length === 0) return;
    
    const observerOptions = {
        threshold: 0.3,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('animate');
                }, index * 200); // Stagger animation
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    timelineItems.forEach(item => observer.observe(item));
}

// ===== PRODUCT SEARCH =====

function initializeProductSearch() {
    if (!searchInput) return;
    
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase().trim();
        filterProductsBySearch(searchTerm);
    });
    
    // Clear search when category changes
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            searchInput.value = '';
        });
    });
}

function filterProductsBySearch(searchTerm) {
    productCards.forEach(card => {
        const title = card.querySelector('h3').textContent.toLowerCase();
        const description = card.querySelector('p').textContent.toLowerCase();
        const features = Array.from(card.querySelectorAll('.product-features li'))
            .map(li => li.textContent.toLowerCase()).join(' ');
        
        const matchesSearch = !searchTerm || 
            title.includes(searchTerm) || 
            description.includes(searchTerm) || 
            features.includes(searchTerm);
        
        if (matchesSearch) {
            card.classList.remove('hidden');
            // Add highlight animation
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                card.style.transition = 'all 0.5s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, 100);
        } else {
            card.classList.add('hidden');
        }
    });
    
    // Show "no results" message if needed
    const visibleCards = Array.from(productCards).filter(card => !card.classList.contains('hidden'));
    showNoResultsMessage(visibleCards.length === 0 && searchTerm);
}

function showNoResultsMessage(show) {
    let noResultsMsg = document.querySelector('.no-results-message');
    
    if (show && !noResultsMsg) {
        noResultsMsg = document.createElement('div');
        noResultsMsg.className = 'no-results-message';
        noResultsMsg.innerHTML = `
            <div style="text-align: center; padding: 60px 20px; color: #666;">
                <svg width="80" height="80" viewBox="0 0 80 80" fill="none" style="margin-bottom: 20px;">
                    <circle cx="40" cy="40" r="35" stroke="#ddd" stroke-width="2"/>
                    <path d="M25 40h30M40 25v30" stroke="#ddd" stroke-width="2"/>
                </svg>
                <h3 style="margin-bottom: 10px; color: #333;">No products found</h3>
                <p>Try adjusting your search terms or browse all products.</p>
            </div>
        `;
        document.querySelector('.products-grid').appendChild(noResultsMsg);
    } else if (!show && noResultsMsg) {
        noResultsMsg.remove();
    }
}

// ===== ENHANCED ANIMATIONS =====

// Add smooth reveal animations for sections
function initializeRevealAnimations() {
    const sections = document.querySelectorAll('section');
    
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Section is visible - animate in
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            } else {
                // Section is not visible - reset for re-animation
                entry.target.style.opacity = '0';
                entry.target.style.transform = 'translateY(30px)';
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'all 0.8s ease';
        revealObserver.observe(section);
    });
}

// Initialize reveal animations
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(initializeRevealAnimations, 2000); // After loading screen
});

// ===== KEYBOARD SHORTCUTS =====

document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + K to focus search
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        if (searchInput) {
            searchInput.focus();
            searchInput.select();
        }
    }
    
    // Escape to clear search
    if (e.key === 'Escape' && searchInput) {
        searchInput.value = '';
        searchInput.blur();
        filterProductsBySearch('');
    }
});

// ===== PERFORMANCE OPTIMIZATIONS =====

// Lazy load images when they come into view
function initializeLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Initialize lazy loading
document.addEventListener('DOMContentLoaded', initializeLazyLoading);

// ===== PRODUCT TABS =====

function initializeProductTabs() {
    const tabsContainer = document.querySelector('.product-tabs');
    if (!tabsContainer) return;

    const tabButtons = tabsContainer.querySelectorAll('.product-tab-btn');
    const tabContents = document.querySelectorAll('.product-tab-content');

    // Set the first tab as active by default
    if (tabButtons.length > 0) {
        tabButtons[0].classList.add('active');
        const firstTabId = tabButtons[0].dataset.tab;
        const firstTabContent = document.getElementById(firstTabId);
        if (firstTabContent) {
            firstTabContent.classList.add('active');
        }
    }

    tabsContainer.addEventListener('click', (e) => {
        const clicked = e.target.closest('.product-tab-btn');
        if (!clicked) return;

        // Remove active classes from all buttons and content
        tabButtons.forEach(btn => btn.classList.remove('active'));
        tabContents.forEach(content => content.classList.remove('active'));

        // Add active class to clicked button and corresponding content
        clicked.classList.add('active');
        const tabId = clicked.dataset.tab;
        const activeContent = document.getElementById(tabId);
        if (activeContent) {
            activeContent.classList.add('active');
        }
    });

}

document.addEventListener('DOMContentLoaded', function() {
    safeInit('Product Tabs', initializeProductTabs);
});

