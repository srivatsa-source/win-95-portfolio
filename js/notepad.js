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
            window.showConfirm('Start a new document? Unsaved changes will be lost.', 'Notepad', () => {
                document.getElementById('notepad-textarea').value = '';
                localStorage.removeItem('notepad-content');
            });
            hideAllMenus();
        });

        // Save (Downloads as .txt file)
        document.getElementById('notepad-save')?.addEventListener('click', () => {
            const content = document.getElementById('notepad-textarea').value;
            localStorage.setItem('notepad-content', content);
            
            // Create downloadable file
            const blob = new Blob([content], { type: 'text/plain' });
            const link = document.createElement('a');
            link.download = 'untitled.txt';
            link.href = URL.createObjectURL(blob);
            link.click();
            URL.revokeObjectURL(link.href);
            
            window.showAlert('File saved as "untitled.txt"!', 'Notepad', 'success');
            hideAllMenus();
        });

        // Open (Simulated - loads a welcome note)
        document.getElementById('notepad-open')?.addEventListener('click', () => {
            const welcomeNote = "Welcome to Notepad!\r\n\r\nThis is a fully functional text editor.\r\nYour notes are saved automatically to your browser's local storage.\r\n\r\nFeel free to jot down your thoughts!";
            document.getElementById('notepad-textarea').value = welcomeNote;
            localStorage.setItem('notepad-content', welcomeNote);
            window.showAlert('Welcome note loaded!', 'Notepad', 'info');
            hideAllMenus();
        });
        
        // Exit
        document.getElementById('notepad-exit')?.addEventListener('click', () => {
            closeWindow('notepad');
            hideAllMenus();
        });
        
        // Edit menu - Select All
        document.getElementById('notepad-select-all')?.addEventListener('click', () => {
            const textarea = document.getElementById('notepad-textarea');
            textarea.select();
            hideAllMenus();
        });
        
        // Edit menu - Time/Date
        document.getElementById('notepad-time-date')?.addEventListener('click', () => {
            const textarea = document.getElementById('notepad-textarea');
            const now = new Date();
            const timeDate = now.toLocaleTimeString() + ' ' + now.toLocaleDateString();
            const cursorPos = textarea.selectionStart;
            const textBefore = textarea.value.substring(0, cursorPos);
            const textAfter = textarea.value.substring(cursorPos);
            textarea.value = textBefore + timeDate + textAfter;
            localStorage.setItem('notepad-content', textarea.value);
            hideAllMenus();
        });
        
        // Help Topics
        document.getElementById('notepad-help')?.addEventListener('click', () => {
            window.showAlert('Notepad Help:<br><br>• Type to add text<br>• File > Save to download as .txt<br>• Edit > Time/Date to insert time<br>• Content is auto-saved', 'Notepad Help', 'info');
            hideAllMenus();
        });
        
        // About
        document.getElementById('notepad-about')?.addEventListener('click', () => {
            window.showAlert('<strong>Notepad</strong><br>Version 1.0<br><br>Windows 95 Portfolio Edition<br>Created by Srivatsa S.', 'About Notepad', 'info');
            hideAllMenus();
        });
    }
    
    function hideAllMenus() {
        document.querySelectorAll('.dropdown-menu').forEach(menu => {
            menu.style.display = 'none';
        });
    }

    // Initialize if window is already present
    if (document.getElementById('notepad')) {
        window.initNotepad();
    }
})();
