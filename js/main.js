// Main initialization and startup
(function() {
    'use strict';

    // Global variables
    window.zIndex = 1000;

    // Initialize on page load
    window.addEventListener('load', function() {
        console.log('Page loaded, initializing...');
        
        // Enhanced mobile detection - checks user agent OR touch capability OR small screen
        const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
        const isSmallScreen = (window.innerWidth <= 768) || (window.innerHeight <= 768);
        const isMobile = isMobileDevice || (isTouchDevice && isSmallScreen);
        
        if (isMobile) {
            console.log('Mobile detected, showing notice');
            // Hide startup screen and desktop, show mobile notice
            const startupScreen = document.getElementById('startupScreen');
            const desktop = document.getElementById('desktop');
            const mobileNotice = document.getElementById('mobile-notice');
            
            if (startupScreen) startupScreen.style.display = 'none';
            if (desktop) desktop.style.display = 'none';
            if (mobileNotice) mobileNotice.style.display = 'block';
        } else {
            console.log('Desktop detected, starting sequence');
            // Ensure startup screen is visible and desktop is hidden initially
            const startupScreen = document.getElementById('startupScreen');
            const desktop = document.getElementById('desktop');
            if (startupScreen) startupScreen.style.display = 'flex';
            if (desktop) desktop.style.display = 'none';
            setTimeout(startupSequence, 500);
        }
        
        updateTime();
        setInterval(updateTime, 1000);
    });

    // Startup sequence
    function startupSequence() {
        console.log('Starting startup sequence...');
        const biosScreen = document.getElementById('biosScreen');
        const biosText = document.getElementById('biosText');
        const startupText = document.getElementById('startupText');
        const startupScreen = document.getElementById('startupScreen');
        const desktop = document.getElementById('desktop');
        const startupSound = document.getElementById('startupSound');
        
        if (!startupScreen || !desktop) {
            console.error('Required elements not found!');
            return;
        }

        // Hide startup screen initially, show BIOS if it exists
        startupScreen.style.display = 'none';
        if (biosScreen) {
            biosScreen.style.display = 'block';
            biosText.textContent = '';
        }
        
        const biosLines = [
            'Award Modular BIOS v4.51PG, An Energy Star Ally',
            'Copyright (C) 1984-2026, Award Software, Inc.',
            '',
            'SRIVATSA-AI-ENGINE BIOS V1.0',
            '',
            'Main Processor : SRIVATSA-CORE 3.4GHz',
            'Memory Testing : 655360K OK',
            '',
            'Initializing Dual-Model AI Engine... DeepSeek-R1 OK',
            'Connecting to Qwen Execution Node... OK',
            'Loading System Daemons...',
            'Knowledge Integrity Daemon... OK',
            'Booting Srivatsa.sys...'
        ];

        let lineIndex = 0;
        
        function typeBiosLine() {
            if (lineIndex < biosLines.length) {
                if (biosText) {
                    biosText.textContent += biosLines[lineIndex] + '\n';
                }
                lineIndex++;
                setTimeout(typeBiosLine, Math.random() * 150 + 50);
            } else {
                setTimeout(startWindowsSequence, 800);
            }
        }
        
        // Start typing BIOS lines if bios screen exists, else skip
        if (biosScreen) {
            typeBiosLine();
        } else {
            startWindowsSequence();
        }

        function startWindowsSequence() {
            if (biosScreen) biosScreen.style.display = 'none';
            startupScreen.style.display = 'flex';
            
            // Play startup sound
            if (startupSound) {
                startupSound.play().catch(e => console.log('Audio play failed:', e));
            }
            
            const messages = [
                'Initializing...',
                'Loading system files...',
                'Configuring hardware...',
                'Starting Windows...'
            ];
            
            let messageIndex = 0;
            const interval = setInterval(() => {
                if (messageIndex < messages.length) {
                    startupText.textContent = messages[messageIndex];
                    messageIndex++;
                } else {
                    clearInterval(interval);
                    setTimeout(() => {
                        startupScreen.style.display = 'none';
                        desktop.style.display = 'block';
                        animateSkillBars();
                        
                        // Show welcome window
                        const welcomeWindow = document.getElementById('welcome-window');
                        if (welcomeWindow) {
                            welcomeWindow.style.display = 'block';
                        }
                    }, 1000);
                }
            }, 800);
        }
    }

    // Animate skill bars
    function animateSkillBars() {
        const skillBars = document.querySelectorAll('.skill-fill');
        skillBars.forEach(bar => {
            const width = bar.getAttribute('data-width') || bar.style.width;
            bar.style.width = '0%';
            setTimeout(() => {
                bar.style.width = width;
            }, 100);
        });
    }
    window.animateSkillBars = animateSkillBars;

    // Update time display
    function updateTime() {
        const now = new Date();
        const hours = now.getHours();
        const minutes = now.getMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const displayHours = hours % 12 || 12;
        const displayMinutes = minutes < 10 ? '0' + minutes : minutes;
        const timeDisplay = document.getElementById('timeDisplay');
        if (timeDisplay) {
            timeDisplay.textContent = displayHours + ':' + displayMinutes + ' ' + ampm;
        }
    }

    // Start button functionality
    const startButton = document.querySelector('.start-button');
    const startMenu = document.getElementById('startMenu');
    
    if (startButton && startMenu) {
        startButton.addEventListener('click', function(e) {
            e.stopPropagation();
            const isVisible = startMenu.classList.contains('show');
            startMenu.classList.toggle('show');
            startButton.classList.toggle('pressed');
            
            if (!isVisible) {
                document.addEventListener('click', closeStartMenu);
            } else {
                document.removeEventListener('click', closeStartMenu);
            }
        });
    }

    function closeStartMenu() {
        if (startMenu) {
            startMenu.classList.remove('show');
        }
        if (startButton) {
            startButton.classList.remove('pressed');
        }
        document.removeEventListener('click', closeStartMenu);
    }

    // Mobile notice Continue button
    const mobileContinueBtn = document.getElementById('mobile-continue-btn');
    if (mobileContinueBtn) {
        mobileContinueBtn.addEventListener('click', function() {
            console.log('Mobile continue button clicked');
            const mobileNotice = document.getElementById('mobile-notice');
            const startupScreen = document.getElementById('startupScreen');
            
            if (mobileNotice) {
                mobileNotice.style.display = 'none';
            }
            // Show startup screen before starting sequence
            // Handled dynamically by startupSequence
            
            // Mark as seen so it doesn't show again
            localStorage.setItem('mobileNoticeSeen', 'true');
            // Start the startup sequence
            console.log('Starting startup sequence from mobile continue');
            setTimeout(startupSequence, 100);
        });
    }

    // Welcome window Enter button
    const enterBtn = document.getElementById('enter-btn');
    if (enterBtn) {
        enterBtn.addEventListener('click', function() {
            const welcomeWindow = document.getElementById('welcome-window');
            if (welcomeWindow) {
                welcomeWindow.style.display = 'none';
            }
            // Start the tour only on first visit
            const hasSeenTour = localStorage.getItem('portfolioTourSeen');
            if (!hasSeenTour && typeof startTour === 'function') {
                setTimeout(startTour, 500);
                localStorage.setItem('portfolioTourSeen', 'true');
            }
        });
    }

    // Alert dialog functions - Removed to allow win95-dialogs.js to handle this
    // window.showAlert is now handled by win95-dialogs.js which supports HTML content

    window.closeAlert = function() {
        const alertDialog = document.getElementById('alertDialog');
        if (alertDialog) {
            alertDialog.style.display = 'none';
        }
    };

    // Contact form submission with FormSpree
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const formData = new FormData(contactForm);
            const submitButton = contactForm.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;
            
            // Disable button and show loading state
            submitButton.disabled = true;
            submitButton.textContent = 'Sending...';
            
            try {
                const response = await fetch(contactForm.action, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });
                
                if (response.ok) {
                    showAlert('Thank you for your message! I will get back to you soon.');
                    contactForm.reset();
                } else {
                    const data = await response.json();
                    if (data.errors) {
                        showAlert('Oops! There was a problem submitting your form: ' + data.errors.map(error => error.message).join(', '));
                    } else {
                        showAlert('Oops! There was a problem submitting your form.');
                    }
                }
            } catch (error) {
                showAlert('Oops! There was a problem submitting your form. Please try again later.');
            } finally {
                // Re-enable button
                submitButton.disabled = false;
                submitButton.textContent = originalText;
            }
        });
    }

    // Load Notepad script dynamically
    const notepadScript = document.createElement('script');
    notepadScript.src = 'js/notepad.js';
    document.body.appendChild(notepadScript);

})();
