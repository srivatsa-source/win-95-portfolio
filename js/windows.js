// Window management functionality
(function() {
    'use strict';

    let windowDraggedElement = null;
    let windowDragOffset = { x: 0, y: 0 };
    let instanceCounter = 0;
    
    // Initialize global zIndex if not exists
    if (typeof window.zIndex === 'undefined') {
        window.zIndex = 100;
    }

    // Open window
    window.openWindow = function(windowId) {
        const win = document.getElementById(windowId);
        if (!win) return;
        
        // Deactivate all other windows but keep them visible
        document.querySelectorAll('.window.active').forEach(w => {
            if (w.id !== windowId) {
                w.classList.remove('active');
            }
        });
        
        // Activate the clicked window
        win.classList.add('active');
        win.classList.remove('inactive');
        win.style.zIndex = ++window.zIndex;
        
        ensureTaskbarEntry(win);
        attachWindowBehavior(win);
        updateTaskbarActiveStates();
        
        // Special handling for minesweeper
        if (windowId === 'minesweeper' && typeof initializeMinesweeper === 'function') {
            initializeMinesweeper();
        }

        // Special handling for new apps
        if (windowId === 'calculator' && typeof window.initCalculator === 'function') {
            window.initCalculator();
        }
        if (windowId === 'paint' && typeof window.initPaint === 'function') {
            window.initPaint();
        }
        if (windowId === 'notepad' && typeof window.initNotepad === 'function') {
            window.initNotepad();
        }
        if (windowId === 'mycomputer' && typeof window.initMyComputer === 'function') {
            window.initMyComputer();
        }
    };

    // Close window
    window.closeWindow = function(windowId) {
        const win = document.getElementById(windowId);
        if (!win) return;
        
        win.classList.remove('active');
        win.classList.add('inactive');
        removeTaskbarEntry(windowId);
        updateTaskbarActiveStates();
    };

    // Minimize window
    window.minimizeWindow = function(windowId) {
        const win = document.getElementById(windowId);
        if (!win) return;
        
        win.classList.remove('active');
        win.classList.add('inactive');
        updateTaskbarActiveStates();
    };

    // Toggle maximize/restore
    window.toggleMaximize = function(windowId) {
        const win = document.getElementById(windowId);
        if (!win) return;
        
        if (win.classList.contains('maximized')) {
            // Restore
            win.classList.remove('maximized');
            if (win._savedBounds) {
                win.style.left = win._savedBounds.left;
                win.style.top = win._savedBounds.top;
                win.style.width = win._savedBounds.width;
                win.style.height = win._savedBounds.height;
                win.style.transform = win._savedBounds.transform || '';
            }
        } else {
            // Maximize - save current bounds
            const rect = win.getBoundingClientRect();
            win._savedBounds = {
                left: win.style.left || rect.left + 'px',
                top: win.style.top || rect.top + 'px',
                width: win.style.width || rect.width + 'px',
                height: win.style.height || rect.height + 'px',
                transform: win.style.transform || ''
            };
            
            // Apply maximized state
            win.classList.add('maximized');
            win.style.left = '0';
            win.style.top = '0';
            win.style.width = '100vw';
            win.style.height = 'calc(100vh - 40px)';
            win.style.transform = 'none';
            win.style.zIndex = ++window.zIndex;
        }
    };

    // Attach window behavior (dragging, buttons)
    function attachWindowBehavior(win) {
        const titleBar = win.querySelector('.title-bar');
        if (!titleBar) return;
        
        // Remove existing listeners
        titleBar.removeEventListener('mousedown', handleTitleBarMouseDown);
        titleBar.removeEventListener('touchstart', handleTitleBarTouchStart);
        
        // Add event listeners
        titleBar.addEventListener('mousedown', handleTitleBarMouseDown);
        titleBar.addEventListener('touchstart', handleTitleBarTouchStart, { passive: false });
        
        // Window control buttons
        const minimizeBtn = win.querySelector('.window-button:nth-child(1)');
        const closeBtn = win.querySelector('.window-button:nth-child(2)');
        
        if (minimizeBtn) {
            minimizeBtn.onclick = () => minimizeWindow(win.id);
        }
        if (closeBtn) {
            closeBtn.onclick = () => closeWindow(win.id);
        }
    }

    // Mouse event handlers
    function handleTitleBarMouseDown(e) {
        // Skip on mobile devices to prefer touch events
        if ('ontouchstart' in window && window.innerWidth <= 768) return;
        if (e.button !== 0) return;
        
        const win = e.currentTarget.closest('.window');
        if (!win) return;
        
        windowDraggedElement = win;
        windowDraggedElement.style.zIndex = ++window.zIndex;
        
        const rect = windowDraggedElement.getBoundingClientRect();
        windowDragOffset.x = e.clientX - rect.left;
        windowDragOffset.y = e.clientY - rect.top;
        
        document.addEventListener('mousemove', dragWindow);
        document.addEventListener('mouseup', stopDragWindow);
        windowDraggedElement.style.opacity = '0.9';
    }

    function dragWindow(e) {
        if (!windowDraggedElement) return;
        
        let newX = e.clientX - windowDragOffset.x;
        let newY = e.clientY - windowDragOffset.y;
        
        // Keep window within bounds
        const maxX = window.innerWidth - windowDraggedElement.offsetWidth;
        const maxY = window.innerHeight - windowDraggedElement.offsetHeight - 40;
        
        windowDraggedElement.style.left = Math.max(0, Math.min(newX, maxX)) + 'px';
        windowDraggedElement.style.top = Math.max(0, Math.min(newY, maxY)) + 'px';
    }

    function stopDragWindow() {
        if (windowDraggedElement) {
            windowDraggedElement.style.opacity = '1';
        }
        windowDraggedElement = null;
        document.removeEventListener('mousemove', dragWindow);
        document.removeEventListener('mouseup', stopDragWindow);
    }

    // Touch event handlers for mobile
    function handleTitleBarTouchStart(e) {
        // Let button clicks work normally
        if (e.target.classList.contains('window-button')) {
            return;
        }
        
        const win = e.currentTarget.closest('.window');
        if (!win) return;
        
        // On mobile (≤768px), just activate the window without dragging
        if (window.innerWidth <= 768) {
            if (!win.classList.contains('active')) {
                openWindow(win.id);
            }
            return;
        }
        
        // On larger screens, allow dragging
        e.preventDefault();
        
        const touch = e.touches[0];
        windowDraggedElement = win;
        windowDraggedElement.style.zIndex = ++window.zIndex;
        
        const rect = windowDraggedElement.getBoundingClientRect();
        windowDragOffset.x = touch.clientX - rect.left;
        windowDragOffset.y = touch.clientY - rect.top;
        
        document.addEventListener('touchmove', dragWindowTouch, { passive: false });
        document.addEventListener('touchend', stopDragWindowTouch);
        windowDraggedElement.style.opacity = '0.9';
    }

    function dragWindowTouch(e) {
        if (!windowDraggedElement) return;
        e.preventDefault();
        
        const touch = e.touches[0];
        let newX = touch.clientX - windowDragOffset.x;
        let newY = touch.clientY - windowDragOffset.y;
        
        // Keep window within bounds
        const maxX = window.innerWidth - windowDraggedElement.offsetWidth;
        const maxY = window.innerHeight - windowDraggedElement.offsetHeight - 40;
        
        windowDraggedElement.style.left = Math.max(0, Math.min(newX, maxX)) + 'px';
        windowDraggedElement.style.top = Math.max(0, Math.min(newY, maxY)) + 'px';
    }

    function stopDragWindowTouch() {
        if (windowDraggedElement) {
            windowDraggedElement.style.opacity = '1';
        }
        document.removeEventListener('touchmove', dragWindowTouch);
        document.removeEventListener('touchend', stopDragWindowTouch);
        windowDraggedElement = null;
    }

    // Taskbar management
    function ensureTaskbarEntry(win) {
        const apps = document.getElementById('taskbarApps');
        if (!apps) return;
        
        const existingBtn = document.getElementById('tb_' + win.id);
        if (existingBtn) {
            existingBtn.classList.add('active');
            return;
        }
        
        const btn = document.createElement('button');
        btn.className = 'win95-btn';
        btn.id = 'tb_' + win.id;
        btn.textContent = win.querySelector('.title-bar span')?.textContent || win.id;
        
        btn.addEventListener('click', function() {
            if (win.classList.contains('active')) {
                minimizeWindow(win.id);
            } else {
                openWindow(win.id);
            }
        });
        
        apps.appendChild(btn);
        updateTaskbarActiveStates();
    }

    function removeTaskbarEntry(winId) {
        const btn = document.getElementById('tb_' + winId);
        if (btn && btn.parentElement) {
            btn.parentElement.removeChild(btn);
        }
    }

    function updateTaskbarActiveStates() {
        const apps = document.getElementById('taskbarApps');
        if (!apps) return;
        
        const buttons = apps.querySelectorAll('.win95-btn');
        buttons.forEach(btn => {
            const winId = btn.id.replace('tb_', '');
            const win = document.getElementById(winId);
            
            if (win && win.classList.contains('active')) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }

    // Window resizing
    function setupWindowResize() {
        document.querySelectorAll('.window').forEach(win => {
            const seHandle = win.querySelector('.resize-handle.se');
            const sHandle = win.querySelector('.resize-handle.s');
            const eHandle = win.querySelector('.resize-handle.e');
            
            if (seHandle) {
                seHandle.addEventListener('mousedown', (e) => startResize(e, win, 'se'));
            }
            if (sHandle) {
                sHandle.addEventListener('mousedown', (e) => startResize(e, win, 's'));
            }
            if (eHandle) {
                sHandle.addEventListener('mousedown', (e) => startResize(e, win, 'e'));
            }
        });
    }

    let resizing = null;
    function startResize(e, win, direction) {
        e.preventDefault();
        e.stopPropagation();
        
        resizing = {
            win: win,
            direction: direction,
            startX: e.clientX,
            startY: e.clientY,
            startWidth: win.offsetWidth,
            startHeight: win.offsetHeight
        };
        
        document.addEventListener('mousemove', handleResize);
        document.addEventListener('mouseup', stopResize);
    }

    function handleResize(e) {
        if (!resizing) return;
        
        const dx = e.clientX - resizing.startX;
        const dy = e.clientY - resizing.startY;
        
        if (resizing.direction.includes('e')) {
            resizing.win.style.width = Math.max(300, resizing.startWidth + dx) + 'px';
        }
        if (resizing.direction.includes('s')) {
            resizing.win.style.height = Math.max(200, resizing.startHeight + dy) + 'px';
        }
    }

    function stopResize() {
        resizing = null;
        document.removeEventListener('mousemove', handleResize);
        document.removeEventListener('mouseup', stopResize);
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    function init() {
        // Attach behavior to all existing windows
        document.querySelectorAll('.window').forEach(attachWindowBehavior);
        setupWindowResize();
    }

})();
