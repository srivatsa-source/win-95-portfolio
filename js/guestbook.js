// Guestbook and visitor counter functionality
(function() {
    'use strict';

    // Visitor counter
    function updateVisitorCount() {
        let count = localStorage.getItem('visitorCount');
        if (!count) {
            count = 0;
        }
        count = parseInt(count) + 1;
        localStorage.setItem('visitorCount', count);
        document.getElementById('visitor-count').textContent = String(count).padStart(6, '0');
    }

    // Guestbook functionality
    const guestbookWindow = document.getElementById('guestbook-window');
    const guestbookIcon = document.querySelector('.guestbook-icon');
    const guestbookClose = document.getElementById('guestbook-close');
    const guestbookSubmit = document.getElementById('guestbook-submit');
    const guestbookName = document.getElementById('guestbook-name');
    const guestbookMessage = document.getElementById('guestbook-message');
    const guestbookEntries = document.getElementById('guestbook-entries');

    // Profanity filter
    const badWords = ['badword1', 'badword2', 'spam', 'test123', 'fuck', 'shit', 'damn', 'bitch', 'ass', 'crap', 'hell', 'piss'];
    
    function filterBadWords(text) {
        let filtered = text;
        badWords.forEach(word => {
            const regex = new RegExp(word, 'gi');
            filtered = filtered.replace(regex, '*'.repeat(word.length));
        });
        return filtered;
    }

    function loadGuestbook() {
        const entries = JSON.parse(localStorage.getItem('guestbookEntries') || '[]');
        guestbookEntries.innerHTML = '';
        
        if (entries.length === 0) {
            guestbookEntries.innerHTML = '<div style="padding: 10px; text-align: center; color: #808080;">No entries yet. Be the first to sign!</div>';
            return;
        }

        entries.reverse().forEach(entry => {
            const entryDiv = document.createElement('div');
            entryDiv.className = 'guestbook-entry';
            entryDiv.innerHTML = `
                <div style="font-weight: bold; margin-bottom: 4px;">${entry.name}</div>
                <div style="margin-bottom: 4px;">${entry.message}</div>
                <div style="font-size: 11px; color: #808080;">${entry.timestamp}</div>
            `;
            guestbookEntries.appendChild(entryDiv);
        });
    }

    function addGuestbookEntry() {
        const name = guestbookName.value.trim();
        const message = guestbookMessage.value.trim();

        if (!name || !message) {
            alert('Please fill in both name and message!');
            return;
        }

        const filteredName = filterBadWords(name);
        const filteredMessage = filterBadWords(message);

        const entry = {
            name: filteredName,
            message: filteredMessage,
            timestamp: new Date().toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'short', 
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            })
        };

        const entries = JSON.parse(localStorage.getItem('guestbookEntries') || '[]');
        entries.push(entry);
        localStorage.setItem('guestbookEntries', JSON.stringify(entries));

        guestbookName.value = '';
        guestbookMessage.value = '';
        loadGuestbook();
    }

    guestbookIcon.addEventListener('click', () => {
        guestbookWindow.style.display = 'flex';
        loadGuestbook();
    });

    guestbookClose.addEventListener('click', () => {
        guestbookWindow.style.display = 'none';
    });

    guestbookSubmit.addEventListener('click', addGuestbookEntry);

    guestbookMessage.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            addGuestbookEntry();
        }
    });

    // Make guestbook draggable
    let isGuestbookDragging = false;
    let guestbookInitialX, guestbookInitialY, guestbookCurrentX, guestbookCurrentY;

    const guestbookTitlebar = guestbookWindow.querySelector('.guestbook-titlebar');
    
    guestbookTitlebar.addEventListener('mousedown', (e) => {
        if (e.target.closest('.chat-controls')) return;
        guestbookInitialX = e.clientX - guestbookWindow.offsetLeft;
        guestbookInitialY = e.clientY - guestbookWindow.offsetTop;
        isGuestbookDragging = true;
    });

    document.addEventListener('mousemove', (e) => {
        if (!isGuestbookDragging) return;
        e.preventDefault();
        guestbookCurrentX = e.clientX - guestbookInitialX;
        guestbookCurrentY = e.clientY - guestbookInitialY;
        guestbookWindow.style.left = guestbookCurrentX + 'px';
        guestbookWindow.style.top = guestbookCurrentY + 'px';
        guestbookWindow.style.transform = 'none';
    });

    document.addEventListener('mouseup', () => {
        isGuestbookDragging = false;
    });

    // Initialize visitor counter on load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', updateVisitorCount);
    } else {
        updateVisitorCount();
    }

})();
