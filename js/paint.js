(function() {
    'use strict';

    let canvas, ctx;
    let isDrawing = false;
    let currentTool = 'pencil';
    let currentColor = '#000000';
    let startX, startY;
    let snapshot;
    let history = [];
    let historyIndex = -1;

    window.initPaint = function() {
        canvas = document.getElementById('paintCanvas');
        if (!canvas) return;
        
        ctx = canvas.getContext('2d');
        
        // Set canvas size
        canvas.width = 500;
        canvas.height = 350;
        
        // White background
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Save initial state
        saveToHistory();

        // Event listeners
        canvas.addEventListener('mousedown', startDrawing);
        canvas.addEventListener('mousemove', draw);
        canvas.addEventListener('mouseup', stopDrawing);
        canvas.addEventListener('mouseout', stopDrawing);

        // Tools
        document.querySelectorAll('.paint-tool').forEach(tool => {
            tool.addEventListener('click', (e) => {
                document.querySelectorAll('.paint-tool').forEach(t => t.classList.remove('active'));
                e.currentTarget.classList.add('active');
                currentTool = e.currentTarget.dataset.tool;
            });
        });

        // Colors
        document.querySelectorAll('.color-box').forEach(box => {
            box.addEventListener('click', (e) => {
                document.querySelectorAll('.color-box').forEach(b => b.classList.remove('active'));
                e.currentTarget.classList.add('active');
                currentColor = e.currentTarget.dataset.color;
            });
        });
        
        // Clear button (if exists)
        const clearBtn = document.getElementById('paint-clear');
        if (clearBtn) {
            clearBtn.addEventListener('click', clearCanvas);
        }
        
        // Setup menu actions
        setupPaintMenus();
    };
    
    // History functions for Undo
    function saveToHistory() {
        // Remove any future states if we're not at the end
        history = history.slice(0, historyIndex + 1);
        // Save current canvas state
        history.push(canvas.toDataURL());
        historyIndex = history.length - 1;
        // Limit history size
        if (history.length > 20) {
            history.shift();
            historyIndex--;
        }
    }
    
    function undo() {
        if (historyIndex > 0) {
            historyIndex--;
            loadFromHistory();
        }
    }
    
    function redo() {
        if (historyIndex < history.length - 1) {
            historyIndex++;
            loadFromHistory();
        }
    }
    
    function loadFromHistory() {
        const img = new Image();
        img.onload = function() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0);
        };
        img.src = history[historyIndex];
    }
    
    function clearCanvas() {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        saveToHistory();
    }
    
    function newCanvas() {
        window.showConfirm('Create a new image? Any unsaved changes will be lost.', 'Paint', () => {
            clearCanvas();
            history = [];
            historyIndex = -1;
            saveToHistory();
        });
    }
    
    function saveCanvas() {
        const link = document.createElement('a');
        link.download = 'my-painting.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
        window.showAlert('Image saved as "my-painting.png"!', 'Paint', 'success');
    }
    
    function invertColors() {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        for (let i = 0; i < data.length; i += 4) {
            data[i] = 255 - data[i];       // Red
            data[i + 1] = 255 - data[i + 1]; // Green
            data[i + 2] = 255 - data[i + 2]; // Blue
        }
        ctx.putImageData(imageData, 0, 0);
        saveToHistory();
    }
    
    function flipHorizontal() {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        ctx.save();
        ctx.scale(-1, 1);
        ctx.drawImage(canvas, -canvas.width, 0);
        ctx.restore();
        saveToHistory();
    }
    
    function flipVertical() {
        ctx.save();
        ctx.scale(1, -1);
        ctx.drawImage(canvas, 0, -canvas.height);
        ctx.restore();
        saveToHistory();
    }
    
    // Setup Paint menu actions
    function setupPaintMenus() {
        // File menu
        const paintFileMenu = document.getElementById('paint-file-menu');
        if (paintFileMenu) {
            paintFileMenu.innerHTML = `
                <div class="dropdown-item" id="paint-new">New &nbsp;&nbsp;&nbsp;&nbsp;Ctrl+N</div>
                <div class="dropdown-item" id="paint-save">Save &nbsp;&nbsp;&nbsp;&nbsp;Ctrl+S</div>
                <div class="dropdown-divider"></div>
                <div class="dropdown-item" id="paint-exit">Exit &nbsp;&nbsp;&nbsp;&nbsp;Alt+F4</div>
            `;
            
            document.getElementById('paint-new').addEventListener('click', () => {
                newCanvas();
                hideAllMenus();
            });
            document.getElementById('paint-save').addEventListener('click', () => {
                saveCanvas();
                hideAllMenus();
            });
            document.getElementById('paint-exit').addEventListener('click', () => {
                closeWindow('paint');
                hideAllMenus();
            });
        }
        
        // Edit menu
        const paintEditMenu = document.getElementById('paint-edit-menu');
        if (paintEditMenu) {
            paintEditMenu.innerHTML = `
                <div class="dropdown-item" id="paint-undo">Undo &nbsp;&nbsp;&nbsp;&nbsp;Ctrl+Z</div>
                <div class="dropdown-item" id="paint-redo">Redo &nbsp;&nbsp;&nbsp;&nbsp;Ctrl+Y</div>
                <div class="dropdown-divider"></div>
                <div class="dropdown-item" id="paint-clear-all">Clear All</div>
            `;
            
            document.getElementById('paint-undo').addEventListener('click', () => {
                undo();
                hideAllMenus();
            });
            document.getElementById('paint-redo').addEventListener('click', () => {
                redo();
                hideAllMenus();
            });
            document.getElementById('paint-clear-all').addEventListener('click', () => {
                clearCanvas();
                hideAllMenus();
            });
        }
        
        // Image menu
        const paintImageMenu = document.getElementById('paint-image-menu');
        if (paintImageMenu) {
            paintImageMenu.innerHTML = `
                <div class="dropdown-item" id="paint-flip-h">Flip Horizontal</div>
                <div class="dropdown-item" id="paint-flip-v">Flip Vertical</div>
                <div class="dropdown-divider"></div>
                <div class="dropdown-item" id="paint-invert">Invert Colors &nbsp;Ctrl+I</div>
                <div class="dropdown-item" id="paint-clear-image">Clear Image</div>
            `;
            
            document.getElementById('paint-flip-h').addEventListener('click', () => {
                flipHorizontal();
                hideAllMenus();
            });
            document.getElementById('paint-flip-v').addEventListener('click', () => {
                flipVertical();
                hideAllMenus();
            });
            document.getElementById('paint-invert').addEventListener('click', () => {
                invertColors();
                hideAllMenus();
            });
            document.getElementById('paint-clear-image').addEventListener('click', () => {
                clearCanvas();
                hideAllMenus();
            });
        }
        
        // Help menu
        const paintHelpMenu = document.getElementById('paint-help-menu');
        if (paintHelpMenu) {
            paintHelpMenu.innerHTML = `
                <div class="dropdown-item" id="paint-help-topics">Help Topics</div>
                <div class="dropdown-divider"></div>
                <div class="dropdown-item" id="paint-about">About Paint</div>
            `;
            
            document.getElementById('paint-help-topics').addEventListener('click', () => {
                window.showAlert('Paint Help:<br><br>• Click and drag to draw<br>• Select tools from the toolbar<br>• Pick colors from the palette<br>• Use Edit menu to Undo/Redo', 'Paint Help', 'info');
                hideAllMenus();
            });
            document.getElementById('paint-about').addEventListener('click', () => {
                window.showAlert('<strong>Paint</strong><br>Version 1.0<br><br>Windows 95 Portfolio Edition<br>Created by Srivatsa S.', 'About Paint', 'info');
                hideAllMenus();
            });
        }
    }
    
    function hideAllMenus() {
        document.querySelectorAll('.dropdown-menu').forEach(menu => {
            menu.style.display = 'none';
        });
    }

    function startDrawing(e) {
        isDrawing = true;
        ctx.beginPath();
        
        const rect = canvas.getBoundingClientRect();
        startX = e.clientX - rect.left;
        startY = e.clientY - rect.top;
        
        ctx.moveTo(startX, startY);
        snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
    }

    function draw(e) {
        if (!isDrawing) return;
        
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        ctx.strokeStyle = currentColor;
        ctx.fillStyle = currentColor;
        ctx.lineWidth = 2;

        if (currentTool === 'pencil') {
            ctx.lineTo(x, y);
            ctx.stroke();
        } else if (currentTool === 'brush') {
            ctx.lineWidth = 5;
            ctx.lineTo(x, y);
            ctx.stroke();
        } else if (currentTool === 'eraser') {
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 10;
            ctx.lineTo(x, y);
            ctx.stroke();
        } else if (currentTool === 'rect') {
            ctx.putImageData(snapshot, 0, 0);
            ctx.strokeRect(startX, startY, x - startX, y - startY);
        } else if (currentTool === 'circle' || currentTool === 'ellipse') {
            ctx.putImageData(snapshot, 0, 0);
            ctx.beginPath();
            let radius = Math.sqrt(Math.pow((x - startX), 2) + Math.pow((y - startY), 2));
            ctx.arc(startX, startY, radius, 0, 2 * Math.PI);
            ctx.stroke();
        } else if (currentTool === 'line') {
            ctx.putImageData(snapshot, 0, 0);
            ctx.beginPath();
            ctx.moveTo(startX, startY);
            ctx.lineTo(x, y);
            ctx.stroke();
        } else if (currentTool === 'fill') {
            // Simple fill - just fill the whole canvas for demo
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
    }

    function stopDrawing() {
        if (isDrawing) {
            isDrawing = false;
            ctx.closePath();
            saveToHistory();
        }
    }

    // Initialize if window is present
    if (document.getElementById('paint')) {
        window.initPaint();
    }
})();
