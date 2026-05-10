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
    localStorage.setItem('mypet_pets', JSON.stringify(pets));
    
    renderPets();
    document.getElementById('add-pet-form').classList.add('hidden');
    document.getElementById('pet-name-input').value = '';
    document.getElementById('pet-breed-input').value = '';
    document.getElementById('pet-age-input').value = '';
    showToast(`${name} has been added to your pets!`, 'success');
}
