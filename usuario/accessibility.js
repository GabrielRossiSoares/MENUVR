/* ═══════════════════════════════════════════
   accessibility.js — Global Accessibility
   ═══════════════════════════════════════════ */

(() => {
    const STATE = {
        highContrast: localStorage.getItem('mvr_high_contrast') === 'true',
        textLarge: localStorage.getItem('mvr_text_large') === 'true'
    };

    function applyState() {
        if (STATE.highContrast) {
            document.body.classList.add('high-contrast');
        } else {
            document.body.classList.remove('high-contrast');
        }

        if (STATE.textLarge) {
            document.documentElement.classList.add('text-large');
        } else {
            document.documentElement.classList.remove('text-large');
        }

        updateWidgetUI();
    }

    function toggleHighContrast() {
        STATE.highContrast = !STATE.highContrast;
        localStorage.setItem('mvr_high_contrast', STATE.highContrast);
        applyState();
    }

    function toggleTextSize() {
        STATE.textLarge = !STATE.textLarge;
        localStorage.setItem('mvr_text_large', STATE.textLarge);
        applyState();
    }

    function updateWidgetUI() {
        const btnHc = document.getElementById('a11y-btn-hc');
        const btnTxt = document.getElementById('a11y-btn-txt');
        
        if (btnHc) {
            btnHc.classList.toggle('active', STATE.highContrast);
            btnHc.setAttribute('aria-pressed', STATE.highContrast);
        }
        if (btnTxt) {
            btnTxt.classList.toggle('active', STATE.textLarge);
            btnTxt.setAttribute('aria-pressed', STATE.textLarge);
        }
    }

    function injectWidget() {
        if (document.getElementById('a11y-widget')) return;

        const widgetHTML = `
            <div id="a11y-widget" class="a11y-widget" aria-label="Menu de Acessibilidade">
                <button type="button" id="a11y-toggle-menu" class="a11y-btn main-btn" aria-label="Abrir opções de acessibilidade" aria-expanded="false">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="12" cy="12" r="10"/>
                        <circle cx="12" cy="10" r="3"/>
                        <path d="M7 20.662V19a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1.662"/>
                    </svg>
                </button>
                <div id="a11y-menu" class="a11y-menu hidden">
                    <button type="button" id="a11y-btn-hc" class="a11y-option" aria-pressed="false">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <circle cx="12" cy="12" r="10"/>
                            <path d="M12 2a10 10 0 0 0 0 20z" fill="currentColor"/>
                        </svg>
                        Alto Contraste
                    </button>
                    <button type="button" id="a11y-btn-txt" class="a11y-option" aria-pressed="false">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <polyline points="4 7 4 4 20 4 20 7"/>
                            <line x1="9" y1="20" x2="15" y2="20"/>
                            <line x1="12" y1="4" x2="12" y2="20"/>
                        </svg>
                        Aumentar Fonte
                    </button>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', widgetHTML);

        // Events
        const mainBtn = document.getElementById('a11y-toggle-menu');
        const menu = document.getElementById('a11y-menu');
        const btnHc = document.getElementById('a11y-btn-hc');
        const btnTxt = document.getElementById('a11y-btn-txt');

        mainBtn.addEventListener('click', () => {
            const isHidden = menu.classList.contains('hidden');
            menu.classList.toggle('hidden');
            mainBtn.setAttribute('aria-expanded', !isHidden);
        });

        // Close when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('#a11y-widget')) {
                menu.classList.add('hidden');
                mainBtn.setAttribute('aria-expanded', 'false');
            }
        });

        btnHc.addEventListener('click', toggleHighContrast);
        btnTxt.addEventListener('click', toggleTextSize);
    }

    // Initialize
    document.addEventListener('DOMContentLoaded', () => {
        injectWidget();
        applyState();
    });
})();
