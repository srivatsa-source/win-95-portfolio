// Minesweeper game functionality
(function() {
    'use strict';

    // Global game state
    let msRows = 10, msCols = 10, msMines = 10;
    let msBoard = [];
    let msFirstClick = true;
    let msTimer = null;
    let msTime = 0;

    // Level configurations
    function getLevelConfig() {
        const level = document.getElementById('msLevel');
        const value = level ? level.value : 'easy';
        if (value === 'easy') return { rows: 9, cols: 9, mines: 10 };
        if (value === 'medium') return { rows: 16, cols: 16, mines: 40 };
        return { rows: 16, cols: 30, mines: 99 };
    }

    function initializeMinesweeper() {
        const grid = document.getElementById('mineGrid');
        if (!grid) return;
        
        const cfg = getLevelConfig();
        msRows = cfg.rows;
        msCols = cfg.cols;
        msMines = cfg.mines;
        
        msBoard = new Array(msRows * msCols).fill(null).map(() => ({
            mine: false,
            adj: 0,
            revealed: false,
            flagged: false
        }));
        
        msFirstClick = true;
        msTime = 0;
        clearInterval(msTimer);
        msTimer = null;
        
        grid.innerHTML = '';
        grid.style.gridTemplateColumns = `repeat(${msCols}, 25px)`;
        grid.style.width = (msCols * 25 + (msCols - 1)) + 'px';
        
        for (let i = 0; i < msRows * msCols; i++) {
            const cell = document.createElement('div');
            cell.className = 'mine-cell';
            cell.dataset.index = i;
            cell.addEventListener('click', onMsLeftClick);
            cell.addEventListener('contextmenu', onMsRightClick);
            grid.appendChild(cell);
        }
        
        updateMsCounter();
        updateMsTimeDisplay();
        
        const statusEl = document.getElementById('msStatus');
        if (statusEl) {
            statusEl.textContent = `Mines: ${String(msMines).padStart(2, '0')} | Size: ${msCols}x${msRows}`;
        }
    }

    function onMsLeftClick(e) {
        const idx = Number(this.dataset.index);
        if (msBoard[idx].flagged || msBoard[idx].revealed) return;
        
        if (msFirstClick) {
            placeMines(idx);
            calculateAdjacents();
            msFirstClick = false;
            startMsTimer();
        }
        
        revealCell(idx);
        checkWinCondition();
    }

    function onMsRightClick(e) {
        e.preventDefault();
        const idx = Number(this.dataset.index);
        if (msBoard[idx].revealed) return;
        
        msBoard[idx].flagged = !msBoard[idx].flagged;
        const el = document.querySelector(`.mine-cell[data-index='${idx}']`);
        
        if (msBoard[idx].flagged) {
            el.classList.add('flagged');
            el.textContent = '🚩';
        } else {
            el.classList.remove('flagged');
            el.textContent = '';
        }
        
        updateMsCounter();
        checkWinCondition();
    }

    function placeMines(firstIdx) {
        // Place msMines mines randomly, avoiding firstIdx and neighbors
        const forbidden = new Set([firstIdx]);
        const r = Math.floor(firstIdx / msCols);
        const c = firstIdx % msCols;
        
        for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
                const nr = r + dr;
                const nc = c + dc;
                if (nr < 0 || nr >= msRows || nc < 0 || nc >= msCols) continue;
                forbidden.add(nr * msCols + nc);
            }
        }
        
        let placed = 0;
        while (placed < msMines) {
            const i = Math.floor(Math.random() * msRows * msCols);
            if (forbidden.has(i) || msBoard[i].mine) continue;
            msBoard[i].mine = true;
            placed++;
        }
    }

    function calculateAdjacents() {
        for (let i = 0; i < msBoard.length; i++) {
            if (msBoard[i].mine) {
                msBoard[i].adj = -1;
                continue;
            }
            
            const r = Math.floor(i / msCols);
            const c = i % msCols;
            let cnt = 0;
            
            for (let dr = -1; dr <= 1; dr++) {
                for (let dc = -1; dc <= 1; dc++) {
                    if (dr === 0 && dc === 0) continue;
                    const nr = r + dr;
                    const nc = c + dc;
                    if (nr < 0 || nr >= msRows || nc < 0 || nc >= msCols) continue;
                    if (msBoard[nr * msCols + nc].mine) cnt++;
                }
            }
            
            msBoard[i].adj = cnt;
        }
    }

    function revealCell(idx) {
        if (msBoard[idx].revealed || msBoard[idx].flagged) return;
        
        const el = document.querySelector(`.mine-cell[data-index='${idx}']`);
        msBoard[idx].revealed = true;
        el.classList.add('revealed');
        
        if (msBoard[idx].mine) {
            el.classList.add('mine');
            el.textContent = '💣';
            endMsGame(false);
            return;
        }
        
        if (msBoard[idx].adj > 0) {
            el.textContent = msBoard[idx].adj;
            el.setAttribute('data-adjacent', msBoard[idx].adj);
        } else {
            el.textContent = '';
        }
        
        // If zero, flood fill neighbors
        if (msBoard[idx].adj === 0) {
            const stack = [idx];
            while (stack.length) {
                const cur = stack.pop();
                const r = Math.floor(cur / msCols);
                const c = cur % msCols;
                
                for (let dr = -1; dr <= 1; dr++) {
                    for (let dc = -1; dc <= 1; dc++) {
                        const nr = r + dr;
                        const nc = c + dc;
                        if (nr < 0 || nr >= msRows || nc < 0 || nc >= msCols) continue;
                        
                        const ni = nr * msCols + nc;
                        if (!msBoard[ni].revealed && !msBoard[ni].flagged) {
                            msBoard[ni].revealed = true;
                            const neiEl = document.querySelector(`.mine-cell[data-index='${ni}']`);
                            neiEl.classList.add('revealed');
                            
                            if (msBoard[ni].adj > 0) {
                                neiEl.textContent = msBoard[ni].adj;
                                neiEl.setAttribute('data-adjacent', msBoard[ni].adj);
                            } else {
                                neiEl.textContent = '';
                                stack.push(ni);
                            }
                        }
                    }
                }
            }
        }
    }

    function updateMsCounter() {
        const flagged = msBoard.filter(c => c.flagged).length;
        const remaining = Math.max(0, msMines - flagged);
        const counterEl = document.getElementById('mineCounter');
        if (counterEl) {
            counterEl.textContent = String(remaining).padStart(3, '0');
        }
    }

    function startMsTimer() {
        if (msTimer) return;
        msTimer = setInterval(() => {
            msTime++;
            updateMsTimeDisplay();
        }, 1000);
    }

    function stopMsTimer() {
        if (msTimer) {
            clearInterval(msTimer);
            msTimer = null;
        }
    }

    function updateMsTimeDisplay() {
        const timeEl = document.getElementById('gameTime');
        if (timeEl) {
            timeEl.textContent = String(msTime).padStart(3, '0');
        }
    }

    function endMsGame(won) {
        stopMsTimer();
        
        if (!won) {
            // Reveal all mines
            msBoard.forEach((c, i) => {
                if (c.mine) {
                    const el = document.querySelector(`.mine-cell[data-index='${i}']`);
                    if (el) {
                        el.classList.add('revealed', 'mine');
                        el.textContent = '💣';
                    }
                }
            });
            
            if (window.showAlert) {
                window.showAlert('Game Over! You hit a mine.');
            }
        } else {
            if (window.showAlert) {
                window.showAlert('Congratulations! You cleared the minefield.');
            }
        }
    }

    function checkWinCondition() {
        const total = msRows * msCols;
        const revealed = msBoard.filter(c => c.revealed).length;
        
        if (revealed === total - msMines) {
            stopMsTimer();
            endMsGame(true);
        }
    }

    window.resetGame = function() {
        initializeMinesweeper();
    };

    // Initialize controls and game
    function initializeControls() {
        // Level selector change handler
        const levelSelect = document.getElementById('msLevel');
        if (levelSelect) {
            levelSelect.addEventListener('change', initializeMinesweeper);
        }

        // Fullscreen button handler
        const fullscreenBtn = document.getElementById('msFullscreenBtn');
        if (fullscreenBtn) {
            fullscreenBtn.addEventListener('click', () => {
                if (window.toggleMaximize) {
                    window.toggleMaximize('minesweeper');
                }
            });
        }

        // Initialize the game
        initializeMinesweeper();
    }

    // Initialize on load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeControls);
    } else {
        initializeControls();
    }

})();
