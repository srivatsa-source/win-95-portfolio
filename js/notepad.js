// Notepad Application
(function() {
    'use strict';

    // Initialize Notepad functionality
    function initNotepad() {
        const notepadTextarea = document.getElementById('notepad-textarea');
        if (!notepadTextarea) return;

        // Load saved content
        const savedContent = localStorage.getItem('notepad-content');
        if (savedContent) {
            notepadTextarea.value = savedContent;
        }

        // Auto-save functionality
        notepadTextarea.addEventListener('input', function() {
            localStorage.setItem('notepad-content', this.value);
        });

        // Menu actions
        setupMenuActions();
    }

    function setupMenuActions() {
        // New
        document.getElementById('notepad-new')?.addEventListener('click', () => {
            if (confirm('Start a new document? Unsaved changes will be lost.')) {
                document.getElementById('notepad-textarea').value = '';
                localStorage.removeItem('notepad-content');
            }
        });

        // Save (Simulated)
        document.getElementById('notepad-save')?.addEventListener('click', () => {
            const content = document.getElementById('notepad-textarea').value;
            localStorage.setItem('notepad-content', content);
            alert('File saved successfully!');
        });

        // Open (Simulated - loads a welcome note)
        document.getElementById('notepad-open')?.addEventListener('click', () => {
            const welcomeNote = "Welcome to Notepad!\r\n\r\nThis is a fully functional text editor.\r\nYour notes are saved automatically to your browser's local storage.\r\n\r\nFeel free to jot down your thoughts!";
            document.getElementById('notepad-textarea').value = welcomeNote;
            localStorage.setItem('notepad-content', welcomeNote);
        });
        
        // About
        document.getElementById('notepad-about')?.addEventListener('click', () => {
            alert('Notepad v1.0\nWindows 95 Portfolio Edition\n\nCreated by Srivatsa S');
        });
    }

    // Initialize when window opens
    // We need to observe when the notepad window is added to DOM or becomes visible
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.target.id === 'notepad' && mutation.target.style.display !== 'none') {
                initNotepad();
            }
        });
    });

    const notepadWindow = document.getElementById('notepad');
    if (notepadWindow) {
        observer.observe(notepadWindow, { attributes: true, attributeFilter: ['style'] });
        // Also init if already open
        if (notepadWindow.style.display !== 'none') {
            initNotepad();
        }
    } else {
        // Wait for DOM content loaded if script runs before HTML
        document.addEventListener('DOMContentLoaded', () => {
            const win = document.getElementById('notepad');
            if (win) {
                observer.observe(win, { attributes: true, attributeFilter: ['style'] });
            }
        });
    }
})();
