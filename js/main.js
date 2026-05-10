// ========== INITIALIZATION & SCROLL ==========

// 1. Create a Master Setup Function
function initializeApp() {
    updateAuthUI();
    updateCartUI();

    // Render all dynamic HTML first
    if (document.getElementById('shop-grid')) renderShop('all');
    if (document.getElementById('pet-grid')) renderPets();
    if (document.getElementById('calendar-days')) {
        renderCalendar();
        populatePetSelect();
    }

    // Failsafe: Force everything to be visible immediately 
    // just in case the animation library fails to load over the internet
    document.querySelectorAll('.reveal-section, .service-card, .shop-card, .doctor-card').forEach(el => {
        el.style.opacity = '1';
    });

    // Run animations last
    setTimeout(() => {
        if (typeof initGSAPAnimations === 'function') {
            initGSAPAnimations();
        }
    }, 150); 
}

// 2. BULLETPROOF STARTUP
// If the browser already finished loading, run immediately. Otherwise, wait for it.
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}

// Navbar Scroll Effect
let lastScroll = 0;
window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
    if (!navbar) return; 
    
    const scroll = window.scrollY;
    if (scroll > 50) {
        navbar.classList.add('shadow-md');
        navbar.style.background = 'rgba(250,248,245,0.98)';
    } else {
        navbar.classList.remove('shadow-md');
        navbar.style.background = 'rgba(250,248,245,0.9)';
    }
    lastScroll = scroll;
});
