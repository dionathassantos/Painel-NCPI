// Global variables
let currentUser; // Removed duplicate declaration

// Check if user is logged in
function checkAuth() {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (storedUser && token) {
        currentUser = JSON.parse(storedUser);
        return true;
    }
    
    return false;
}

// Redirect to login if not authenticated
function protectRoute() {
    if (!checkAuth() && window.location.pathname !== '/login.html') {
        window.location.href = 'login.html';
    }
}

// Handle logout
function handleLogout() {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    window.location.href = 'login.html';
}

// Toggle password visibility
function togglePasswordVisibility(button, inputId) {
    const input = document.getElementById(inputId);
    const eyeIcon = button.querySelector('.eye-icon');
    
    if (input.type === 'password') {
        input.type = 'text';
        eyeIcon.innerHTML = `
            <path d="M2 10C2 10 5.33333 3.33334 10 3.33334C14.6667 3.33334 18 10 18 10C18 10 14.6667 16.6667 10 16.6667C5.33333 16.6667 2 10 2 10Z" stroke="#505050" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M10 12.5C11.3807 12.5 12.5 11.3807 12.5 10C12.5 8.61929 11.3807 7.5 10 7.5C8.61929 7.5 7.5 8.61929 7.5 10C7.5 11.3807 8.61929 12.5 10 12.5Z" stroke="#505050" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <line x1="17" y1="3" x2="3" y2="17" stroke="#505050" stroke-width="1.5" stroke-linecap="round"/>
        `;
    } else {
        input.type = 'password';
        eyeIcon.innerHTML = `
            <path d="M1.66666 10C1.66666 10 4.99999 3.33334 10 3.33334C15 3.33334 18.3333 10 18.3333 10C18.3333 10 15 16.6667 10 16.6667C4.99999 16.6667 1.66666 10 1.66666 10Z" stroke="#505050" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M10 12.5C11.3807 12.5 12.5 11.3807 12.5 10C12.5 8.61929 11.3807 7.5 10 7.5C8.61929 7.5 7.5 8.61929 7.5 10C7.5 11.3807 8.61929 12.5 10 12.5Z" stroke="#505050" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        `;
    }
}

// Show/hide modal
function toggleModal(modalId, show) {
    const modal = document.getElementById(modalId);
    if (show) {
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    } else {
        modal.classList.remove('show');
        document.body.style.overflow = '';
    }
}

// Initialize common elements
document.addEventListener('DOMContentLoaded', function() {
    // Protect route
    protectRoute();
    
    // Setup logout button
    const logoutButton = document.querySelector('.logout-button');
    if (logoutButton) {
        logoutButton.addEventListener('click', handleLogout);
    }
    
    // Setup notification dropdown
    const notificationButton = document.getElementById('notificationButton');
    const notificationDropdown = document.getElementById('notificationDropdown');
    
    if (notificationButton && notificationDropdown) {
        notificationButton.addEventListener('click', function(e) {
            e.stopPropagation();
            notificationDropdown.classList.toggle('show');
        });
        
        document.addEventListener('click', function(e) {
            if (!notificationDropdown.contains(e.target) && e.target !== notificationButton) {
                notificationDropdown.classList.remove('show');
            }
        });
        
        // Setup notification actions
        const approveButtons = document.querySelectorAll('.approve-button');
        const rejectButtons = document.querySelectorAll('.reject-button');
        
        approveButtons.forEach(button => {
            button.addEventListener('click', function() {
                const item = this.closest('.notification-item');
                item.remove();
                
                // Update notification count
                const count = document.querySelectorAll('.notification-item').length;
                const badge = document.querySelector('.notification-badge');
                
                if (count === 0) {
                    badge.style.display = 'none';
                    notificationDropdown.querySelector('.notification-list').innerHTML = `
                        <div class="p-4 text-center text-gray-500 text-sm">Não há notificações no momento.</div>
                    `;
                } else {
                    badge.textContent = count;
                }
            });
        });
        
        rejectButtons.forEach(button => {
            button.addEventListener('click', function() {
                const item = this.closest('.notification-item');
                item.remove();
                
                // Update notification count
                const count = document.querySelectorAll('.notification-item').length;
                const badge = document.querySelector('.notification-badge');
                
                if (count === 0) {
                    badge.style.display = 'none';
                    notificationDropdown.querySelector('.notification-list').innerHTML = `
                        <div class="p-4 text-center text-gray-500 text-sm">Não há notificações no momento.</div>
                    `;
                } else {
                    badge.textContent = count;
                }
            });
        });
    }
    
    // Setup password toggle buttons
    const togglePasswordButtons = document.querySelectorAll('.toggle-password');
    
    togglePasswordButtons.forEach(button => {
        button.addEventListener('click', function() {
            const input = this.previousElementSibling;
            togglePasswordVisibility(this, input.id);
        });
    });
});