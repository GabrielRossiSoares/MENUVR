/* ═══════════════════════════════════════════
   burger-validate.js — utilitários de validação compartilhados
   ═══════════════════════════════════════════ */

const BurgerValidate = (() => {

    /* ── Regex ── */
    const RE_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    const RE_PHONE = /^\(?\d{2}\)?[\s\-]?(\d{4,5})[\s\-]?\d{4}$/;

    const SENHA_RULES = {
        len: v => v.length >= 8,
        upper: v => /[A-Z]/.test(v),
        lower: v => /[a-z]/.test(v),
        num: v => /[0-9]/.test(v),
        spec: v => /[^A-Za-z0-9]/.test(v),
    };

    const ICON_EYE_OPEN = `<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>`;
    const ICON_EYE_CLOSED = `<line x1="1" y1="1" x2="23" y2="23"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><path d="M1 12s4-8 11-8"/>`;

    /* ── Helpers de estado ── */
    function setWrap(wrap, state) {
        wrap.classList.remove('is-focus', 'is-valid', 'is-invalid');
        if (state) wrap.classList.add(state);
    }

    function showMsg(el, text, success = false) {
        if (!el) return;
        el.textContent = text;
        el.classList.toggle('success', success);
        el.classList.toggle('visible', !!text);
    }

    /* ── Validador: E-mail ── */
    function bindEmail(inputEl, wrapEl, msgEl, onState) {
        function validate(interactive) {
            const val = inputEl.value.trim();
            if (val === '') {
                setWrap(wrapEl, interactive ? 'is-focus' : null);
                showMsg(msgEl, '');
                onState(false);
            } else if (RE_EMAIL.test(val)) {
                setWrap(wrapEl, 'is-valid');
                showMsg(msgEl, '✓ E-mail válido', true);
                onState(true);
            } else {
                setWrap(wrapEl, 'is-invalid');
                showMsg(msgEl, '✗ E-mail inválido');
                onState(false);
            }
        }
        inputEl.addEventListener('focus', () => { if (!wrapEl.classList.contains('is-valid')) setWrap(wrapEl, 'is-focus'); });
        inputEl.addEventListener('input', () => validate(true));
        inputEl.addEventListener('blur', () => {
            if (!inputEl.value.trim()) { setWrap(wrapEl, null); showMsg(msgEl, ''); onState(false); }
            else validate(false);
        });
    }

    /* ── Validador: Senha (com hints) ── */
    function bindSenha(inputEl, wrapEl, msgEl, hintsContainerEl, hintsWrap, onState) {
        function validate(interactive) {
            const val = inputEl.value;
            if (val === '') {
                setWrap(wrapEl, interactive ? 'is-focus' : null);
                showMsg(msgEl, '');
                if (hintsContainerEl) hintsContainerEl.classList.remove('visible');
                onState(false); return;
            }
            if (hintsContainerEl) hintsContainerEl.classList.add('visible');
            let allOk = true;
            for (const [key, test] of Object.entries(SENHA_RULES)) {
                const ok = test(val);
                const el = document.getElementById('hint-' + key);
                if (el) { el.classList.toggle('ok', ok); el.classList.toggle('fail', !ok); }
                if (!ok) allOk = false;
            }
            if (allOk) {
                setWrap(wrapEl, 'is-valid');
                showMsg(msgEl, '✓ Senha forte', true);
                if (hintsContainerEl) hintsContainerEl.classList.remove('visible');
                onState(true);
            } else {
                setWrap(wrapEl, interactive ? 'is-focus' : 'is-invalid');
                showMsg(msgEl, '');
                onState(false);
            }
        }
        inputEl.addEventListener('focus', () => {
            if (!wrapEl.classList.contains('is-valid')) {
                setWrap(wrapEl, 'is-focus');
                if (hintsContainerEl && inputEl.value.length > 0) hintsContainerEl.classList.add('visible');
            }
        });
        inputEl.addEventListener('input', () => validate(true));
        inputEl.addEventListener('blur', () => {
            if (!inputEl.value) { setWrap(wrapEl, null); showMsg(msgEl, ''); if (hintsContainerEl) hintsContainerEl.classList.remove('visible'); onState(false); }
            else validate(false);
        });
    }

    /* ── Validador: Nome ── */
    function bindNome(inputEl, wrapEl, msgEl, onState) {
        function validate(interactive) {
            const val = inputEl.value.trim();
            if (val === '') {
                setWrap(wrapEl, interactive ? 'is-focus' : null);
                showMsg(msgEl, '');
                onState(false);
            } else if (val.length < 2) {
                setWrap(wrapEl, 'is-invalid');
                showMsg(msgEl, '✗ Nome muito curto');
                onState(false);
            } else if (!/^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/.test(val)) {
                setWrap(wrapEl, 'is-invalid');
                showMsg(msgEl, '✗ Apenas letras');
                onState(false);
            } else {
                setWrap(wrapEl, 'is-valid');
                showMsg(msgEl, '✓ Nome válido', true);
                onState(true);
            }
        }
        inputEl.addEventListener('focus', () => { if (!wrapEl.classList.contains('is-valid')) setWrap(wrapEl, 'is-focus'); });
        inputEl.addEventListener('input', () => validate(true));
        inputEl.addEventListener('blur', () => {
            if (!inputEl.value.trim()) { setWrap(wrapEl, null); showMsg(msgEl, ''); onState(false); }
            else validate(false);
        });
    }

    /* ── Validador: Contato/Telefone ── */
    function bindContato(inputEl, wrapEl, msgEl, onState) {
        /* Máscara automática */
        inputEl.addEventListener('input', () => {
            let v = inputEl.value.replace(/\D/g, '');
            if (v.length > 11) v = v.slice(0, 11);
            if (v.length <= 10)
                v = v.replace(/^(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
            else
                v = v.replace(/^(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
            inputEl.value = v;
        });

        function validate(interactive) {
            const raw = inputEl.value.replace(/\D/g, '');
            if (raw === '') {
                setWrap(wrapEl, interactive ? 'is-focus' : null);
                showMsg(msgEl, '');
                onState(false);
            } else if (raw.length < 10) {
                setWrap(wrapEl, 'is-invalid');
                showMsg(msgEl, '✗ Número incompleto');
                onState(false);
            } else {
                setWrap(wrapEl, 'is-valid');
                showMsg(msgEl, '✓ Contato válido', true);
                onState(true);
            }
        }
        inputEl.addEventListener('focus', () => { if (!wrapEl.classList.contains('is-valid')) setWrap(wrapEl, 'is-focus'); });
        inputEl.addEventListener('blur', () => {
            if (!inputEl.value.trim()) { setWrap(wrapEl, null); showMsg(msgEl, ''); onState(false); }
            else validate(false);
        });
        inputEl.addEventListener('input', () => validate(true));
    }

    /* ── Validador: Confirmar Senha ── */
    function bindConfirmarSenha(inputEl, wrapEl, msgEl, getSenhaRef, onState) {
        function validate(interactive) {
            const val = inputEl.value;
            const target = getSenhaRef();
            if (val === '') {
                setWrap(wrapEl, interactive ? 'is-focus' : null);
                showMsg(msgEl, '');
                onState(false);
            } else if (val === target) {
                setWrap(wrapEl, 'is-valid');
                showMsg(msgEl, '✓ Senhas conferem', true);
                onState(true);
            } else {
                setWrap(wrapEl, 'is-invalid');
                showMsg(msgEl, '✗ Senhas não conferem');
                onState(false);
            }
        }
        inputEl.addEventListener('focus', () => { if (!wrapEl.classList.contains('is-valid')) setWrap(wrapEl, 'is-focus'); });
        inputEl.addEventListener('input', () => validate(true));
        inputEl.addEventListener('blur', () => {
            if (!inputEl.value) { setWrap(wrapEl, null); showMsg(msgEl, ''); onState(false); }
            else validate(false);
        });
    }

    /* ── Validador: Código numérico ── */
    function bindCodigo(inputEl, wrapEl, msgEl, digits, onState) {
        inputEl.setAttribute('maxlength', digits);
        inputEl.addEventListener('input', () => {
            inputEl.value = inputEl.value.replace(/\D/g, '').slice(0, digits);
        });
        function validate(interactive) {
            const val = inputEl.value.replace(/\D/g, '');
            if (val === '') {
                setWrap(wrapEl, interactive ? 'is-focus' : null);
                showMsg(msgEl, '');
                onState(false);
            } else if (val.length < digits) {
                setWrap(wrapEl, 'is-invalid');
                showMsg(msgEl, `✗ Informe ${digits} dígitos`);
                onState(false);
            } else {
                setWrap(wrapEl, 'is-valid');
                showMsg(msgEl, '✓ Código válido', true);
                onState(true);
            }
        }
        inputEl.addEventListener('focus', () => { if (!wrapEl.classList.contains('is-valid')) setWrap(wrapEl, 'is-focus'); });
        inputEl.addEventListener('input', () => validate(true));
        inputEl.addEventListener('blur', () => {
            if (!inputEl.value) { setWrap(wrapEl, null); showMsg(msgEl, ''); onState(false); }
            else validate(false);
        });
    }

    /* ── Toggle olho ── */
    function bindEye(btnEl, inputEl, svgEl) {
        btnEl.addEventListener('click', () => {
            const show = inputEl.type === 'password';
            inputEl.type = show ? 'text' : 'password';
            if (svgEl) svgEl.innerHTML = show ? ICON_EYE_CLOSED : ICON_EYE_OPEN;
        });
    }

    /* ── Botão habilitado por estados ── */
    function bindBtn(btnEl, statesObj) {
        function update() {
            const ok = Object.values(statesObj).every(Boolean);
            btnEl.disabled = !ok;
            btnEl.classList.toggle('enabled', ok);
        }
        return update;
    }

    /* ── Modal ── */
    function openModal(backdropEl) {
        backdropEl.classList.add('show');
        document.body.style.overflow = 'hidden';
    }
    function closeModal(backdropEl) {
        backdropEl.classList.remove('show');
        document.body.style.overflow = '';
    }
    function bindModal(backdropEl, okBtnEl, redirectUrl) {
        if (okBtnEl) okBtnEl.addEventListener('click', () => {
            closeModal(backdropEl);
            if (redirectUrl) window.location.href = redirectUrl;
        });
        backdropEl.addEventListener('click', e => {
            if (e.target === backdropEl) closeModal(backdropEl);
        });
        document.addEventListener('keydown', e => {
            if (e.key === 'Escape' && backdropEl.classList.contains('show')) closeModal(backdropEl);
        });
    }

    /* ── Raios SVG ── */
    const RAYS_SVG = `<svg class="light-rays" viewBox="0 0 900 900" xmlns="http://www.w3.org/2000/svg">
<g stroke="#ffffff" stroke-opacity="0.08" stroke-width="0.5" fill="none">
<line x1="450" y1="450" x2="0" y2="0"/><line x1="450" y1="450" x2="150" y2="0"/>
<line x1="450" y1="450" x2="300" y2="0"/><line x1="450" y1="450" x2="450" y2="0"/>
<line x1="450" y1="450" x2="600" y2="0"/><line x1="450" y1="450" x2="750" y2="0"/>
<line x1="450" y1="450" x2="900" y2="0"/><line x1="450" y1="450" x2="900" y2="150"/>
<line x1="450" y1="450" x2="900" y2="300"/><line x1="450" y1="450" x2="900" y2="450"/>
<line x1="450" y1="450" x2="900" y2="600"/><line x1="450" y1="450" x2="900" y2="750"/>
<line x1="450" y1="450" x2="900" y2="900"/><line x1="450" y1="450" x2="750" y2="900"/>
<line x1="450" y1="450" x2="600" y2="900"/><line x1="450" y1="450" x2="450" y2="900"/>
<line x1="450" y1="450" x2="300" y2="900"/><line x1="450" y1="450" x2="150" y2="900"/>
<line x1="450" y1="450" x2="0" y2="900"/><line x1="450" y1="450" x2="0" y2="750"/>
<line x1="450" y1="450" x2="0" y2="600"/><line x1="450" y1="450" x2="0" y2="450"/>
<line x1="450" y1="450" x2="0" y2="300"/><line x1="450" y1="450" x2="0" y2="150"/>
</g></svg>`;

    return { bindEmail, bindSenha, bindNome, bindContato, bindConfirmarSenha, bindCodigo, bindEye, bindBtn, openModal, closeModal, bindModal, setWrap, showMsg, RAYS_SVG };
})();