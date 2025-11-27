// MS-DOS Terminal Emulator
(function() {
    'use strict';

    const terminalInput = document.getElementById('terminal-input');
    const terminalOutput = document.getElementById('terminal-output');
    
    if (!terminalInput || !terminalOutput) return;

    // Command history
    let commandHistory = [];
    let historyIndex = -1;

    // DOS Commands
    const commands = {
        'help': () => {
            return `Available commands:
DIR       - List directory contents
CD        - Change directory
VER       - Display version
CLS       - Clear screen
TREE      - Display directory tree
TIME      - Display system time
DATE      - Display system date
ECHO      - Display message
TYPE      - Display file contents
ABOUT     - About this portfolio
SKILLS    - View technical skills
PROJECTS  - View projects
CONTACT   - Contact information
EXIT      - Close terminal`;
        },
        'dir': () => {
            return `Volume in drive C has no label
Volume Serial Number is 1995-0724

Directory of C:\\WINDOWS

.              <DIR>     11-26-2025  12:00p
..             <DIR>     11-26-2025  12:00p
ABOUT      TXT     2,048  11-26-2025  12:00p
SKILLS     TXT     4,096  11-26-2025  12:00p
PROJECTS   TXT     8,192  11-26-2025  12:00p
CONTACT    TXT     1,024  11-26-2025  12:00p
README     TXT       512  11-26-2025  12:00p
           5 file(s)     15,872 bytes
           2 dir(s)   999,999,999 bytes free`;
        },
        'ver': () => {
            return 'Microsoft Windows 95 [Version 4.00.950]';
        },
        'cls': () => {
            terminalOutput.innerHTML = `<div>C:\\WINDOWS&gt;</div>`;
            return '';
        },
        'tree': () => {
            return `Folder PATH listing
Volume serial number is 1995-0724
C:\\WINDOWS
│
├───PORTFOLIO
│   ├───ABOUT.TXT
│   ├───SKILLS.TXT
│   ├───PROJECTS.TXT
│   └───CONTACT.TXT
│
├───SYSTEM
│   ├───GUESTBOOK.DAT
│   └───VISITOR.CNT
│
└───PROGRAMS
    └───MINESWEEPER.EXE`;
        },
        'time': () => {
            const now = new Date();
            return `Current time is: ${now.toLocaleTimeString()}`;
        },
        'date': () => {
            const now = new Date();
            return `Current date is: ${now.toLocaleDateString()}`;
        },
        'about': () => {
            return `ABOUT.TXT - Srivatsa Veda
─────────────────────────────────
Full-stack developer passionate about creating
innovative web applications and AI solutions.

This Windows 95 portfolio showcases my work
using authentic retro design principles.

Type 'SKILLS' for technical expertise
Type 'PROJECTS' to see my work`;
        },
        'skills': () => {
            return `SKILLS.TXT - Technical Expertise
─────────────────────────────────
▸ Frontend: React, Vue.js, JavaScript, HTML/CSS
▸ Backend: Node.js, Express, Python, Java
▸ Database: PostgreSQL, MongoDB, Supabase
▸ AI/ML: OpenAI GPT, Machine Learning
▸ Tools: Git, Docker, VS Code, Linux

Type 'PROJECTS' to see applications built with these skills`;
        },
        'projects': () => {
            return `PROJECTS.TXT - Portfolio
─────────────────────────────────
[1] Windows 95 Portfolio
    Retro-themed portfolio with AI chatbot
    Tech: JavaScript, OpenAI, Supabase
    
[2] AI Chat Assistant "Ora"
    GPT-powered conversational assistant
    Tech: Node.js, OpenAI API, Express

[3] Minesweeper Game
    Classic Windows game recreation
    Tech: Vanilla JavaScript, DOM manipulation

Type 'CONTACT' for ways to reach out`;
        },
        'contact': () => {
            return `CONTACT.TXT - Get in Touch
─────────────────────────────────
Email: [Your email here]
LinkedIn: [Your LinkedIn]
GitHub: srivatsa-source
Portfolio: https://win-95-portfolio.vercel.app

Feel free to reach out for collaboration!`;
        },
        'exit': () => {
            closeWindow('terminal');
            return '';
        }
    };

    // Handle command input
    terminalInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            const command = this.value.trim().toLowerCase();
            
            if (command) {
                // Add to history
                commandHistory.push(command);
                historyIndex = commandHistory.length;

                // Display command
                const commandLine = document.createElement('div');
                commandLine.textContent = `C:\\WINDOWS> ${this.value}`;
                terminalOutput.appendChild(commandLine);

                // Execute command
                let output = '';
                const baseCommand = command.split(' ')[0];
                
                if (command.startsWith('echo ')) {
                    output = command.substring(5);
                } else if (command.startsWith('type ')) {
                    const filename = command.substring(5).toLowerCase();
                    if (filename === 'about.txt') output = commands.about();
                    else if (filename === 'skills.txt') output = commands.skills();
                    else if (filename === 'projects.txt') output = commands.projects();
                    else if (filename === 'contact.txt') output = commands.contact();
                    else output = `File not found: ${filename}`;
                } else if (commands[baseCommand]) {
                    output = commands[baseCommand]();
                } else if (command) {
                    output = `Bad command or file name: ${command}`;
                }

                // Display output
                if (output) {
                    const outputLines = output.split('\n');
                    outputLines.forEach(line => {
                        const outputLine = document.createElement('div');
                        outputLine.textContent = line;
                        terminalOutput.appendChild(outputLine);
                    });
                }

                // Add blank line and new prompt
                const blankLine = document.createElement('div');
                blankLine.innerHTML = '&nbsp;';
                terminalOutput.appendChild(blankLine);

                // Scroll to bottom
                const terminalContent = terminalOutput.parentElement;
                terminalContent.scrollTop = terminalContent.scrollHeight;
            }

            this.value = '';
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (historyIndex > 0) {
                historyIndex--;
                this.value = commandHistory[historyIndex];
            }
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (historyIndex < commandHistory.length - 1) {
                historyIndex++;
                this.value = commandHistory[historyIndex];
            } else {
                historyIndex = commandHistory.length;
                this.value = '';
            }
        }
    });

    // Focus input when clicking terminal
    const terminalWindow = document.getElementById('terminal');
    if (terminalWindow) {
        terminalWindow.addEventListener('click', function() {
            terminalInput.focus();
        });
    }

    // Auto-focus when terminal opens
    const originalOpenWindow = window.openWindow;
    if (originalOpenWindow) {
        window.openWindow = function(windowId) {
            originalOpenWindow(windowId);
            if (windowId === 'terminal') {
                setTimeout(() => terminalInput.focus(), 100);
            }
        };
    }
})();
