(function() {
    'use strict';

    window.initMyComputer = function() {
        const content = document.getElementById('mycomputer-content');
        if (!content) return;

        // Gather System Info
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || (window.innerWidth <= 768);
        const platform = navigator.platform;
        const userAgent = navigator.userAgent;
        const screenRes = `${window.screen.width} x ${window.screen.height}`;
        const browser = getBrowserName();

        content.innerHTML = `
            <div style="display: flex; padding: 10px; gap: 20px;">
                <div style="text-align: center;">
                    <img src="https://win98icons.alexmeub.com/icons/png/computer_explorer-4.png" style="width: 48px; height: 48px;">
                </div>
                <div style="flex: 1;">
                    <h3 style="margin-top: 0;">System Information</h3>
                    <div style="background: #fff; border: 2px inset #fff; padding: 10px; font-family: 'MS Sans Serif', sans-serif; font-size: 12px;">
                        <p><strong>Device Type:</strong> ${isMobile ? 'Mobile Device' : 'Desktop Computer'}</p>
                        <p><strong>Operating System:</strong> ${platform}</p>
                        <p><strong>Browser:</strong> ${browser}</p>
                        <p><strong>Screen Resolution:</strong> ${screenRes}</p>
                        <p><strong>User Agent:</strong></p>
                        <div style="background: #efefef; padding: 5px; border: 1px solid #ccc; margin-top: 5px; word-break: break-all;">
                            ${userAgent}
                        </div>
                    </div>
                    <br>
                    <h3 style="margin-top: 0;">Performance</h3>
                    <div style="background: #fff; border: 2px inset #fff; padding: 10px; font-family: 'MS Sans Serif', sans-serif; font-size: 12px;">
                        <p><strong>Memory:</strong> ${navigator.deviceMemory ? navigator.deviceMemory + ' GB' : 'Unknown'}</p>
                        <p><strong>Cores:</strong> ${navigator.hardwareConcurrency || 'Unknown'}</p>
                    </div>
                </div>
            </div>
        `;
    };

    function getBrowserName() {
        const agent = navigator.userAgent.toLowerCase();
        if (agent.indexOf('edge') > -1) return 'Microsoft Edge';
        if (agent.indexOf('opr') > -1) return 'Opera';
        if (agent.indexOf('chrome') > -1) return 'Google Chrome';
        if (agent.indexOf('firefox') > -1) return 'Mozilla Firefox';
        if (agent.indexOf('safari') > -1) return 'Safari';
        return 'Unknown';
    }

    // Initialize if window is present (though usually called by windows.js)
    if (document.getElementById('mycomputer')) {
        window.initMyComputer();
    }
})();
