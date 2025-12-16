// ==================== TOAST NOTIFICATION SYSTEM ====================

// Initialize toast container on page load
function initToastContainer() {
    if (!document.getElementById('toastContainer')) {
        const container = document.createElement('div');
        container.id = 'toastContainer';
        container.className = 'toast-container';
        document.body.appendChild(container);
    }
}

// Show toast notification
function showToast(message, type = 'info', duration = 3000) {
    initToastContainer();
    
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    // Icons for different types
    const icons = {
        success: '✓',
        error: '✕',
        info: 'ℹ',
        warning: '⚠'
    };
    
    // Titles for different types
    const titles = {
        success: 'Success',
        error: 'Error',
        info: 'Info',
        warning: 'Warning'
    };
    
    toast.innerHTML = `
        <div class="toast-icon">${icons[type] || icons.info}</div>
        <div class="toast-content">
            <div class="toast-title">${titles[type] || titles.info}</div>
            <div class="toast-message">${message}</div>
        </div>
        <button class="toast-close" onclick="removeToast(this.parentElement)">×</button>
        <div class="toast-progress"></div>
    `;
    
    container.appendChild(toast);
    
    // Auto remove after duration
    const timeout = setTimeout(() => {
        removeToast(toast);
    }, duration);
    
    // Click to dismiss
    toast.addEventListener('click', (e) => {
        if (!e.target.classList.contains('toast-close')) {
            clearTimeout(timeout);
            removeToast(toast);
        }
    });
    
    return toast;
}

// Remove toast
function removeToast(toast) {
    if (!toast || !toast.parentElement) return;
    
    toast.classList.add('removing');
    
    setTimeout(() => {
        if (toast.parentElement) {
            toast.remove();
        }
    }, 300);
}

// Convenience methods
function showSuccess(message, duration = 3000) {
    return showToast(message, 'success', duration);
}

function showError(message, duration = 3000) {
    return showToast(message, 'error', duration);
}

function showInfo(message, duration = 3000) {
    return showToast(message, 'info', duration);
}

function showWarning(message, duration = 3000) {
    return showToast(message, 'warning', duration);
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', initToastContainer);