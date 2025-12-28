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
                
                // Show the final cat dialog after tour ends
                showCatFinishDialog();
            }
        });

        driverObj.drive();
    };
    
    // Show a Windows 95 themed dialog with cat avatar when tour finishes
    function showCatFinishDialog() {
        // Create overlay
        const overlay = document.createElement('div');
        overlay.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.5); z-index: 9999; display: flex; justify-content: center; align-items: center;';
        
        // Create dialog
        const dialog = document.createElement('div');
        dialog.className = 'win95-dialog';
        dialog.style.cssText = 'position: relative; min-width: 350px; max-width: 400px; background: #c0c0c0; border: 2px outset #fff; box-shadow: 2px 2px 0 #000; font-family: "MS Sans Serif", Tahoma, sans-serif;';
        
        // Dialog title bar
        const titleBar = document.createElement('div');
        titleBar.style.cssText = 'background: linear-gradient(90deg, #000080, #1084d0); color: white; padding: 3px 5px; font-weight: bold; font-size: 12px; display: flex; justify-content: space-between; align-items: center;';
        titleBar.innerHTML = '<span>🐱 Ora Says...</span>';
        
        // Close button
        const closeBtn = document.createElement('button');
        closeBtn.innerHTML = '×';
        closeBtn.style.cssText = 'background: #c0c0c0; border: 2px outset #fff; width: 18px; height: 18px; font-size: 12px; line-height: 1; cursor: pointer; padding: 0;';
        closeBtn.onclick = () => overlay.remove();
        titleBar.appendChild(closeBtn);
        
        // Dialog content
        const content = document.createElement('div');
        content.style.cssText = 'padding: 15px; display: flex; align-items: flex-start; gap: 15px;';
        
        // Cat image
        const catImg = document.createElement('img');
        catImg.src = catImages.smile;
        catImg.alt = 'Ora the cat';
        catImg.style.cssText = 'width: 80px; height: 80px; object-fit: contain; flex-shrink: 0;';
        
        // Message
        const message = document.createElement('div');
        message.innerHTML = `
            <p style="margin: 0 0 10px 0; font-size: 14px;"><strong>That's the end of the tour!</strong></p>
            <p style="margin: 0; font-size: 13px;">Feel free to explore! If you want to chat with me or learn more about Srivatsa, just click on me anytime - I'll be floating around. 🐱</p>
        `;
        
        content.appendChild(catImg);
        content.appendChild(message);
        
        // Button container
        const btnContainer = document.createElement('div');
        btnContainer.style.cssText = 'padding: 10px 15px 15px; text-align: center;';
        
        // OK button
        const okBtn = document.createElement('button');
        okBtn.textContent = 'OK';
        okBtn.style.cssText = 'background: #c0c0c0; border: 2px outset #fff; padding: 5px 25px; font-size: 12px; cursor: pointer; min-width: 80px;';
        okBtn.onclick = () => overlay.remove();
        okBtn.onmousedown = function() {
            this.style.border = '2px inset #fff';
        };
        okBtn.onmouseup = function() {
            this.style.border = '2px outset #fff';
        };
        
        btnContainer.appendChild(okBtn);
        
        // Assemble dialog
        dialog.appendChild(titleBar);
        dialog.appendChild(content);
        dialog.appendChild(btnContainer);
        overlay.appendChild(dialog);
        document.body.appendChild(overlay);
        
        // Focus the OK button
        okBtn.focus();
        
        // Close on overlay click
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                overlay.remove();
            }
        });
        
        // Close on Escape key
        const escHandler = (e) => {
            if (e.key === 'Escape') {
                overlay.remove();
                document.removeEventListener('keydown', escHandler);
            }
        };
        document.addEventListener('keydown', escHandler);
    }

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
