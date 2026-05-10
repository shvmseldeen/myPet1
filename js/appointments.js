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
    if (!isLoggedIn) {
        showToast('Please login to book an appointment', 'error');
        openAuth('login');
        return;
    }

    const service = document.getElementById('apt-service').value;
    const pet = document.getElementById('apt-pet').value;
    const date = document.getElementById('apt-date').value;
    const time = document.getElementById('apt-time').value;
    
    if (!service || !pet || !date || !time) {
        showToast('Please fill in all appointment details', 'error');
        return;
    }
    
    const petObj = pets.find(p => p.name === pet);
    if (petObj) {
        petObj.appointments.push(`${service.split(' - ')[0]} - ${date}`);
        localStorage.setItem('mypet_pets', JSON.stringify(pets));
    }
    
    document.getElementById('apt-service').value = '';
    document.getElementById('apt-pet').value = '';
    document.getElementById('apt-date').value = '';
    document.getElementById('apt-time').value = '';
    document.getElementById('apt-notes').value = '';
    document.getElementById('apt-summary').classList.add('hidden');
    selectedDate = null;
    selectedTime = null;
    renderCalendar();
    
    showToast('Appointment booked successfully!', 'success');
}

document.addEventListener('change', (e) => {
    if (e.target.id === 'apt-service' || e.target.id === 'apt-pet') {
        updateAptSummary();
    }
});
