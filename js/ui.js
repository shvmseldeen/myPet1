// ========== UI, TOASTS & ANIMATIONS ==========
function toggleMobileMenu() {
    document.getElementById('mobile-menu').classList.toggle('open');
}

function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    const icons = { success: 'fa-check-circle', error: 'fa-exclamation-circle', info: 'fa-info-circle' };
    const colors = { success: 'bg-green-500', error: 'bg-red-500', info: 'bg-navy-500' };
    
    const toast = document.createElement('div');
    toast.className = `toast ${colors[type]} text-ivory-100 px-5 py-3 rounded-xl shadow-lg flex items-center gap-3 min-w-[280px]`;
    toast.innerHTML = `<i class="fas ${icons[type]}"></i><span class="text-sm font-medium">${message}</span>`;
    container.appendChild(toast);
    
    requestAnimationFrame(() => toast.classList.add('show'));
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 400);
    }, 3500);
}

function initGSAPAnimations() {
    if (typeof gsap === 'undefined') return;
    gsap.registerPlugin(ScrollTrigger);
    
    gsap.utils.toArray('.hero-anim').forEach((el, i) => {
        gsap.from(el, { opacity: 1, y: 0, duration: 0.8, delay: 0.2 + i * 0.15, ease: 'power3.out' });
    });
    
    gsap.utils.toArray('.reveal-section').forEach(section => {
        gsap.fromTo(section, 
            { opacity: 0, y: 40 },
            { 
                opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
                scrollTrigger: { trigger: section, start: 'top 85%', toggleActions: 'play none none none' }
            }
        );
    });
    
    gsap.utils.toArray('.service-card, .review-card, .doctor-card, .shop-card, .pet-card, .step-item').forEach((card, i) => {
        gsap.fromTo(card,
            { opacity: 0, y: 20 },
            {
                opacity: 1, y: 0, duration: 0.6, delay: i % 4 * 0.1, ease: 'power3.out',
                scrollTrigger: { trigger: card, start: 'top 88%', toggleActions: 'play none none none' }
            }
        );
    });
}
