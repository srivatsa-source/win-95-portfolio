// Ora the roaming cat (Clippy style)
(function() {
    'use strict';

    document.addEventListener('DOMContentLoaded', () => {
        const ora = document.getElementById('roaming-ora');
        const oraImg = document.getElementById('ora-img');
        if (!ora || !oraImg) return;

        // Start roaming after a delay (allowing boot sequence and welcome window to finish)
        setTimeout(startWandering, 8000);

        function startWandering() {
            // Hide on very small screens to prevent layout issues
            if (window.innerWidth <= 768) return;
            
            ora.style.display = 'block';
            
            // Set initial position
            ora.style.left = '50vw';
            ora.style.top = '20vh';

            // Start roaming loops
            pickRandomPosition(); // go to first spot
            setInterval(pickRandomPosition, 6000);
            setInterval(changeExpression, 8000);
            
            // If the old floating cat exists from tour.js, we can hide it so we only have one Ora
            const floatingCat = document.getElementById('floating-cat-element');
            if (floatingCat) {
                floatingCat.style.display = 'none';
            }
        }

        function pickRandomPosition() {
            // Keep Ora within screen bounds, above taskbar
            const maxX = window.innerWidth - 100; 
            const maxY = window.innerHeight - 150; 

            const randomX = Math.max(20, Math.floor(Math.random() * maxX));
            const randomY = Math.max(20, Math.floor(Math.random() * maxY));

            // Face the direction of movement
            const currentX = parseInt(ora.style.left) || (window.innerWidth / 2);
            if (randomX > currentX) {
                // Moving right, flip horizontally
                oraImg.style.transform = 'scaleX(-1)';
            } else {
                // Moving left, normal orientation
                oraImg.style.transform = 'scaleX(1)';
            }

            ora.style.left = randomX + 'px';
            ora.style.top = randomY + 'px';
        }

        function changeExpression() {
            const expressions = ['cat-smile.png', 'cat-normal.png', 'cat-pointing.png'];
            const randomExpr = expressions[Math.floor(Math.random() * expressions.length)];
            oraImg.src = randomExpr;
        }

        // Click handler to open chat
        ora.addEventListener('click', () => {
            // Smile when clicked
            oraImg.src = 'cat-smile.png';
            
            const chatWindow = document.getElementById('chatbot-window');
            if (chatWindow) {
                chatWindow.classList.add('active');
                
                // Bring chat window to front
                if (window.zIndex !== undefined) {
                    window.zIndex++;
                    chatWindow.style.zIndex = window.zIndex;
                }
                
                // Focus input
                const chatInput = document.getElementById('chat-input');
                if (chatInput) chatInput.focus();
            }
        });
    });
})();
