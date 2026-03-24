/**
 * Menu VR - Frontend Application Logic
 * Handles form validations, error presentation (a11y), and UI toggles.
 */

document.addEventListener('DOMContentLoaded', () => {
    setupAccessibility();
    setupPasswordToggles();
    setupForms();
});



function setupAccessibility() {
    const btnA11y = document.querySelector('.btn-accessibility');
    if (btnA11y) {
        btnA11y.addEventListener('click', () => {
            // Placeholder for accessibility options (High Contrast, Larger Text, etc)
            console.log('Open Accessibility Menu');
        });
    }
}

function setupPasswordToggles() {
    const toggleBtns = document.querySelectorAll('.btn-toggle-password');
    
    toggleBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const inputGroup = e.currentTarget.closest('.form-control');
            const input = inputGroup.querySelector('input');
            const iconPath = e.currentTarget.querySelector('path');
            const iconSvg = e.currentTarget.querySelector('svg');

            if (input.type === 'password') {
                input.type = 'text';
                // Change icon to Eye-Off (strikethrough)
                iconSvg.innerHTML = `
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                    <line x1="1" y1="1" x2="23" y2="23"></line>
                `;
                btn.setAttribute('aria-label', 'Esconder senha');
            } else {
                input.type = 'password';
                // Change icon back to Eye
                iconSvg.innerHTML = `
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                `;
                btn.setAttribute('aria-label', 'Mostrar senha');
            }
        });
    });
}

function setupInputMasks() {
    const contatoInputs = document.querySelectorAll('input[name="contato"]');
    contatoInputs.forEach(input => {
        input.addEventListener('input', (e) => {
            let val = e.target.value.replace(/\D/g, ''); // Remove apenas letras e símbolos
            if (val.length > 11) val = val.slice(0, 11); // Máx 11 dígitos
            
            let formatted = val;
            if (val.length > 2) {
                formatted = `(${val.slice(0,2)}) ` + val.slice(2);
            }
            if (val.length > 7) {
                formatted = `(${val.slice(0,2)}) ${val.slice(2,7)}-${val.slice(7)}`;
            }
            e.target.value = formatted;
        });
    });
}

/**
 * Setup validation for all forms
 */
function setupForms() {
    setupInputMasks();

    // Controle para Labels "Onda" que desaparecem ao focar/digitar e Validação ao Vivo
    const allInputs = document.querySelectorAll('.form-control input');
    allInputs.forEach(input => {
        const form = input.closest('form');
        const checkValAndValidate = () => {
            if (input.value !== '') {
                input.classList.add('has-val');
                // Validação ao vivo apenas se houver valor
                const errorObj = validateInput(input, form);
                const wrapper = input.closest('.form-control');
                if (errorObj.valid) {
                    wrapper.classList.remove('error');
                    wrapper.classList.add('valid');
                    clearError(input);
                } else {
                    wrapper.classList.remove('valid');
                    showError(input, errorObj.message);
                }
            } else {
                input.classList.remove('has-val');
                const wrapper = input.closest('.form-control');
                wrapper.classList.remove('valid');
                // Se for obrigatório e ficou vazio, remove valid mas não limpa error se já estava validando full. 
                // Optamos por limpar tudo para evitar vermelhos excessivos em campo que de delete backspace até o fim
                clearError(input);
            }
        };
        input.addEventListener('input', checkValAndValidate);
        input.addEventListener('change', checkValAndValidate);
        
        // Verificaçāo passiva inicial de label onda
        if (input.value !== '') input.classList.add('has-val');
    });

    const forms = document.querySelectorAll('form[novalidate]');
    
    forms.forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            let isValid = true;
            let firstInvalidInput = null;

            // Clear all previous errors
            clearAllErrors(form);

            const inputs = form.querySelectorAll('input');
            
            inputs.forEach(input => {
                const errorObj = validateInput(input, form);
                if (!errorObj.valid) {
                    isValid = false;
                    showError(input, errorObj.message);
                    if (!firstInvalidInput) {
                        firstInvalidInput = input;
                    }
                }
            });

            // Specific form checks (like password match)
            if (form.id === 'new-password-form') {
                const pass = form.querySelector('#new-password');
                const confPass = form.querySelector('#confirm-password');
                if (pass && confPass && pass.value !== confPass.value && confPass.value !== '') {
                    isValid = false;
                    showError(confPass, 'As senhas não coincidem.');
                    if (!firstInvalidInput) firstInvalidInput = confPass;
                }
            }

            if (!isValid) {
                // Focus the first invalid element for accessibility
                if (firstInvalidInput) {
                    firstInvalidInput.focus();
                }
            } else {
                console.log('Form submitted successfully:', form.id);
                
                // Show confirmation message
                let message = 'Operação realizada com sucesso!';
                // Specific logic for Password Recovery Flow
                if (form.id === 'esqueci-senha-form') {
                    const emailInput = form.querySelector('#email').value;
                    // Generate 6-digit code
                    const recoveryCode = Math.floor(100000 + Math.random() * 900000).toString();
                    localStorage.setItem('recoveryCode', recoveryCode);
                    localStorage.setItem('recoveryEmail', emailInput);
                    
                    // EmailJS Sending Mock (Simulating standard EmailJS template send)
                    console.log('Enviando código', recoveryCode, 'para', emailInput);
                    // emailjs.send("SERVICE_ID", "TEMPLATE_ID", { code: recoveryCode, to_email: emailInput });
                    
                    message = 'Código de recuperação enviado para o seu e-mail.';
                } else if (form.id === 'codigo-form') {
                    const inputCode = form.querySelector('#codigo').value;
                    const savedCode = localStorage.getItem('recoveryCode');
                    
                    if (inputCode !== savedCode) {
                        showError(form.querySelector('#codigo'), 'Código inválido. Tente novamente.');
                        form.querySelector('#codigo').closest('.form-control').classList.add('error');
                        form.querySelector('#codigo').closest('.form-control').classList.remove('valid');
                        return; // Block success
                    }
                    message = 'Código verificado com sucesso.';
                } else if (form.id === 'cadastro-cliente-form' || form.id === 'cadastro-funcionario-form') {
                    message = 'Cadastro realizado com sucesso!';
                } else if (form.id === 'new-password-form') {
                    message = 'Sua senha foi redefinida com sucesso.';
                } else if (form.id === 'admin-login-form' || form.id === 'client-login-form') {
                    message = 'Login realizado com sucesso. Bem-vindo!';
                }

                showToast(message);

                // Delay redirection to allow user to see the message
                setTimeout(() => {
                    if (form.id === 'esqueci-senha-form') window.location.href = 'codigo-confirmacao.html';
                    else if (form.id === 'codigo-form') window.location.href = 'nova-senha.html';
                    else if (form.id === 'new-password-form' || form.id === 'cadastro-cliente-form' || form.id === 'cadastro-funcionario-form') window.location.href = 'index.html';
                }, 2000);
            }
        });
    });
}

function showToast(message) {
    let container = document.querySelector('.toast-container');
    if (!container) {
        container = document.createElement('div');
        container.className = 'toast-container';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
        <div class="toast-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
        </div>
        <div class="toast-message">${message}</div>
    `;

    container.appendChild(toast);

    // Force reflow for transition
    toast.offsetHeight;
    toast.classList.add('show');

    // Remove after 4 seconds
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}

function clearError(input) {
    const wrapper = input.closest('.form-control');
    if (wrapper) wrapper.classList.remove('error');
    
    const ariaDesc = input.getAttribute('aria-describedby');
    if (ariaDesc) {
        const errorEl = document.getElementById(ariaDesc);
        if (errorEl) errorEl.textContent = '';
    }
}

function clearAllErrors(form) {
    const inputs = form.querySelectorAll('input');
    inputs.forEach(input => clearError(input));
}

function showError(input, message) {
    const wrapper = input.closest('.form-control');
    if (wrapper) wrapper.classList.add('error');

    const ariaDesc = input.getAttribute('aria-describedby');
    if (ariaDesc) {
        const errorEl = document.getElementById(ariaDesc);
        if (errorEl) errorEl.textContent = message;
    }
}

/**
 * Validates individual inputs based on types and requirements
 */
function validateInput(input, form) {
    const val = input.value.trim();
    
    // 1. Required field check
    if (input.hasAttribute('required') && val === '') {
        // Specific messages based on input name/types
        const name = input.name || 'Campo';
        const formattedName = name.charAt(0).toUpperCase() + name.slice(1);
        return { valid: false, message: `${formattedName} é obrigatório.` };
    }

    // 2. Format checks (only if not empty)
    if (val !== '') {
        // Email pattern
        if (input.type === 'email' || input.name === 'email') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(val)) {
                return { valid: false, message: 'Digite um e-mail válido (ex: user@dominio.com).' };
            }
        }
        
        // Price validation (for other screens, added per instructions)
        if (input.name === 'preco' || input.name === 'price') {
            const priceRegex = /^\d+\.\d{2}$/;
            if (!priceRegex.test(val) || parseFloat(val) < 0) {
                return { valid: false, message: 'Preço deve ser positivo com duas casas decimais (ex: 15.99).' };
            }
        }

        // Strict Password validation
        if (input.type === 'password' || input.name === 'password' || input.name === 'new-password') {
            const hasMinLen = val.length >= 8;
            const hasUpper = /[A-Z]/.test(val);
            const hasLower = /[a-z]/.test(val);
            const hasNumber = /\d/.test(val);
            const hasSpecial = /[@$!%*?&]/.test(val);

            if (!hasMinLen) return { valid: false, message: 'Mínimo de 8 caracteres.' };
            if (!hasUpper || !hasLower) return { valid: false, message: 'Use letras maiúsculas e minúsculas.' };
            if (!hasNumber) return { valid: false, message: 'Inclua pelo menos um número.' };
            if (!hasSpecial) return { valid: false, message: 'Use um caractere especial (ex: !@#$).' };
        }
    }

    return { valid: true, message: '' };
}
