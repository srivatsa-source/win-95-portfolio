// Desktop icon management and context menu
(function() {
    'use strict';

    let isDragging = false;
    let currentDragIcon = null;
    let dragOffset = { x: 0, y: 0 };

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    function init() {
        setupDragAndDrop();
        setupDesktopContextMenu();
        setupDesktopClick();
    }

    // Desktop icon drag and drop
    function setupDragAndDrop() {
        const icons = document.querySelectorAll('.desktop-icon');
        
        icons.forEach(icon => {
            // Double-click to open window
            icon.addEventListener('dblclick', function(e) {
                if (isDragging) return;
                const windowId = this.dataset.window;
                if (typeof openWindow === 'function') {
                    openWindow(windowId);
                }
                if (windowId === 'skills' && typeof animateSkillBars === 'function') {
                    setTimeout(animateSkillBars, 300);
                }
            });

            // Touch tap to open on mobile (simpler than double-tap)
            let touchTimer = null;
            icon.addEventListener('touchend', function(e) {
                if (window.innerWidth <= 768) {
                    e.preventDefault();
                    const windowId = this.dataset.window;
                    if (typeof openWindow === 'function') {
                        openWindow(windowId);
                    }
                    if (windowId === 'skills' && typeof animateSkillBars === 'function') {
                        setTimeout(animateSkillBars, 300);
                    }
                }
            }, { passive: false });

            // Single click to select
            icon.addEventListener('click', function(e) {
                if (isDragging) return;
                e.stopPropagation();
                document.querySelectorAll('.desktop-icon').forEach(i => i.classList.remove('selected'));
                this.classList.add('selected');
            });

            // Mouse down - start drag (desktop only)
            icon.addEventListener('mousedown', function(e) {
                if (e.button !== 0) return;
                if (window.innerWidth <= 768) return; // Disable dragging on mobile
                
                isDragging = true;
                currentDragIcon = this;
                
                const rect = this.getBoundingClientRect();
                dragOffset.x = e.clientX - rect.left;
                dragOffset.y = e.clientY - rect.top;
                
                this.classList.add('dragging');
                document.body.style.userSelect = 'none';
                e.preventDefault();
            });
        });

        // Global mouse events for dragging
        document.addEventListener('mousemove', function(e) {
            if (!isDragging || !currentDragIcon) return;
            
            const newX = e.clientX - dragOffset.x;
            const newY = e.clientY - dragOffset.y;
            
            // Keep icons within desktop bounds
            const desktop = document.getElementById('desktop');
            const desktopRect = desktop.getBoundingClientRect();
            const iconRect = currentDragIcon.getBoundingClientRect();
            
            const maxX = desktopRect.width - iconRect.width;
            const maxY = desktopRect.height - iconRect.height - 40;
            
            const constrainedX = Math.max(0, Math.min(newX, maxX));
            const constrainedY = Math.max(0, Math.min(newY, maxY));
            
            currentDragIcon.style.left = constrainedX + 'px';
            currentDragIcon.style.top = constrainedY + 'px';
        });

        document.addEventListener('mouseup', function() {
            if (!isDragging) return;
            
            if (currentDragIcon) {
                // Snap to grid
                const gridX = 100;
                const gridY = 120;
                const x = parseFloat(currentDragIcon.style.left);
                const y = parseFloat(currentDragIcon.style.top);

                const snappedX = Math.round(x / gridX) * gridX + 20;
                const snappedY = Math.round(y / gridY) * gridY + 20;
                
                // Check bounds again
                const desktop = document.getElementById('desktop');
                const desktopRect = desktop.getBoundingClientRect();
                const iconRect = currentDragIcon.getBoundingClientRect();
                const maxX = desktopRect.width - iconRect.width;
                const maxY = desktopRect.height - iconRect.height - 40;

                currentDragIcon.style.left = Math.max(0, Math.min(snappedX, maxX)) + 'px';
                currentDragIcon.style.top = Math.max(0, Math.min(snappedY, maxY)) + 'px';

                currentDragIcon.classList.remove('dragging');
                currentDragIcon = null;
            }
            
            isDragging = false;
            document.body.style.userSelect = '';
        });
    }

    // Desktop context menu
    function setupDesktopContextMenu() {
        const desktop = document.getElementById('desktop');
        const contextMenu = document.getElementById('contextMenu');
        if (!desktop || !contextMenu) return;

        let lastIconTarget = null;

        desktop.addEventListener('contextmenu', function(e) {
            e.preventDefault();
            const icon = e.target.closest('.desktop-icon');
            const win = e.target.closest('.window');
            
            contextMenu.innerHTML = '';
            
            if (icon) {
                // Icon-specific context menu
                lastIconTarget = icon;
                
                const openItem = createMenuItem('Open', () => {
                    if (typeof openWindow === 'function') {
                        openWindow(lastIconTarget.dataset.window);
                    }
                    contextMenu.style.display = 'none';
                });
                
                const propsItem = createMenuItem('Properties', () => {
                    const iconName = lastIconTarget.querySelector('.icon-text')?.textContent || 'Item';
                    if (typeof showAlert === 'function') {
                        showAlert('Properties for ' + iconName);
                    }
                    contextMenu.style.display = 'none';
                });
                
                contextMenu.appendChild(openItem);
                contextMenu.appendChild(propsItem);
            } else if (!win) {
                // Desktop context menu
                const refreshItem = createMenuItem('Refresh', () => {
                    arrangeIcons();
                    contextMenu.style.display = 'none';
                });
                
                const newFolderItem = createMenuItem('New Folder', () => {
                    if (typeof showAlert === 'function') {
                        showAlert('New Folder');
                    }
                    contextMenu.style.display = 'none';
                });
                
                const propsItem = createMenuItem('Properties', () => {
                    if (typeof showAlert === 'function') {
                        showAlert('Desktop Properties');
                    }
                    contextMenu.style.display = 'none';
                });
                
                const arrangeItem = createMenuItem('Arrange Icons', () => {
                    arrangeIcons();
                    contextMenu.style.display = 'none';
                });
                
                contextMenu.appendChild(refreshItem);
                contextMenu.appendChild(newFolderItem);
                contextMenu.appendChild(propsItem);
                contextMenu.appendChild(arrangeItem);
            }

            contextMenu.style.left = e.clientX + 'px';
            contextMenu.style.top = e.clientY + 'px';
            contextMenu.style.display = 'block';
        });

        // Hide context menu when clicking elsewhere
        document.addEventListener('click', function(e) {
            if (!contextMenu.contains(e.target)) {
                contextMenu.style.display = 'none';
            }
        });
    }

    function createMenuItem(text, onClick) {
        const item = document.createElement('div');
        item.className = 'context-menu-item';
        item.textContent = text;
        item.addEventListener('click', onClick);
        return item;
    }

    // Arrange icons in grid
    window.arrangeIcons = function() {
        const icons = document.querySelectorAll('.desktop-icon');
        let x = 20, y = 20;
        const spacing = 120;
        
        icons.forEach((icon, index) => {
            icon.style.left = x + 'px';
            icon.style.top = y + 'px';
            
            y += spacing;
            if (y > window.innerHeight - 200) {
                y = 20;
                x += 100;
            }
        });
        
        const contextMenu = document.getElementById('contextMenu');
        if (contextMenu) {
            contextMenu.style.display = 'none';
        }
    };

    // Deselect icons when clicking on desktop
    function setupDesktopClick() {
        const desktop = document.getElementById('desktop');
        if (!desktop) return;
        
        desktop.addEventListener('click', function(e) {
            if (e.target === desktop) {
                document.querySelectorAll('.desktop-icon').forEach(icon => {
                    icon.classList.remove('selected');
                });
            }
        });
    }

})();
