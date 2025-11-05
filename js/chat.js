// Chatbot functionality
(function() {
    'use strict';

    const chatWindow = document.getElementById('chatbot-window');
    const chatMessages = document.getElementById('chat-messages');
    const chatInput = document.getElementById('chat-input');
    const chatSend = document.getElementById('chat-send');
    const chatClose = document.getElementById('chat-close');
    const chatFullscreen = document.getElementById('chat-fullscreen');
    const chatCatAvatar = document.getElementById('chat-cat-avatar');
    const typingIndicator = document.querySelector('.typing-indicator');
    const optionButtons = document.querySelectorAll('.chat-option-btn');

    // Knowledge base
    const knowledge = {
        hello: {
            text: "Hey there! Nice to meet you! I'm Ora, Srivatsa's helpful assistant cat. What would you like to know about him?",
            avatar: 'cat-smile.png'
        },
        name: {
            text: "I'm Ora! I'm Srivatsa's virtual assistant cat. I'm here to help you learn more about him and his work. What would you like to know?",
            avatar: 'cat-smile.png'
        },
        whatareyou: {
            text: "I'm a pixel-art cat mascot created to guide visitors through Srivatsa's portfolio! Think of me as your friendly Windows 95-era desktop assistant. Meow!",
            avatar: 'cat-normal.png'
        },
        thanks: {
            text: "You're welcome! Happy to help! Feel free to ask me anything else about Srivatsa or just explore the portfolio.",
            avatar: 'cat-smile.png'
        },
        who: {
            text: "Srivatsa S is a graphic designer and software developer from India. He blends art and technology — focusing on logo design, branding, product labeling, and web/app development. He's passionate about creating interactive and retro-themed experiences!",
            avatar: 'cat-pointing.png'
        },
        skills: {
            text: "He's proficient in HTML, CSS, JavaScript, React, Unity, and Figma. He specializes in creating interactive experiences with a nostalgic touch — like this Windows 95-themed portfolio you're exploring right now!",
            avatar: 'cat-pointing.png'
        },
        projects: {
            text: "He's worked with companies like Cook n Klean and Mril Q. Currently building games like a medieval 2D pixel platformer and 'The Dream Loop' — a mental health game. Also developing AI-based community tools and this awesome portfolio system!",
            avatar: 'cat-smile.png'
        },
        fun: {
            text: "Well, you're experiencing one right now! This entire Windows 95-themed portfolio is hand-crafted. He's also building a retro Minesweeper game (check the icon on the desktop!) and pixel-art adventures. Plus, I'm here — Ora the helpful cat!",
            avatar: 'cat-smile.png'
        },
        default: {
            text: "That's an interesting question! I'm still learning about Srivatsa. Why not try asking about his skills, projects, or who he is? Or feel free to explore the portfolio windows on the desktop!",
            avatar: 'cat-normal.png'
        }
    };

    // Close chatbot
    chatClose.addEventListener('click', () => {
        chatWindow.classList.remove('active');
    });

    // Handle option buttons
    optionButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const query = btn.dataset.query;
            const questionText = btn.textContent.trim();
            addUserMessage(questionText);
            setTimeout(() => respondToQuery(query), 800);
        });
    });

    // Send message
    chatSend.addEventListener('click', sendMessage);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });

    function sendMessage() {
        const message = chatInput.value.trim();
        if (!message) return;

        addUserMessage(message);
        chatInput.value = '';

        // Simple keyword matching
        setTimeout(() => {
            const lowerMsg = message.toLowerCase();
            if (lowerMsg.includes('hello') || lowerMsg.includes('hi ') || lowerMsg.includes('hey') || lowerMsg === 'hi') {
                respondToQuery('hello');
            } else if (lowerMsg.includes('your name') || lowerMsg.includes('who are you') || (lowerMsg.includes('what') && lowerMsg.includes('name'))) {
                respondToQuery('name');
            } else if (lowerMsg.includes('what are you') || lowerMsg.includes('what r u')) {
                respondToQuery('whatareyou');
            } else if (lowerMsg.includes('thank') || lowerMsg.includes('thanks') || lowerMsg.includes('thx')) {
                respondToQuery('thanks');
            } else if (lowerMsg.includes('who') || lowerMsg.includes('about') || lowerMsg.includes('srivatsa')) {
                respondToQuery('who');
            } else if (lowerMsg.includes('skill') || lowerMsg.includes('tech') || lowerMsg.includes('know')) {
                respondToQuery('skills');
            } else if (lowerMsg.includes('project') || lowerMsg.includes('work') || lowerMsg.includes('built')) {
                respondToQuery('projects');
            } else if (lowerMsg.includes('fun') || lowerMsg.includes('game') || lowerMsg.includes('cool')) {
                respondToQuery('fun');
            } else {
                respondToQuery('default');
            }
        }, 800);
    }

    function addUserMessage(text) {
        const msgDiv = document.createElement('div');
        msgDiv.className = 'chat-message user';
        msgDiv.innerHTML = `
            <div class="chat-bubble">
                ${text}
                <div class="chat-timestamp">${getTime()}</div>
            </div>
        `;
        chatMessages.insertBefore(msgDiv, typingIndicator);
        scrollToBottom();
        showTyping();
    }

    function respondToQuery(query) {
        const response = knowledge[query] || knowledge.default;
        chatCatAvatar.src = response.avatar;
        
        const msgDiv = document.createElement('div');
        msgDiv.className = 'chat-message cat';
        msgDiv.innerHTML = `
            <img src="${response.avatar}" alt="Ora" class="chat-avatar">
            <div class="chat-bubble">
                ${response.text}
                <div class="chat-timestamp">${getTime()}</div>
            </div>
        `;
        
        hideTyping();
        chatMessages.insertBefore(msgDiv, typingIndicator);
        scrollToBottom();
    }

    function showTyping() {
        typingIndicator.classList.add('active');
        scrollToBottom();
    }

    function hideTyping() {
        typingIndicator.classList.remove('active');
    }

    function scrollToBottom() {
        setTimeout(() => {
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }, 100);
    }

    function getTime() {
        const now = new Date();
        return now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    }

    // Make chatbot window draggable
    let isDragging = false;
    let currentX;
    let currentY;
    let initialX;
    let initialY;

    const titlebar = chatWindow.querySelector('.chat-titlebar');
    
    titlebar.addEventListener('mousedown', dragStart);
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', dragEnd);

    function dragStart(e) {
        if (e.target.closest('.chat-controls')) return;
        initialX = e.clientX - chatWindow.offsetLeft;
        initialY = e.clientY - chatWindow.offsetTop;
        isDragging = true;
    }

    function drag(e) {
        if (!isDragging) return;
        e.preventDefault();
        currentX = e.clientX - initialX;
        currentY = e.clientY - initialY;
        chatWindow.style.left = currentX + 'px';
        chatWindow.style.top = currentY + 'px';
        chatWindow.style.transform = 'none';
    }

    function dragEnd() {
        isDragging = false;
    }

    // Fullscreen toggle
    chatFullscreen.addEventListener('click', () => {
        chatWindow.classList.toggle('fullscreen');
        if (chatWindow.classList.contains('fullscreen')) {
            chatFullscreen.textContent = '❐';
        } else {
            chatFullscreen.textContent = '⛶';
        }
    });

})();
