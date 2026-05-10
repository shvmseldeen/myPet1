// ========== CART & CHECKOUT ==========
function saveCart() {
    localStorage.setItem('mypet_cart', JSON.stringify(cart));
}

function toggleCart() {
    const panel = document.getElementById('cart-panel');
    const overlay = document.getElementById('cart-overlay');
    panel.classList.toggle('translate-x-full');
    panel.classList.toggle('translate-x-0');
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
                        <button onclick="updateCartQty(${item.id}, -1)" class="w-6 h-6 rounded-md bg-ivory-200 text-navy-500 flex items-center justify-center text-xs hover:bg-ivory-300">−</button>
                        <span class="text-xs font-semibold text-navy-500">${item.qty}</span>
                        <button onclick="updateCartQty(${item.id}, 1)" class="w-6 h-6 rounded-md bg-ivory-200 text-navy-500 flex items-center justify-center text-xs hover:bg-ivory-300">+</button>
                    </div>
                </div>
                <button onclick="removeFromCart(${item.id})" class="text-navy-200 hover:text-red-400"><i class="fas fa-trash-alt text-sm"></i></button>
            </div>
        `).join('');
    }
}

function checkout() {
    if (cart.length === 0) return;
    if (!isLoggedIn) {
        showToast('Please login to checkout', 'error');
        openAuth('login');
        return;
    }

    const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    
    const newOrder = {
        id: Date.now(),
        customerEmail: currentUser.email,
        items: [...cart],
        total: totalAmount,
        date: new Date().toISOString()
    };

    let orders = JSON.parse(localStorage.getItem('mypet_orders'));
    orders.push(newOrder);
    localStorage.setItem('mypet_orders', JSON.stringify(orders));

    cart = [];
    saveCart();
    updateCartUI();
    toggleCart();
    showToast('Order placed successfully! Thank you.', 'success');
}
