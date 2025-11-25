// Guestbook and visitor counter functionality
(function() {
    'use strict';

    // Supabase Configuration
    const SUPABASE_URL = 'https://lwkmulqplffbiwbwggji.supabase.co';
    const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx3a211bHFwbGZmYml3YndnZ2ppIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI4NjQyNTYsImV4cCI6MjA3ODQ0MDI1Nn0.EBwgzNQJ5jTb0-KDfqSH4Huao0hwmsrMbtClEKhP3BU';

    // Simple Supabase client (no library needed!)
    const supabase = {
        async query(sql, params = []) {
            const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/${sql}`, {
                method: 'POST',
                headers: {
                    'apikey': SUPABASE_KEY,
                    'Authorization': `Bearer ${SUPABASE_KEY}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(params)
            });
            return await response.json();
        },
        async from(table) {
            return {
                select: async (columns = '*') => {
                    const response = await fetch(`${SUPABASE_URL}/rest/v1/${table}?select=${columns}`, {
                        headers: {
                            'apikey': SUPABASE_KEY,
                            'Authorization': `Bearer ${SUPABASE_KEY}`
                        }
                    });
                    return await response.json();
                },
                insert: async (data) => {
                    const response = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
                        method: 'POST',
                        headers: {
                            'apikey': SUPABASE_KEY,
                            'Authorization': `Bearer ${SUPABASE_KEY}`,
                            'Content-Type': 'application/json',
                            'Prefer': 'return=minimal'
                        },
                        body: JSON.stringify(data)
                    });
                    return response.ok;
                },
                update: async (data) => {
                    const response = await fetch(`${SUPABASE_URL}/rest/v1/${table}?id=eq.1`, {
                        method: 'PATCH',
                        headers: {
                            'apikey': SUPABASE_KEY,
                            'Authorization': `Bearer ${SUPABASE_KEY}`,
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(data)
                    });
                    return response.ok;
                }
            };
        }
    };

    // Visitor counter with Supabase
    async function updateVisitorCount() {
        try {
            // Get current count from Supabase
            const stats = await supabase.from('visitor_count').select('count');
            let count = stats && stats[0] ? stats[0].count : 0;
            
            // Increment
            count++;
            
            // Update in Supabase
            await supabase.from('visitor_count').update({ 
                count: count,
                last_updated: new Date().toISOString()
            });
            
            // Display
            document.getElementById('visitor-count').textContent = String(count).padStart(6, '0');
        } catch (error) {
            console.error('Visitor count error:', error);
            // Fallback to localStorage
            let count = localStorage.getItem('visitorCount') || 0;
            count = parseInt(count) + 1;
            localStorage.setItem('visitorCount', count);
            document.getElementById('visitor-count').textContent = String(count).padStart(6, '0');
        }
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

    async function loadGuestbook() {
        try {
            console.log('Loading guestbook from Supabase...');
            console.log('Supabase URL:', SUPABASE_URL);
            
            // Load from Supabase
            const entries = await supabase.from('guestbook').select('*');
            console.log('Guestbook entries:', entries);
            
            guestbookEntries.innerHTML = '';
            
            // Check if response has error
            if (entries && entries.error) {
                throw new Error(`Supabase error: ${entries.error.message}`);
            }
            
            if (!entries || entries.length === 0) {
                guestbookEntries.innerHTML = '<div style="padding: 10px; text-align: center; color: #808080;">No entries yet. Be the first to sign!</div>';
                return;
            }

            // Sort by newest first
            entries.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

            entries.forEach(entry => {
                const entryDiv = document.createElement('div');
                entryDiv.className = 'guestbook-entry';
                const date = new Date(entry.created_at).toLocaleDateString();
                entryDiv.innerHTML = `
                    <div style="font-weight: bold; margin-bottom: 4px;">${escapeHtml(entry.name)}</div>
                    <div style="margin-bottom: 4px;">${escapeHtml(entry.message)}</div>
                    <div style="font-size: 11px; color: #808080;">${date}</div>
                `;
                guestbookEntries.appendChild(entryDiv);
            });
        } catch (error) {
            console.error('Load guestbook error:', error);
            console.error('Error details:', error.message, error.stack);
            guestbookEntries.innerHTML = `<div style="padding: 10px; text-align: center; color: #ff0000;">⚠️ Could not connect to guestbook database.<br><small>${error.message}</small></div>`;
        }
    }

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    async function addGuestbookEntry() {
        const name = guestbookName.value.trim();
        const message = guestbookMessage.value.trim();

        if (!name || !message) {
            alert('Please fill in both name and message!');
            return;
        }

        const filteredName = filterBadWords(name);
        const filteredMessage = filterBadWords(message);

        try {
            console.log('Saving to Supabase...');
            console.log('Data:', { name: filteredName, message: filteredMessage });
            
            // Save to Supabase
            const result = await supabase.from('guestbook').insert([{
                name: filteredName,
                message: filteredMessage,
                created_at: new Date().toISOString()
            }]);

            console.log('Insert result:', result);
            
            if (result) {
                guestbookName.value = '';
                guestbookMessage.value = '';
                alert('✅ Thank you for signing the guestbook!');
                await loadGuestbook();
            } else {
                throw new Error('Insert returned falsy value');
            }
        } catch (error) {
            console.error('Add guestbook entry error:', error);
            console.error('Error details:', error.message, error.stack);
            alert(`❌ Could not save your entry: ${error.message}`);
        }
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
