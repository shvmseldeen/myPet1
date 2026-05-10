// ========== STATE & LOCAL STORAGE ==========
let cart = JSON.parse(localStorage.getItem('mypet_cart')) || [];
let currentUser = JSON.parse(localStorage.getItem('mypet_currentUser')) || null;
let isLoggedIn = currentUser !== null;

// Initialize empty arrays safely
if (!localStorage.getItem('mypet_users')) {
    localStorage.setItem('mypet_users', JSON.stringify([]));
}
if (!localStorage.getItem('mypet_orders')) {
    localStorage.setItem('mypet_orders', JSON.stringify([]));
}

const defaultPets = [
    { id: 1, name: 'Max', type: 'Dog', breed: 'Golden Retriever', age: 3, img: 'https://picsum.photos/seed/golden-dog/300/300.jpg', nextVax: '2025-02-15', history: ['Annual checkup - Dec 2024', 'Rabies vaccine - Jun 2024', 'Dental cleaning - Mar 2024'], appointments: ['Grooming - Jan 20, 2025'] },
    { id: 2, name: 'Luna', type: 'Cat', breed: 'Persian', age: 2, img: 'https://picsum.photos/seed/persian-cat/300/300.jpg', nextVax: '2025-03-10', history: ['FVRCP vaccine - Nov 2024', 'Spay surgery - Aug 2024'], appointments: ['Vet Checkup - Feb 5, 2025'] }
];
let pets = JSON.parse(localStorage.getItem('mypet_pets')) || defaultPets;

let calendarDate = new Date();
let selectedDate = null;
let selectedTime = null;

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
