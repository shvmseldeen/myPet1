// ========== INITIALIZATION & SCROLL ==========
document.addEventListener('DOMContentLoaded', () => {
    updateAuthUI();
    updateCartUI();
    initGSAPAnimations();

    // Auto-detect page content and render appropriate functions
    if (document.getElementById('shop-grid')) renderShop('all');
    if (document.getElementById('pet-grid')) renderPets();
    if (document.getElementById('calendar-days')) {
        renderCalendar();
        populatePetSelect();
    }
});

let lastScroll = 0;
window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
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
