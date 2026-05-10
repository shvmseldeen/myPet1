// ========== INITIALIZATION & SCROLL ==========
document.addEventListener('DOMContentLoaded', () => {
    // 1. Setup UI
    updateAuthUI();
    updateCartUI();

    // 2. Render all dynamic HTML first so it exists on the page
    if (document.getElementById('shop-grid')) renderShop('all');
    if (document.getElementById('pet-grid')) renderPets();
    if (document.getElementById('calendar-days')) {
        renderCalendar();
        populatePetSelect();
    }

    // 3. Add a tiny delay to ensure the browser has finished drawing, then animate!
    setTimeout(() => {
        if (typeof initGSAPAnimations === 'function') {
            initGSAPAnimations();
        }
    }, 100); 
});

// Make the Navbar change colors on scroll
let lastScroll = 0;
window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
    if (!navbar) return; // Failsafe
    
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
