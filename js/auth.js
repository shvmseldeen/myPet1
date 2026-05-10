// ========== AUTHENTICATION ==========
function openAuth(type) {
    const modal = document.getElementById('auth-modal');
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    switchAuth(type);
}

function closeAuth() {
    const modal = document.getElementById('auth-modal');
    modal.classList.add('hidden');
    modal.classList.remove('flex');
}

function switchAuth(type) {
    if (type === 'login') {
        document.getElementById('login-form').classList.remove('hidden');
        document.getElementById('signup-form').classList.add('hidden');
        document.getElementById('auth-title').textContent = 'Welcome Back';
    } else {
        document.getElementById('login-form').classList.add('hidden');
        document.getElementById('signup-form').classList.remove('hidden');
        document.getElementById('auth-title').textContent = 'Join PawLux';
    }
}

function updateAuthUI() {
    const btnLogin = document.getElementById('btn-login');
    const btnSignup = document.getElementById('btn-signup');
    const btnLogout = document.getElementById('btn-logout');

    // Force display states to bypass Tailwind conflicts
    if (isLoggedIn) {
        if(btnLogin) btnLogin.style.display = 'none';
        if(btnSignup) btnSignup.style.display = 'none';
        if(btnLogout) btnLogout.style.display = 'block';
    } else {
        if(btnLogin) btnLogin.style.display = 'block';
        if(btnSignup) btnSignup.style.display = 'block';
        if(btnLogout) btnLogout.style.display = 'none';
    }
}

function handleLogout() {
    isLoggedIn = false;
    currentUser = null;
    localStorage.removeItem('mypet_currentUser');
    updateAuthUI();
    showToast('Logged out successfully.', 'info');
}

function handleSignup() {
    const name = document.getElementById('signup-name').value;
    const email = document.getElementById('signup-email').value;
    const phone = document.getElementById('signup-phone').value;
    const password = document.getElementById('signup-password').value;
    
    if (!name || !email || !password || !phone) { 
        showToast('Please fill in all required fields', 'error'); 
        return; 
    }
    
    let users = JSON.parse(localStorage.getItem('mypet_users'));
    if (users.find(u => u.email === email)) {
        showToast('An account with this email already exists!', 'error');
        return;
    }

    const newUser = { name, email, phone, password };
    users.push(newUser);
    localStorage.setItem('mypet_users', JSON.stringify(users));

    currentUser = newUser;
    localStorage.setItem('mypet_currentUser', JSON.stringify(newUser));
    isLoggedIn = true;
    
    updateAuthUI();
    closeAuth();
    showToast('Account created successfully!', 'success');
}

function handleLogin() {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
    if (!email || !password) { 
        showToast('Please fill in all fields', 'error'); 
        return; 
    }
    
    let users = JSON.parse(localStorage.getItem('mypet_users'));
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
        currentUser = user;
        localStorage.setItem('mypet_currentUser', JSON.stringify(user));
        isLoggedIn = true;
        updateAuthUI();
        closeAuth();
        showToast(`Welcome back, ${user.name}!`, 'success');
    } else {
        showToast('Invalid email or password', 'error');
    }
}
