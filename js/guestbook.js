// Guestbook and visitor counter functionality
(function() {
    'use strict';

    // Supabase Configuration
    const SUPABASE_URL = 'https://lwkmulqplffbiwbwggji.supabase.co';
    const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx3a211bHFwbGZmYml3YndnZ2ppIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI4NjQyNTYsImV4cCI6MjA3ODQ0MDI1Nn0.EBwgzNQJ5jTb0-KDfqSH4Huao0hwmsrMbtClEKhP3BU';

    // Simple Supabase client (no library needed!)
    const supabase = {
        from(table) {
            return {
                select: async (columns = '*') => {
                    const response = await fetch(`${SUPABASE_URL}/rest/v1/${table}?select=${columns}`, {
                        headers: {
                            'apikey': SUPABASE_KEY,
                            'Authorization': `Bearer ${SUPABASE_KEY}`
                        }
                    });
                    
                    if (!response.ok) {
                        const error = await response.text();
                        throw new Error(`Supabase error: ${response.status} - ${error}`);
                    }
                    
                    return await response.json();
                },
                insert: async (data) => {
                    const response = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
                        method: 'POST',
                        headers: {
                            'apikey': SUPABASE_KEY,
                            'Authorization': `Bearer ${SUPABASE_KEY}`,
                            'Content-Type': 'application/json',
                            'Prefer': 'return=representation'
                        },
                        body: JSON.stringify(data)
                    });
                    
                    if (!response.ok) {
                        const error = await response.text();
                        throw new Error(`Supabase error: ${response.status} - ${error}`);
                    }
                    
                    return await response.json();
                },
                update: async (data) => {
                    const response = await fetch(`${SUPABASE_URL}/rest/v1/${table}?id=eq.1`, {
                        method: 'PATCH',
                        headers: {
                            'apikey': SUPABASE_KEY,
                            'Authorization': `Bearer ${SUPABASE_KEY}`,
                            'Content-Type': 'application/json',
                            'Prefer': 'return=representation'
                        },
                        body: JSON.stringify(data)
                    });
                    
                    if (!response.ok) {
                        const error = await response.text();
                        throw new Error(`Supabase error: ${response.status} - ${error}`);
                    }
                    
                    return await response.json();
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
            
            // Update in Supabase (only update count, not last_updated)
            await supabase.from('visitor_count').update({ 
                count: count
            }).eq('id', 1);
            
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

    // Security: Input validation and sanitization
    function sanitizeInput(text, maxLength = 500) {
        if (typeof text !== 'string') return '';
        
        // Remove null bytes and control characters
        let sanitized = text.replace(/[\0\x08\x0B\x0C\x0E-\x1F]/g, '');
        
        // Limit length
        sanitized = sanitized.slice(0, maxLength);
        
        // Remove potential script tags and SQL injection patterns
        sanitized = sanitized
            .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
            .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
            .replace(/javascript:/gi, '')
            .replace(/on\w+\s*=/gi, '')
            .replace(/(\bDROP\b|\bDELETE\b|\bUPDATE\b|\bINSERT\b|\bCREATE\b|\bALTER\b)\s+(TABLE|DATABASE|SCHEMA)/gi, '');
        
        return sanitized.trim();
    }
    
    function validateInput(name, message) {
        // Validate name
        if (!name || name.length < 1 || name.length > 100) {
            return { valid: false, error: 'Name must be between 1 and 100 characters.' };
        }
        
        // Validate message
        if (!message || message.length < 1 || message.length > 500) {
            return { valid: false, error: 'Message must be between 1 and 500 characters.' };
        }
        
        // Check for suspicious patterns
        const suspiciousPatterns = [
            /<script/i,
            /javascript:/i,
            /on\w+=/i,
            /\bDROP\s+TABLE\b/i,
            /\bDELETE\s+FROM\b/i,
            /\bUNION\s+SELECT\b/i,
            /\bEXEC\b/i,
            /\bEXECUTE\b/i
        ];
        
        for (let pattern of suspiciousPatterns) {
            if (pattern.test(name) || pattern.test(message)) {
                return { valid: false, error: 'Invalid characters detected. Please use only regular text.' };
            }
        }
        
        return { valid: true };
    }

    // Profanity and inappropriate content filter
    const badWords = [
        // Profanity
        'fuck', 'shit', 'damn', 'bitch', 'ass', 'crap', 'hell', 'piss', 'bastard', 'asshole',
        'dick', 'cock', 'pussy', 'cunt', 'whore', 'slut', 'fag', 'nigger', 'retard',
        
        // Sensual/Sexual content
        'sex', 'sexy', 'porn', 'xxx', 'nude', 'naked', 'kiss', 'kisses', 'kissing',
        'boobs', 'tits', 'breast', 'penis', 'vagina', 'orgasm', 'masturbate',
        'erotic', 'horny', 'lust', 'seduce', 'aroused', 'kinky',
        
        // Inappropriate suggestions
        'date me', 'marry me', 'hot', 'cute af', 'daddy', 'mommy',
        'onlyfans', 'snapchat me', 'hook up', 'hookup',
        
        // Spam indicators
        'spam', 'test123', 'click here', 'buy now', 'viagra', 'casino',
        'free money', 'win now', 'subscribe', 'follow me'
    ];
    
    function filterBadWords(text) {
        let filtered = text;
        badWords.forEach(word => {
            const regex = new RegExp(`\\b${word}\\b`, 'gi');
            filtered = filtered.replace(regex, '*'.repeat(word.length));
        });
        return filtered;
    }
    
    // Additional content validation
    function checkInappropriateContent(text) {
        const inappropriatePatterns = [
            /\b(kiss|kisses|kissing)\b/i,
            /\b(sexy|sex|porn|nude|naked)\b/i,
            /\b(hot|cute)\s+(af|asf|as\s+f)/i,
            /\b(date|marry|hook\s*up)\s+(me|with\s+me)\b/i,
            /\b(dm|message|text)\s+me\b/i,
            /\b(onlyfans|snapchat|instagram)\b/i,
            /([0-9]{3}[-.\s]?[0-9]{3}[-.\s]?[0-9]{4})/,  // Phone numbers
            /[\w\.-]+@[\w\.-]+\.\w+/,  // Email addresses
            /(https?:\/\/|www\.)/i  // URLs
        ];
        
        for (let pattern of inappropriatePatterns) {
            if (pattern.test(text)) {
                return false;
            }
        }
        
        return true;
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

    // Rate limiting - prevent spam submissions
    let lastSubmitTime = 0;
    const SUBMIT_COOLDOWN = 30000; // 30 seconds between submissions

    async function addGuestbookEntry() {
        const name = guestbookName.value.trim();
        const message = guestbookMessage.value.trim();

        if (!name || !message) {
            showAlert('Please fill in both name and message!', 'Guestbook', 'warning');
            return;
        }
        
        // Rate limiting check
        const now = Date.now();
        if (now - lastSubmitTime < SUBMIT_COOLDOWN) {
            const remainingSeconds = Math.ceil((SUBMIT_COOLDOWN - (now - lastSubmitTime)) / 1000);
            showAlert(`Please wait ${remainingSeconds} seconds before submitting again.`, 'Rate Limit', 'warning');
            return;
        }
        
        // Sanitize inputs first
        const sanitizedName = sanitizeInput(name, 100);
        const sanitizedMessage = sanitizeInput(message, 500);
        
        // Check for inappropriate content before validation
        if (!checkInappropriateContent(sanitizedName) || !checkInappropriateContent(sanitizedMessage)) {
            showAlert('Your message contains inappropriate content. Please keep the guestbook professional and respectful.', 'Inappropriate Content', 'warning');
            return;
        }
        
        // Validate inputs
        const validation = validateInput(sanitizedName, sanitizedMessage);
        if (!validation.valid) {
            showAlert(validation.error, 'Invalid Input', 'error');
            return;
        }

        // Filter bad words
        const filteredName = filterBadWords(sanitizedName);
        const filteredMessage = filterBadWords(sanitizedMessage);

        try {
            console.log('Saving to Supabase...');
            console.log('Data:', { name: filteredName, message: filteredMessage });
            
            // Save to Supabase - using parameterized data (safe from SQL injection)
            const result = await supabase.from('guestbook').insert([{
                name: filteredName,
                message: filteredMessage,
                created_at: new Date().toISOString()
            }]);

            console.log('Insert result:', result);
            
            // Update last submit time on success
            lastSubmitTime = now;
            
            guestbookName.value = '';
            guestbookMessage.value = '';
            showAlert('Thank you for signing the guestbook!', 'Success', 'success');
            await loadGuestbook();
        } catch (error) {
            console.error('Add guestbook entry error:', error);
            console.error('Error details:', error.message, error.stack);
            showAlert(`Could not save your entry: ${error.message}`, 'Error', 'error');
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
