(function() {
    'use strict';

    // Global menu state
    let activeMenu = null;

    // Initialize menus
    function initMenus() {
        // Close menus when clicking outside
        document.addEventListener('click', function(e) {
            if (!e.target.closest('.menu-item') && !e.target.closest('.dropdown-menu')) {
                closeAllMenus();
            }
        });

        // Handle menu item clicks
        document.querySelectorAll('.menu-item').forEach(item => {
            item.addEventListener('click', function(e) {
                e.stopPropagation();
                const menuId = this.dataset.menu;
                
                // If clicking the already active menu, close it
                if (activeMenu === menuId) {
                    closeAllMenus();
                    return;
                }

                // Close other menus
                closeAllMenus();

                // Open this menu
                if (menuId) {
                    const menu = document.getElementById(menuId + '-menu');
                    if (menu) {
                        // Position the menu
                        const rect = this.getBoundingClientRect();
                        const windowRect = this.closest('.window').getBoundingClientRect();
                        
                        // Calculate relative position
                        menu.style.top = (this.offsetTop + this.offsetHeight) + 'px';
                        menu.style.left = this.offsetLeft + 'px';
                        menu.style.display = 'block';
                        
                        this.classList.add('active');
                        activeMenu = menuId;
                    }
                }
            });

            // Handle hover when a menu is already open (classic Windows behavior)
            item.addEventListener('mouseenter', function() {
                if (activeMenu && activeMenu !== this.dataset.menu) {
                    // Simulate click to switch menus
                    this.click();
                }
            });
        });

        // Handle dropdown item clicks
        document.querySelectorAll('.dropdown-item').forEach(item => {
            item.addEventListener('click', function(e) {
                // Close menu after selection
                closeAllMenus();
                
                // If item has no onclick handler, it might be a placeholder
                if (!this.onclick && !this.getAttribute('onclick')) {
                    // Optional: Show "Not implemented" for items without handlers
                    // console.log('Menu item clicked:', this.textContent.trim());
                }
            });
        });
    }

    function closeAllMenus() {
        document.querySelectorAll('.dropdown-menu').forEach(menu => {
            menu.style.display = 'none';
        });
        document.querySelectorAll('.menu-item').forEach(item => {
            item.classList.remove('active');
        });
        activeMenu = null;
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initMenus);
    } else {
        initMenus();
    }

    // Export for external use if needed
    window.closeAllMenus = closeAllMenus;

    window.showAlert = function(message) {
        alert(message);
    };

})();
