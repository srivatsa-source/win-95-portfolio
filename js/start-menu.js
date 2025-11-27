// Start Menu functionality for Windows 95 interface
(function() {
    'use strict';

    // Helper function to properly close the Start Menu
    function closeStartMenu() {
        const startMenu = document.getElementById('startMenu');
        const startButton = document.querySelector('.start-button');
        if (startMenu) {
            startMenu.classList.remove('show');
        }
        if (startButton) {
            startButton.classList.remove('pressed');
        }
    }

    // Initialize submenu item handlers for authentic Windows 95 behavior
    function initializeSubmenuItems() {
        // Add click handlers to submenu items that don't have submenus
        const submenuItems = document.querySelectorAll('.submenu-item:not(.has-submenu)');
        submenuItems.forEach(item => {
            item.addEventListener('click', function(e) {
                e.stopPropagation();
                const itemName = this.textContent.trim();
                closeStartMenu();
                
                // Special case: MS-DOS Prompt actually opens the terminal
                if (itemName === 'MS-DOS Prompt') {
                    const terminal = document.querySelector('[data-window="terminal"]');
                    if (terminal) {
                        terminal.dispatchEvent(new Event('dblclick'));
                    }
                    return;
                }
                
                // Show a Windows 95 style dialog for submenu items
                const messages = {
                    'StartUp': '<strong>StartUp Programs</strong><br><br>Programs that run automatically when Windows starts.<br><br>This is a themed portfolio - explore the desktop icons to see real projects and skills!',
                    'Microsoft Exchange': '<strong>Microsoft Exchange</strong><br><br>Email and messaging center.<br><br>Want to get in touch? Check out the <strong>Contact</strong> window on the desktop!',
                    'The Microsoft Network': '<strong>The Microsoft Network</strong><br><br>Connect to MSN online services.<br><br>Explore the portfolio windows on the desktop for more information!',
                    'Windows Explorer': '<strong>Windows Explorer</strong><br><br>Browse files and folders.<br><br>Double-click the desktop icons to explore projects, skills, and experience!',
                    'Media Player': '<strong>Media Player</strong><br><br>Play audio and video files.<br><br>This is part of the Windows 95 theme - check out the real projects on the desktop!',
                    'Sound Recorder': '<strong>Sound Recorder</strong><br><br>Record and play audio.<br><br>Explore the portfolio windows to learn more about Srivatsa\'s work!',
                    'Volume Control': '<strong>Volume Control</strong><br><br>Adjust audio volume levels.<br><br>Try the <strong>Minesweeper</strong> game or chat with Ora the cat!',
                    'Documents': '<strong>Recent Documents</strong><br><br>Recent documents and files.<br><br>View the <strong>Projects</strong> window to see completed work!',
                    'Settings': '<strong>System Settings</strong><br><br>System and application settings.<br><br>Use the main Start menu options to explore the portfolio!'
                };
                
                if (messages[itemName]) {
                    showAlert(messages[itemName], 'Windows 95', 'info');
                } else {
                    showAlert('<strong>Windows 95 Portfolio</strong><br><br>This is a retro-themed portfolio experience.<br><br>Explore the desktop icons to learn more about Srivatsa\'s skills, projects, and experience!', itemName, 'info');
                }
            });
        });
    }

    // Initialize on load
    window.addEventListener('DOMContentLoaded', initializeSubmenuItems);

    // Documents - Show recent files and project links
    window.openDocuments = function() {
        closeStartMenu();
        showAlert(`<strong>Recent Documents:</strong><br><br>
            • Portfolio README.md<br>
            • Project Descriptions<br>
            • Resume.pdf<br>
            • Skills Overview<br><br>
            <em>Double-click any desktop icon to view details!</em>`, 
            'Documents', 'info');
    };

    // Settings - Display system information
    window.openSettings = function() {
        closeStartMenu();
        showAlert(`<strong>System Settings</strong><br><br>
            <strong>Display:</strong> Windows 95 Theme<br>
            <strong>Screen Resolution:</strong> ${window.screen.width} × ${window.screen.height}<br>
            <strong>Color Depth:</strong> 16-bit<br>
            <strong>Portfolio Version:</strong> 1.0<br>
            <strong>Developer:</strong> Srivatsa S<br><br>
            <em>This is a retro-themed portfolio interface!</em>`, 
            'Settings', 'info');
    };

    // Find - Search functionality
    window.openFind = function() {
        closeStartMenu();
        
        const existing = document.getElementById('find-dialog');
        if (existing) existing.remove();

        const findDiv = document.createElement('div');
        findDiv.id = 'find-dialog';
        findDiv.className = 'win95-dialog';
        findDiv.innerHTML = `
            <div class="win95-dialog-titlebar">
                <span>Find: All Files</span>
                <button class="win95-dialog-close" onclick="this.closest('.win95-dialog').remove()">✕</button>
            </div>
            <div class="win95-dialog-content" style="flex-direction: column; gap: 10px;">
                <div style="display: flex; gap: 10px; align-items: center;">
                    <label style="min-width: 60px;">Named:</label>
                    <input type="text" id="find-input" style="flex: 1; padding: 4px; border: 1px inset #808080;" placeholder="Search skills, projects...">
                </div>
                <div style="padding: 10px; background: white; border: 1px inset #808080; min-height: 100px; font-size: 11px;" id="find-results">
                    Enter a search term to find skills, projects, or information...
                </div>
            </div>
            <div class="win95-dialog-buttons">
                <button class="win95-btn" onclick="performFind()">Find Now</button>
                <button class="win95-btn" onclick="this.closest('.win95-dialog').remove()">Close</button>
            </div>
        `;

        document.body.appendChild(findDiv);

        // Center the dialog
        setTimeout(() => {
            const rect = findDiv.getBoundingClientRect();
            findDiv.style.left = `${(window.innerWidth - rect.width) / 2}px`;
            findDiv.style.top = `${(window.innerHeight - rect.height) / 2}px`;
        }, 10);

        makeDraggable(findDiv);
    };

    window.performFind = function() {
        const query = document.getElementById('find-input').value.toLowerCase();
        const results = document.getElementById('find-results');
        
        if (!query) {
            results.innerHTML = 'Please enter a search term.';
            return;
        }

        const searchData = {
            'html': 'Skills → Frontend Development',
            'css': 'Skills → Frontend Development',
            'javascript': 'Skills → Frontend Development',
            'react': 'Skills → Frontend Development',
            'python': 'Skills → Backend Development',
            'node': 'Skills → Backend Development',
            'portfolio': 'Projects → Windows 95 Portfolio',
            'chatbot': 'Projects → Mental Health Chatbot',
            'design': 'Skills → Design Tools',
            'figma': 'Skills → Design Tools',
            'git': 'Skills → Development Tools',
            'minesweeper': 'Games → Classic Minesweeper',
            'experience': 'Experience → Work History',
            'contact': 'Contact → Get in Touch'
        };

        let found = [];
        for (let [key, value] of Object.entries(searchData)) {
            if (key.includes(query) || value.toLowerCase().includes(query)) {
                found.push(`📁 ${value}`);
            }
        }

        if (found.length > 0) {
            results.innerHTML = `<strong>Found ${found.length} result(s):</strong><br><br>` + found.join('<br>');
        } else {
            results.innerHTML = `No results found for "${query}". Try: skills, projects, experience, or contact.`;
        }
    };

    // Help - Portfolio guide
    window.openHelp = function() {
        closeStartMenu();
        showAlert(`<strong>Portfolio Help & Tips</strong><br><br>
            🖱️ <strong>Navigation:</strong><br>
            • Double-click desktop icons to open windows<br>
            • Click and drag windows to move them<br>
            • Click Start menu for more options<br><br>
            
            💬 <strong>Chat with Ora:</strong><br>
            • Click the cat to ask questions about Srivatsa<br>
            • Try asking about skills, projects, or experience<br><br>
            
            📝 <strong>Guestbook:</strong><br>
            • Leave a message in the guestbook<br>
            • View messages from other visitors<br><br>
            
            🎮 <strong>Games:</strong><br>
            • Play Minesweeper for a retro gaming experience!<br><br>
            
            <em>Enjoy exploring the Windows 95 experience!</em>`, 
            'Portfolio Help', 'info');
    };

    // Run - Execute commands
    window.openRun = function() {
        closeStartMenu();
        
        const existing = document.getElementById('run-dialog');
        if (existing) existing.remove();

        const runDiv = document.createElement('div');
        runDiv.id = 'run-dialog';
        runDiv.className = 'win95-dialog';
        runDiv.innerHTML = `
            <div class="win95-dialog-titlebar">
                <span>Run</span>
                <button class="win95-dialog-close" onclick="this.closest('.win95-dialog').remove()">✕</button>
            </div>
            <div class="win95-dialog-content" style="flex-direction: column; gap: 15px;">
                <div style="font-size: 11px;">
                    Type the name of a program, folder, or document, and Portfolio will open it for you.
                </div>
                <div style="display: flex; gap: 10px; align-items: center;">
                    <label style="min-width: 50px;">Open:</label>
                    <input type="text" id="run-input" style="flex: 1; padding: 4px; border: 1px inset #808080;" placeholder="Try: about, skills, projects, chat">
                </div>
                <div style="font-size: 10px; color: #808080;">
                    <strong>Commands:</strong> about, skills, projects, experience, contact, chat, minesweeper, guestbook, terminal, eastereggs
                </div>
            </div>
            <div class="win95-dialog-buttons">
                <button class="win95-btn" onclick="executeRun()">OK</button>
                <button class="win95-btn" onclick="this.closest('.win95-dialog').remove()">Cancel</button>
            </div>
        `;

        document.body.appendChild(runDiv);

        // Center the dialog
        setTimeout(() => {
            const rect = runDiv.getBoundingClientRect();
            runDiv.style.left = `${(window.innerWidth - rect.width) / 2}px`;
            runDiv.style.top = `${(window.innerHeight - rect.height) / 2}px`;
        }, 10);

        makeDraggable(runDiv);
        
        // Focus input and allow Enter key
        setTimeout(() => {
            const input = document.getElementById('run-input');
            input.focus();
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') executeRun();
            });
        }, 100);
    };

    window.executeRun = function() {
        const command = document.getElementById('run-input').value.toLowerCase().trim();
        document.getElementById('run-dialog').remove();
        
        const commands = {
            'about': () => document.querySelector('[data-window="about"]').dispatchEvent(new Event('dblclick')),
            'skills': () => document.querySelector('[data-window="skills"]').dispatchEvent(new Event('dblclick')),
            'projects': () => document.querySelector('[data-window="projects"]').dispatchEvent(new Event('dblclick')),
            'experience': () => document.querySelector('[data-window="experience"]').dispatchEvent(new Event('dblclick')),
            'contact': () => document.querySelector('[data-window="contact"]').dispatchEvent(new Event('dblclick')),
            'chat': () => document.getElementById('chatbot-window').classList.add('active'),
            'minesweeper': () => document.querySelector('[data-window="minesweeper"]').dispatchEvent(new Event('dblclick')),
            'guestbook': () => document.getElementById('guestbook-window').style.display = 'flex',
            'terminal': () => document.querySelector('[data-window="terminal"]').dispatchEvent(new Event('dblclick')),
            'eastereggs': () => document.querySelector('[data-window="eastereggs"]').dispatchEvent(new Event('dblclick')),
            'ms-dos': () => document.querySelector('[data-window="terminal"]').dispatchEvent(new Event('dblclick')),
            'dos': () => document.querySelector('[data-window="terminal"]').dispatchEvent(new Event('dblclick'))
        };

        if (commands[command]) {
            commands[command]();
        } else if (command) {
            showAlert(`Cannot find '${command}'. Make sure the name is typed correctly, or try a different command.`, 'Run', 'error');
        }
    };

    // Shutdown - Show shutdown dialog
    window.shutDown = function() {
        closeStartMenu();
        
        showConfirm(
            `<strong>Shut Down Windows</strong><br><br>
            Are you sure you want to close this portfolio?<br><br>
            • <strong>Stand by</strong> - Return to welcome screen<br>
            • <strong>Shut down</strong> - Close this tab<br>
            • <strong>Restart</strong> - Reload the page`,
            'Shut Down Windows',
            function() {
                // Create custom shutdown dialog
                const existing = document.getElementById('shutdown-options');
                if (existing) existing.remove();

                const shutdownDiv = document.createElement('div');
                shutdownDiv.id = 'shutdown-options';
                shutdownDiv.className = 'win95-dialog';
                shutdownDiv.innerHTML = `
                    <div class="win95-dialog-titlebar">
                        <span>Shut Down Windows</span>
                        <button class="win95-dialog-close" onclick="this.closest('.win95-dialog').remove()">✕</button>
                    </div>
                    <div class="win95-dialog-content" style="flex-direction: column; gap: 10px;">
                        <div style="font-size: 11px; margin-bottom: 10px;">What do you want the computer to do?</div>
                        <div style="display: flex; flex-direction: column; gap: 5px;">
                            <label style="font-size: 11px;">
                                <input type="radio" name="shutdown-option" value="standby" checked>
                                Stand by (Return to welcome screen)
                            </label>
                            <label style="font-size: 11px;">
                                <input type="radio" name="shutdown-option" value="shutdown">
                                Shut down (Close tab)
                            </label>
                            <label style="font-size: 11px;">
                                <input type="radio" name="shutdown-option" value="restart">
                                Restart (Reload page)
                            </label>
                        </div>
                    </div>
                    <div class="win95-dialog-buttons">
                        <button class="win95-btn" onclick="performShutdown()">OK</button>
                        <button class="win95-btn" onclick="this.closest('.win95-dialog').remove()">Cancel</button>
                    </div>
                `;

                document.body.appendChild(shutdownDiv);

                // Center the dialog
                setTimeout(() => {
                    const rect = shutdownDiv.getBoundingClientRect();
                    shutdownDiv.style.left = `${(window.innerWidth - rect.width) / 2}px`;
                    shutdownDiv.style.top = `${(window.innerHeight - rect.height) / 2}px`;
                }, 10);

                makeDraggable(shutdownDiv);
            }
        );
    };

    window.performShutdown = function() {
        const option = document.querySelector('input[name="shutdown-option"]:checked').value;
        document.getElementById('shutdown-options').remove();

        if (option === 'standby') {
            // Show welcome screen
            const desktop = document.getElementById('desktop');
            desktop.style.display = 'none';
            const welcome = document.getElementById('welcome-window');
            if (welcome) welcome.style.display = 'block';
        } else if (option === 'shutdown') {
            // Show shutdown screen then close
            showShutdownScreen('It\'s now safe to close this tab.');
            setTimeout(() => window.close(), 2000);
        } else if (option === 'restart') {
            showShutdownScreen('Restarting...');
            setTimeout(() => location.reload(), 2000);
        }
    };

    function showShutdownScreen(message) {
        const shutdownScreen = document.createElement('div');
        shutdownScreen.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: #000080;
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: 'MS Sans Serif', sans-serif;
            font-size: 24px;
            z-index: 99999;
        `;
        shutdownScreen.textContent = message;
        document.body.appendChild(shutdownScreen);
    }

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

})();
