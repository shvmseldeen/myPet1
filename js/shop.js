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
