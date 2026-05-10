// ========== INITIALIZATION & SCROLL ==========
document.addEventListener('DOMContentLoaded', () => {
    updateAuthUI();
    updateCartUI();

    // 1. RENDER ALL CONTENT FIRST
    // This ensures all products, pets, and calendar days exist in the HTML
    if (document.getElementById('shop-grid')) renderShop('all');
    if (document.getElementById('pet-grid')) renderPets();
    if (document.getElementById('calendar-days')) {
        renderCalendar();
        populatePetSelect();
    }

    // 2. RUN ANIMATIONS LAST
    // A tiny delay ensures the browser has completely finished drawing the new HTML
    setTimeout(() => {
        if (typeof initGSAPAnimations === 'function') {
            initGSAPAnimations();
        }
    }, 100); 
});

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
