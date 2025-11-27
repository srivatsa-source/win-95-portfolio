// Notepad Application
(function() {
    'use strict';

    // Initialize Notepad functionality
    window.initNotepad = function() {
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
    };

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

    // Initialize if window is already present
    if (document.getElementById('notepad')) {
        window.initNotepad();
    }
})();
