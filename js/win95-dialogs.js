// Windows 95-themed dialog boxes
(function() {
    'use strict';

    // Create Windows 95-style alert dialog
    window.showAlert = function(message, title = 'Portfolio', icon = 'info') {
        // Remove existing alert if any
        const existing = document.getElementById('win95-alert');
        if (existing) existing.remove();

        const alertDiv = document.createElement('div');
        alertDiv.id = 'win95-alert';
        alertDiv.className = 'win95-dialog';
        alertDiv.innerHTML = `
            <div class="win95-dialog-titlebar">
                <span>${title}</span>
                <button class="win95-dialog-close" onclick="this.closest('.win95-dialog').remove()">✕</button>
            </div>
            <div class="win95-dialog-content">
                <div class="win95-dialog-icon ${icon}"></div>
                <div class="win95-dialog-message"></div>
            </div>
            <div class="win95-dialog-buttons">
                <button class="win95-btn" onclick="this.closest('.win95-dialog').remove()">OK</button>
            </div>
        `;

        document.body.appendChild(alertDiv);
        
        // Set message as HTML after appending to DOM
        const messageDiv = alertDiv.querySelector('.win95-dialog-message');
        messageDiv.innerHTML = message;

        // Center the dialog
        setTimeout(() => {
            const rect = alertDiv.getBoundingClientRect();
            alertDiv.style.left = `${(window.innerWidth - rect.width) / 2}px`;
            alertDiv.style.top = `${(window.innerHeight - rect.height) / 2}px`;
        }, 10);

        // Make it draggable
        makeDraggable(alertDiv);

        // Play system sound
        playSystemSound('info');
    };

    // Create Windows 95-style confirm dialog
    window.showConfirm = function(message, title = 'Confirm', onYes, onNo) {
        const existing = document.getElementById('win95-confirm');
        if (existing) existing.remove();

        const confirmDiv = document.createElement('div');
        confirmDiv.id = 'win95-confirm';
        confirmDiv.className = 'win95-dialog';
        confirmDiv.innerHTML = `
            <div class="win95-dialog-titlebar">
                <span>${title}</span>
                <button class="win95-dialog-close" onclick="this.closest('.win95-dialog').remove()">✕</button>
            </div>
            <div class="win95-dialog-content">
                <div class="win95-dialog-icon question"></div>
                <div class="win95-dialog-message"></div>
            </div>
            <div class="win95-dialog-buttons">
                <button class="win95-btn" id="confirm-yes">Yes</button>
                <button class="win95-btn" id="confirm-no">No</button>
            </div>
        `;

        document.body.appendChild(confirmDiv);
        
        // Set message as HTML after appending to DOM
        const messageDiv = confirmDiv.querySelector('.win95-dialog-message');
        messageDiv.innerHTML = message;

        // Center the dialog
        setTimeout(() => {
            const rect = confirmDiv.getBoundingClientRect();
            confirmDiv.style.left = `${(window.innerWidth - rect.width) / 2}px`;
            confirmDiv.style.top = `${(window.innerHeight - rect.height) / 2}px`;
        }, 10);

        // Button handlers
        document.getElementById('confirm-yes').onclick = () => {
            confirmDiv.remove();
            if (onYes) onYes();
        };
        document.getElementById('confirm-no').onclick = () => {
            confirmDiv.remove();
            if (onNo) onNo();
        };

        makeDraggable(confirmDiv);
        playSystemSound('question');
    };

    // Make dialog draggable
    function makeDraggable(element) {
        const titlebar = element.querySelector('.win95-dialog-titlebar');
        let isDragging = false;
        let offsetX, offsetY;

        titlebar.addEventListener('mousedown', (e) => {
            if (e.target.classList.contains('win95-dialog-close')) return;
            isDragging = true;
            offsetX = e.clientX - element.offsetLeft;
            offsetY = e.clientY - element.offsetTop;
            element.style.zIndex = ++window.zIndex;
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            element.style.left = (e.clientX - offsetX) + 'px';
            element.style.top = (e.clientY - offsetY) + 'px';
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
        });
    }

    // Play system sound (visual feedback since we can't use actual sounds easily)
    function playSystemSound(type) {
        // Just visual feedback for now
        console.log(`System sound: ${type}`);
    }

})();
