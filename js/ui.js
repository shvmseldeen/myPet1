// ========== UI, TOASTS & ANIMATIONS ==========
function toggleMobileMenu() {
    document.getElementById('mobile-menu').classList.toggle('open');
}

function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    const icons = { success: 'fa-check-circle', error: 'fa-exclamation-circle', info: 'fa-info-circle' };
    const colors = { success: 'bg-green-500', error: 'bg-red-500', info: 'bg-navy-500' };
    
    const toast = document.createElement('div');
    toast.className = `toast ${colors[type]} text-ivory-100 px-5 py-3 rounded-xl shadow-lg flex items-center gap-3 min-w-[280px] mb-3`;
    toast.innerHTML = `<i class="fas ${icons[type]}"></i><span class="text-sm font-medium">${message}</span>`;
    container.appendChild(toast);
    
    requestAnimationFrame(() => toast.classList.add('show'));
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 400);
    }, 3500);
}

function initGSAPAnimations() {
    // Failsafe in case GSAP fails to load from CDN
    if (typeof gsap === 'undefined') return;

    // 1. Hero Text Animation
    gsap.fromTo('.hero-anim', 
        { opacity: 0, y: 30 }, 
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.15, ease: 'power3.out' }
    );

    // 2. Reveal Page Sections immediately (Fixes the blank screen bug)
    gsap.fromTo('.reveal-section', 
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: 'power3.out' }
    );

    // 3. Stagger all the individual cards to pop in smoothly
    gsap.fromTo('.service-card, .doctor-card, .shop-card, .pet-card, .step-item, .review-card',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.05, ease: 'power3.out', delay: 0.2 }
    );
}
