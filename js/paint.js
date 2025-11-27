(function() {
    'use strict';

    let canvas, ctx;
    let isDrawing = false;
    let currentTool = 'pencil';
    let currentColor = '#000000';
    let startX, startY;
    let snapshot;

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
        
        // Clear button
        document.getElementById('paint-clear').addEventListener('click', () => {
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        });
    };

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
        } else if (currentTool === 'circle') {
            ctx.putImageData(snapshot, 0, 0);
            ctx.beginPath();
            let radius = Math.sqrt(Math.pow((x - startX), 2) + Math.pow((y - startY), 2));
            ctx.arc(startX, startY, radius, 0, 2 * Math.PI);
            ctx.stroke();
        }
    }

    function stopDrawing() {
        isDrawing = false;
        ctx.closePath();
    }

    // Initialize if window is present
    if (document.getElementById('paint')) {
        window.initPaint();
    }
})();
