// ========== STATE & LOCAL STORAGE ==========
let cart = JSON.parse(localStorage.getItem('mypet_cart')) || [];
let isLoggedIn = localStorage.getItem('token') !== null;

let pets = [
    { id: 1, name: 'Max', type: 'Dog', breed: 'Golden Retriever', age: 3, img: 'https://picsum.photos/seed/golden-dog/300/300.jpg', nextVax: '2025-02-15', history: ['Annual checkup - Dec 2024', 'Rabies vaccine - Jun 2024', 'Dental cleaning - Mar 2024'], appointments: ['Grooming - Jan 20, 2025'] },
    { id: 2, name: 'Luna', type: 'Cat', breed: 'Persian', age: 2, img: 'https://picsum.photos/seed/persian-cat/300/300.jpg', nextVax: '2025-03-10', history: ['FVRCP vaccine - Nov 2024', 'Spay surgery - Aug 2024'], appointments: ['Vet Checkup - Feb 5, 2025'] }
];

let calendarDate = new Date();
let selectedDate = null;
let selectedTime = null;

const API_URL = 'http://localhost:5000/api';

const shopProducts = [
    { id: 1, name: 'Premium Kibble', category: 'food', price: 29.99, img: 'https://picsum.photos/seed/petfood1/400/400.jpg', desc: 'Grain-free, high-protein formula' },
    { id: 2, name: 'Salmon Feast', category: 'food', price: 34.99, img: 'https://picsum.photos/seed/petfood2/400/400.jpg', desc: 'Wild-caught salmon recipe' },
    { id: 3, name: 'Interactive Ball', category: 'toys', price: 12.99, img: 'https://picsum.photos/seed/pettoy1/400/400.jpg', desc: 'Tough, bouncy, and engaging' },
    { id: 4, name: 'Plush Squeaky Toy', category: 'toys', price: 9.99, img: 'https://picsum.photos/seed/pettoy2/400/400.jpg', desc: 'Soft and fun for hours' },
    { id: 5, name: 'Leather Leash', category: 'accessories', price: 24.99, img: 'https://picsum.photos/seed/petacc1/400/400.jpg', desc: 'Handcrafted genuine leather' },
    { id: 6, name: 'Cozy Collar', category: 'accessories', price: 18.99, img: 'https://picsum.photos/seed/petacc2/400/400.jpg', desc: 'Padded & adjustable fit' },
    { id: 7, name: 'Vitamin Supplements', category: 'health', price: 22.99, img: 'https://picsum.photos/seed/pethealth1/400/400.jpg', desc: 'Complete daily nutrition' },
    { id: 8, name: 'Dental Chews', category: 'health', price: 15.99, img: 'https://picsum.photos/seed/pethealth2/400/400.jpg', desc: 'Fresh breath & clean teeth' }
];

const timeSlots = ['9:00 AM', '10:00 AM', '11:00 AM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'];

// ========== INITIALIZATION ==========
document.addEventListener('DOMContentLoaded', () => {
    updateAuthUI();
    updateCartUI();
    initGSAPAnimations();

    // Auto-detect page content and render
    if (document.getElementById('shop-grid')) renderShop('all');
    if (document.getElementById('pet-grid')) renderPets();
    if (document.getElementById('calendar-days')) {
        renderCalendar();
        populatePetSelect();
    }
});

// ========== MOBILE MENU ==========
function toggleMobileMenu() {
    document.getElementById('mobile-menu').classList.toggle('open');
}

// ========== AUTH & BACKEND INTEGRATION ==========
function openAuth(type) {
    document.getElementById('auth-modal').classList.add('open');
    switchAuth(type);
}
function closeAuth() {
    document.getElementById('auth-modal').classList.remove('open');
}
function switchAuth(type) {
    if (type === 'login') {
        document.getElementById('login-form').classList.remove('hidden');
        document.getElementById('signup-form').classList.add('hidden');
        document.getElementById('auth-title').textContent = 'Welcome Back';
        document.getElementById('auth-subtitle').textContent = 'Sign in to manage your pet\'s care';
    } else {
        document.getElementById('login-form').classList.add('hidden');
        document.getElementById('signup-form').classList.remove('hidden');
        document.getElementById('auth-title').textContent = 'Join PawLux';
        document.getElementById('auth-subtitle').textContent = 'Create an account to get started';
    }
}

function updateAuthUI() {
    const btnLogin = document.getElementById('btn-login');
    const btnSignup = document.getElementById('btn-signup');
    const btnLogout = document.getElementById('btn-logout');

    if (isLoggedIn) {
        if(btnLogin) btnLogin.classList.add('hidden');
        if(btnSignup) btnSignup.classList.add('hidden');
        if(btnLogout) btnLogout.classList.remove('hidden');
    } else {
        if(btnLogin) btnLogin.classList.remove('hidden');
        if(btnSignup) btnSignup.classList.remove('hidden');
        if(btnLogout) btnLogout.classList.add('hidden');
    }
}

function handleLogout() {
    isLoggedIn = false;
    localStorage.removeItem('token');
    updateAuthUI();
    showToast('Logged out successfully.', 'info');
}

async function handleLogin() {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    if (!email || !password) { showToast('Please fill in all fields', 'error'); return; }
    
    try {
        const res = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const data = await res.json();

        if (res.ok) {
            isLoggedIn = true;
            localStorage.setItem('token', data.token);
            updateAuthUI();
            closeAuth();
            showToast(`Welcome back, ${data.user.name}!`, 'success');
        } else {
            showToast(data.message, 'error');
        }
    } catch (err) {
        showToast('Server error. Is the backend running?', 'error');
    }
}

async function handleSignup() {
    const name = document.getElementById('signup-name').value;
    const email = document.getElementById('signup-email').value;
    const phone = document.getElementById('signup-phone').value;
    const password = document.getElementById('signup-password').value;
    
    if (!name || !email || !password || !phone) { showToast('Please fill in all required fields', 'error'); return; }
    
    try {
        const res = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, phone, password })
        });
        const data = await res.json();

        if (res.ok) {
            isLoggedIn = true;
            localStorage.setItem('token', data.token);
            updateAuthUI();
            closeAuth();
            showToast('Account created successfully!', 'success');
        } else {
            showToast(data.message, 'error');
        }
    } catch (err) {
        showToast('Server error. Is the backend running?', 'error');
    }
}

// ========== CART & CHECKOUT ==========
function saveCart() {
    localStorage.setItem('mypet_cart', JSON.stringify(cart));
}

function toggleCart() {
    const panel = document.getElementById('cart-panel');
    const overlay = document.getElementById('cart-overlay');
    panel.classList.toggle('open');
    overlay.classList.toggle('hidden');
}

function addToCart(productId) {
    const product = shopProducts.find(p => p.id === productId);
    if (!product) return;
    const existing = cart.find(c => c.id === productId);
    if (existing) { existing.qty++; }
    else { cart.push({ ...product, qty: 1 }); }
    saveCart();
    updateCartUI();
    showToast(`${product.name} added to cart!`, 'success');
}

function removeFromCart(productId) {
    cart = cart.filter(c => c.id !== productId);
    saveCart();
    updateCartUI();
}

function updateCartQty(productId, delta) {
    const item = cart.find(c => c.id === productId);
    if (item) {
        item.qty += delta;
        if (item.qty <= 0) removeFromCart(productId);
        else { saveCart(); updateCartUI(); }
    }
}

function updateCartUI() {
    const countEl = document.getElementById('cart-count');
    const listEl = document.getElementById('cart-list');
    const emptyEl = document.getElementById('cart-empty');
    const footerEl = document.getElementById('cart-footer');
    const totalEl = document.getElementById('cart-total');
    
    const totalItems = cart.reduce((sum, c) => sum + c.qty, 0);
    const totalPrice = cart.reduce((sum, c) => sum + c.price * c.qty, 0);
    
    if (totalItems > 0) {
        countEl.textContent = totalItems;
        countEl.classList.remove('hidden');
        if(emptyEl) emptyEl.classList.add('hidden');
        if(listEl) listEl.classList.remove('hidden');
        if(footerEl) footerEl.classList.remove('hidden');
    } else {
        countEl.classList.add('hidden');
        if(emptyEl) emptyEl.classList.remove('hidden');
        if(listEl) listEl.classList.add('hidden');
        if(footerEl) footerEl.classList.add('hidden');
    }
    
    if(totalEl) totalEl.textContent = `$${totalPrice.toFixed(2)}`;
    
    if(listEl) {
        listEl.innerHTML = cart.map(item => `
            <div class="flex gap-4 items-center bg-ivory-50 rounded-xl p-3 border border-ivory-300">
                <img src="${item.img}" class="w-16 h-16 rounded-lg object-cover" alt="${item.name}">
                <div class="flex-1 min-w-0">
                    <p class="text-sm font-semibold text-navy-500 truncate">${item.name}</p>
                    <p class="text-sm text-gold-400 font-bold">$${item.price.toFixed(2)}</p>
                    <div class="flex items-center gap-2 mt-1">
                        <button onclick="updateCartQty(${item.id}, -1)" class="w-6 h-6 rounded-md bg-ivory-200 text-navy-500 flex items-center justify-center text-xs hover:bg-ivory-300 transition-colors">−</button>
                        <span class="text-xs font-semibold text-navy-500">${item.qty}</span>
                        <button onclick="updateCartQty(${item.id}, 1)" class="w-6 h-6 rounded-md bg-ivory-200 text-navy-500 flex items-center justify-center text-xs hover:bg-ivory-300 transition-colors">+</button>
                    </div>
                </div>
                <button onclick="removeFromCart(${item.id})" class="text-navy-200 hover:text-red-400 transition-colors"><i class="fas fa-trash-alt text-sm"></i></button>
            </div>
        `).join('');
    }
}

async function checkout() {
    if (cart.length === 0) return;
    if (!isLoggedIn) {
        showToast('Please login to checkout', 'error');
        openAuth('login');
        return;
    }

    const token = localStorage.getItem('token');
    const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    const cartItems = cart.map(item => ({ productId: item.id, name: item.name, price: item.price, quantity: item.qty }));

    try {
        const res = await fetch(`${API_URL}/orders/checkout`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ cartItems, totalAmount })
        });
        
        const data = await res.json();

        if (res.ok) {
            showToast('Order placed successfully!', 'success');
            cart = [];
            saveCart();
            updateCartUI();
            toggleCart();
        } else {
            showToast(data.message, 'error');
        }
    } catch (err) {
        showToast('Error processing checkout.', 'error');
    }
}

// ========== SHOP ==========
function renderShop(category) {
    const grid = document.getElementById('shop-grid');
    if(!grid) return;
    
    const filtered = category === 'all' ? shopProducts : shopProducts.filter(p => p.category === category);
    grid.innerHTML = filtered.map(p => `
        <div class="shop-card bg-ivory-50 rounded-2xl overflow-hidden border border-ivory-300 group" data-category="${p.category}">
            <div class="h-48 overflow-hidden relative">
                <img src="${p.img}" class="w-full h-full object-cover" alt="${p.name}">
                <div class="absolute top-3 right-3 px-3 py-1 rounded-full bg-navy-500/80 text-ivory-100 text-xs font-semibold backdrop-blur-sm">${p.category}</div>
            </div>
            <div class="p-5">
                <h3 class="text-base font-bold text-navy-500 mb-1">${p.name}</h3>
                <p class="text-xs text-navy-300 mb-3">${p.desc}</p>
                <div class="flex items-center justify-between">
                    <span class="text-lg font-bold text-gold-400">$${p.price.toFixed(2)}</span>
                    <button onclick="addToCart(${p.id})" class="btn-gold px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5">
                        <i class="fas fa-plus"></i> Add
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}
function filterShop(category) {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    event.target.classList.add('active');
    renderShop(category);
}

// ========== PETS ==========
function renderPets() {
    const grid = document.getElementById('pet-grid');
    if(!grid) return;
    grid.innerHTML = pets.map(pet => {
        const daysUntilVax = Math.ceil((new Date(pet.nextVax) - new Date()) / (1000 * 60 * 60 * 24));
        const vaxUrgent = daysUntilVax <= 30;
        return `
        <div class="pet-card bg-ivory-100 rounded-2xl overflow-hidden border border-ivory-300">
            <div class="h-48 overflow-hidden relative">
                <img src="${pet.img}" class="w-full h-full object-cover" alt="${pet.name}">
                <div class="absolute top-3 left-3 px-3 py-1 rounded-full bg-ivory-100/90 text-navy-500 text-xs font-semibold backdrop-blur-sm">${pet.type}</div>
                ${vaxUrgent ? '<div class="absolute top-3 right-3 px-3 py-1 rounded-full bg-amber-500/90 text-ivory-100 text-xs font-semibold backdrop-blur-sm flex items-center gap-1"><i class="fas fa-bell"></i> Vax Due</div>' : ''}
            </div>
            <div class="p-5">
                <div class="flex items-center justify-between mb-3">
                    <h3 class="text-lg font-bold text-navy-500">${pet.name}</h3>
                    <span class="text-xs text-navy-200">${pet.age} yrs • ${pet.breed}</span>
                </div>
                ${vaxUrgent ? `<div class="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-3 flex items-start gap-2">
                    <i class="fas fa-syringe text-amber-500 mt-0.5"></i>
                    <div>
                        <p class="text-xs font-semibold text-amber-700">Next Vaccination</p>
                        <p class="text-xs text-amber-600">${new Date(pet.nextVax).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} (${daysUntilVax} days)</p>
                    </div>
                </div>` : `<div class="bg-green-50 border border-green-200 rounded-xl p-3 mb-3 flex items-start gap-2">
                    <i class="fas fa-check-circle text-green-500 mt-0.5"></i>
                    <div>
                        <p class="text-xs font-semibold text-green-700">Vaccination Up to Date</p>
                        <p class="text-xs text-green-600">Next: ${new Date(pet.nextVax).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                    </div>
                </div>`}
                <div class="mb-3">
                    <p class="text-xs font-semibold text-navy-500 mb-1.5 uppercase tracking-wider">Medical History</p>
                    <ul class="space-y-1">${pet.history.map(h => `<li class="text-xs text-navy-300 flex items-center gap-1.5"><i class="fas fa-circle text-gold-400" style="font-size:4px"></i>${h}</li>`).join('')}</ul>
                </div>
                <div>
                    <p class="text-xs font-semibold text-navy-500 mb-1.5 uppercase tracking-wider">Upcoming</p>
                    ${pet.appointments.map(a => `<p class="text-xs text-gold-400 font-medium flex items-center gap-1.5"><i class="fas fa-calendar"></i>${a}</p>`).join('')}
                </div>
            </div>
        </div>`;
    }).join('');
}
function showAddPetForm() {
    document.getElementById('add-pet-form').classList.toggle('hidden');
}
function addPet() {
    const name = document.getElementById('pet-name-input').value.trim();
    const type = document.getElementById('pet-type-input').value;
    const breed = document.getElementById('pet-breed-input').value.trim();
    const age = document.getElementById('pet-age-input').value;
    if (!name || !breed || !age) { showToast('Please fill in all pet details', 'error'); return; }
    
    const seedMap = { Dog: 'new-dog-pet', Cat: 'new-cat-pet', Bird: 'new-bird-pet', Rabbit: 'new-rabbit-pet' };
    const newPet = {
        id: Date.now(),
        name, type, breed, age: parseInt(age),
        img: `https://picsum.photos/seed/${seedMap[type] || 'new-pet'}/300/300.jpg`,
        nextVax: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        history: ['Initial registration'],
        appointments: []
    };
    pets.push(newPet);
    renderPets();
    document.getElementById('add-pet-form').classList.add('hidden');
    document.getElementById('pet-name-input').value = '';
    document.getElementById('pet-breed-input').value = '';
    document.getElementById('pet-age-input').value = '';
    showToast(`${name} has been added to your pets!`, 'success');
}

// ========== CALENDAR & APPOINTMENTS ==========
function renderCalendar() {
    const calEl = document.getElementById('calendar-month');
    if(!calEl) return;

    const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    calEl.textContent = `${months[calendarDate.getMonth()]} ${calendarDate.getFullYear()}`;
    
    const year = calendarDate.getFullYear();
    const month = calendarDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const today = new Date();
    
    let html = '';
    for (let i = 0; i < firstDay; i++) html += '<div class="calendar-day empty"></div>';
    for (let d = 1; d <= daysInMonth; d++) {
        const date = new Date(year, month, d);
        const isPast = date < new Date(today.getFullYear(), today.getMonth(), today.getDate());
        const isToday = d === today.getDate() && month === today.getMonth() && year === today.getFullYear();
        const isSelected = selectedDate && d === selectedDate.getDate() && month === selectedDate.getMonth() && year === selectedDate.getFullYear();
        const cls = `calendar-day w-full aspect-square rounded-xl flex items-center justify-center text-sm font-medium cursor-pointer ${isPast ? 'disabled text-navy-200/40 cursor-not-allowed' : 'text-navy-500 hover:bg-gold-400 hover:text-ivory-100'} ${isToday ? 'ring-2 ring-gold-400 ring-offset-2 ring-offset-ivory-50' : ''} ${isSelected ? 'selected' : ''}`;
        html += `<div class="${cls}" onclick="${isPast ? '' : `selectDate(${year},${month},${d})`}">${d}</div>`;
    }
    document.getElementById('calendar-days').innerHTML = html;
    renderTimeSlots();
}
function changeMonth(delta) {
    calendarDate.setMonth(calendarDate.getMonth() + delta);
    selectedDate = null;
    selectedTime = null;
    renderCalendar();
}
function selectDate(y, m, d) {
    selectedDate = new Date(y, m, d);
    document.getElementById('apt-date').value = selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
    renderCalendar();
    updateAptSummary();
}
function renderTimeSlots() {
    const container = document.getElementById('time-slots');
    if(!container) return;
    container.innerHTML = timeSlots.map(t => {
        const isSelected = selectedTime === t;
        return `<button onclick="selectTime('${t}')" class="py-2 px-3 rounded-lg text-xs font-medium transition-all ${isSelected ? 'bg-navy-500 text-ivory-100' : 'bg-ivory-200 text-navy-500 hover:bg-gold-400 hover:text-ivory-100'}">${t}</button>`;
    }).join('');
}
function selectTime(time) {
    selectedTime = time;
    document.getElementById('apt-time').value = time;
    renderTimeSlots();
    updateAptSummary();
}
function populatePetSelect() {
    const sel = document.getElementById('apt-pet');
    if(!sel) return;
    sel.innerHTML = '<option value="">Choose your pet</option>' + pets.map(p => `<option value="${p.name}">${p.name} (${p.type} - ${p.breed})</option>`).join('');
}
function updateAptSummary() {
    const summary = document.getElementById('apt-summary');
    const content = document.getElementById('apt-summary-content');
    if(!summary || !content) return;

    const service = document.getElementById('apt-service').value;
    const pet = document.getElementById('apt-pet').value;
    const date = document.getElementById('apt-date').value;
    const time = document.getElementById('apt-time').value;
    
    if (service || pet || date || time) {
        summary.classList.remove('hidden');
        content.innerHTML = `
            ${service ? `<p><span class="font-medium text-navy-500">Service:</span> ${service}</p>` : ''}
            ${pet ? `<p><span class="font-medium text-navy-500">Pet:</span> ${pet}</p>` : ''}
            ${date ? `<p><span class="font-medium text-navy-500">Date:</span> ${date}</p>` : ''}
            ${time ? `<p><span class="font-medium text-navy-500">Time:</span> ${time}</p>` : ''}
        `;
    } else {
        summary.classList.add('hidden');
    }
}
function bookAppointment() {
    const service = document.getElementById('apt-service').value;
    const pet = document.getElementById('apt-pet').value;
    const date = document.getElementById('apt-date').value;
    const time = document.getElementById('apt-time').value;
    
    if (!service || !pet || !date || !time) {
        showToast('Please fill in all appointment details', 'error');
        return;
    }
    
    const petObj = pets.find(p => p.name === pet);
    if (petObj) petObj.appointments.push(`${service.split(' - ')[0]} - ${date}`);
    
    document.getElementById('apt-service').value = '';
    document.getElementById('apt-pet').value = '';
    document.getElementById('apt-date').value = '';
    document.getElementById('apt-time').value = '';
    document.getElementById('apt-notes').value = '';
    document.getElementById('apt-summary').classList.add('hidden');
    selectedDate = null;
    selectedTime = null;
    renderCalendar();
    
    showToast('Appointment booked successfully! We\'ll send you a confirmation.', 'success');
}

// ========== TOAST & GSAP ==========
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
    gsap.registerPlugin(ScrollTrigger);
    
    gsap.utils.toArray('.hero-anim').forEach((el, i) => {
        gsap.to(el, { opacity: 1, y: 0, duration: 0.8, delay: 0.2 + i * 0.15, ease: 'power3.out' });
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

// ========== NAVBAR SCROLL ==========
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

document.addEventListener('change', (e) => {
    if (e.target.id === 'apt-service' || e.target.id === 'apt-pet') {
        updateAptSummary();
    }
});
