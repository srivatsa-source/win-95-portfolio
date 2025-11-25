// Tour guide functionality with Driver.js and cat mascot
(function() {
    'use strict';

    const catImages = {
        smile: 'cat-smile.png',
        normal: 'cat-normal.png',
        pointing: 'cat-pointing.png'
    };

    let tourGuideCat = null;
    let floatingCat = null;

    function createTourGuideCat() {
        tourGuideCat = document.createElement('img');
        tourGuideCat.className = 'tour-guide-cat';
        tourGuideCat.src = catImages.pointing;
        tourGuideCat.alt = 'Tour guide cat';
        tourGuideCat.style.display = 'none';
        document.body.appendChild(tourGuideCat);
    }

    function createFloatingCat() {
        floatingCat = document.createElement('img');
        floatingCat.className = 'floating-cat';
        floatingCat.src = catImages.normal;
        floatingCat.alt = 'Guide cat - Click to chat with me!';
        floatingCat.title = 'Click me to chat!';
        floatingCat.id = 'floating-cat-element';

        floatingCat.addEventListener('mouseenter', () => {
            if (floatingCat.src.includes('normal')) {
                floatingCat.src = catImages.smile;
            }
        });

        floatingCat.addEventListener('mouseleave', () => {
            if (floatingCat.src.includes('smile')) {
                floatingCat.src = catImages.normal;
            }
        });

        floatingCat.addEventListener('click', () => {
            floatingCat.src = catImages.smile;
            const chatWindow = document.getElementById('chatbot-window');
            if (chatWindow) {
                chatWindow.classList.add('active');
                const chatInput = document.getElementById('chat-input');
                if (chatInput) chatInput.focus();
            }
        });

        document.body.appendChild(floatingCat);
    }

    function positionCatNearPopover() {
        setTimeout(() => {
            const popover = document.querySelector('.driver-popover');
            if (popover && tourGuideCat) {
                const rect = popover.getBoundingClientRect();
                const catX = rect.left - 140;
                const catY = rect.bottom - 120;
                
                tourGuideCat.style.left = catX + 'px';
                tourGuideCat.style.top = catY + 'px';
                tourGuideCat.style.display = 'block';
                tourGuideCat.style.opacity = '1';
            }
        }, 50);
    }

    window.startTour = function() {
        if (!window.driver || !window.driver.js) {
            console.error('Driver.js not loaded');
            return;
        }

        const driver = window.driver.js.driver;
        
        if (floatingCat) {
            floatingCat.style.display = 'none';
        }
        
        const driverObj = driver({
            showProgress: true,
            progressText: 'Step {{current}} of {{total}}',
            nextBtnText: 'Next →',
            prevBtnText: '← Back',
            doneBtnText: 'Finish Tour',
            allowClose: true,
            overlayOpacity: 0.75,
            animate: true,
            steps: [
                {
                    element: '.desktop-icon[data-window="about"]',
                    popover: {
                        title: 'About Me',
                        description: 'Click here to learn about my background and journey. Double-click to open the window!',
                        side: 'right',
                        align: 'start'
                    },
                    onHighlightStarted: () => {
                        tourGuideCat.src = catImages.pointing;
                        tourGuideCat.style.display = 'block';
                        setTimeout(positionCatNearPopover, 250);
                        setTimeout(positionCatNearPopover, 400);
                    }
                },
                {
                    element: '.desktop-icon[data-window="skills"]',
                    popover: {
                        title: 'My Skills',
                        description: 'Check out the technologies and tools I work with! See my progress bars showing skill levels.',
                        side: 'right',
                        align: 'start'
                    },
                    onHighlightStarted: () => {
                        tourGuideCat.src = catImages.pointing;
                        tourGuideCat.style.display = 'block';
                        setTimeout(positionCatNearPopover, 250);
                        setTimeout(positionCatNearPopover, 400);
                    }
                },
                {
                    element: '.desktop-icon[data-window="projects"]',
                    popover: {
                        title: 'Projects',
                        description: 'Take a look at what I\'ve built. Each project showcases different skills and technologies!',
                        side: 'right',
                        align: 'start'
                    },
                    onHighlightStarted: () => {
                        tourGuideCat.src = catImages.pointing;
                        tourGuideCat.style.display = 'block';
                        setTimeout(positionCatNearPopover, 250);
                        setTimeout(positionCatNearPopover, 400);
                    }
                },
                {
                    element: '.desktop-icon[data-window="experience"]',
                    popover: {
                        title: 'Experience',
                        description: 'Explore my professional journey and educational background.',
                        side: 'right',
                        align: 'start'
                    },
                    onHighlightStarted: () => {
                        tourGuideCat.src = catImages.pointing;
                        tourGuideCat.style.display = 'block';
                        setTimeout(positionCatNearPopover, 250);
                        setTimeout(positionCatNearPopover, 400);
                    }
                },
                {
                    element: '.desktop-icon[data-window="contact"]',
                    popover: {
                        title: 'Get In Touch',
                        description: 'Let\'s connect! Feel free to reach out using the contact form. We\'re here to help!',
                        side: 'right',
                        align: 'start'
                    },
                    onHighlightStarted: () => {
                        tourGuideCat.src = catImages.smile;
                        tourGuideCat.style.display = 'block';
                        setTimeout(positionCatNearPopover, 250);
                        setTimeout(positionCatNearPopover, 400);
                    }
                },
                {
                    element: '.desktop-icon[data-window="minesweeper"]',
                    popover: {
                        title: 'Minesweeper',
                        description: 'Take a break and play a classic game of Minesweeper! Just like the good old days.',
                        side: 'left',
                        align: 'start'
                    },
                    onHighlightStarted: () => {
                        tourGuideCat.src = catImages.smile;
                        tourGuideCat.style.display = 'block';
                        setTimeout(positionCatNearPopover, 250);
                        setTimeout(positionCatNearPopover, 400);
                    }
                },
                {
                    element: '#floating-cat-element',
                    popover: {
                        title: 'Chat with Me!',
                        description: 'That\'s the tour! If you want to know more about Srivatsa, just click on me (the cat in the middle) anytime. I\'m Ora, your helpful guide! Let me show you...',
                        side: 'top',
                        align: 'center'
                    },
                    onHighlightStarted: () => {
                        tourGuideCat.style.display = 'none';
                    },
                    onHighlighted: () => {
                        // Position popover near the floating cat with bounds checking
                        setTimeout(() => {
                            const popover = document.querySelector('.driver-popover');
                            const floatingCatElement = document.getElementById('floating-cat-element');
                            if (popover && floatingCatElement) {
                                const catRect = floatingCatElement.getBoundingClientRect();
                                const popoverHeight = popover.offsetHeight;
                                const popoverWidth = popover.offsetWidth;
                                const viewportWidth = window.innerWidth;
                                const viewportHeight = window.innerHeight;
                                
                                // Calculate centered position
                                let left = catRect.left + (catRect.width / 2) - (popoverWidth / 2);
                                let top = catRect.top - popoverHeight - 20; // 20px above the cat
                                
                                // Ensure popover stays within viewport bounds
                                left = Math.max(10, Math.min(left, viewportWidth - popoverWidth - 10));
                                top = Math.max(10, Math.min(top, viewportHeight - popoverHeight - 10));
                                
                                popover.style.position = 'fixed';
                                popover.style.left = left + 'px';
                                popover.style.top = top + 'px';
                            }
                        }, 100);
                        
                        setTimeout(() => {
                            const chatWindow = document.getElementById('chatbot-window');
                            if (chatWindow) {
                                chatWindow.classList.add('active');
                            }
                        }, 1000);
                    }
                }
            ],
            onDestroyed: () => {
                if (tourGuideCat) {
                    tourGuideCat.style.display = 'none';
                }
                if (floatingCat) {
                    floatingCat.style.display = 'block';
                    floatingCat.src = catImages.normal;
                }
            }
        });

        driverObj.drive();
    };

    // Initialize cats
    function init() {
        createTourGuideCat();
        createFloatingCat();
    }

    // Wait for DOM and Driver.js to load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
