/* ═══════════════════════════════════════════
   admin.js — CRUD logic (localStorage)
   ═══════════════════════════════════════════ */

const AdminStore = (() => {
    const KEYS = { produtos: 'menuvr_produtos', categorias: 'menuvr_categorias', usuarios: 'menuvr_usuarios', tema: 'menuvr_admin_tema' };

    /* ── Seed data (first visit) ── */
    const SEED_USUARIOS = [
        { id: 1, nome: 'Admin Principal', email: 'admin@menuvr.com', papel: 'admin', ativo: true, criado_em: '2026-01-01T10:00:00' }
    ];

    const SEED_CATEGORIAS = [
        { id: 1, nome: 'Hambúrgueres', descricao: 'Burgers artesanais e smash', ativo: true, criado_em: '2026-01-15T10:00:00' },
        { id: 2, nome: 'Bebidas', descricao: 'Refrigerantes, sucos e shakes', ativo: true, criado_em: '2026-01-15T10:00:00' },
        { id: 3, nome: 'Acompanhamentos', descricao: 'Batatas, onion rings e porções', ativo: true, criado_em: '2026-01-15T10:00:00' },
        { id: 4, nome: 'Sobremesas', descricao: 'Doces e sorvetes', ativo: false, criado_em: '2026-01-15T10:00:00' },
    ];

    const SEED_PRODUTOS = [
        { id: 1, categoria_id: 1, nome: 'Smash Burger Clássico', descricao: 'Pão brioche, blend bovino 150g, queijo cheddar, cebola caramelizada e molho especial.', preco: 28.90, imagem_url: '', modelo3d_url: '', possui_modelo3d: false, ativo: true, criado_em: '2026-01-20T14:00:00' },
        { id: 2, categoria_id: 1, nome: 'Smash Duplo Bacon', descricao: 'Dois blends 120g, bacon crocante, queijo prato e maionese defumada.', preco: 36.90, imagem_url: '', modelo3d_url: '', possui_modelo3d: false, ativo: true, criado_em: '2026-01-20T14:05:00' },
        { id: 3, categoria_id: 2, nome: 'Milkshake Ovomaltine', descricao: 'Shake cremoso com Ovomaltine e calda de chocolate.', preco: 18.50, imagem_url: '', modelo3d_url: '', possui_modelo3d: false, ativo: true, criado_em: '2026-01-22T09:00:00' },
        { id: 4, categoria_id: 3, nome: 'Batata Rústica', descricao: 'Batatas com casca temperadas com alho e ervas.', preco: 14.90, imagem_url: '', modelo3d_url: '', possui_modelo3d: false, ativo: true, criado_em: '2026-01-22T09:30:00' },
        { id: 5, categoria_id: 1, nome: 'Veggie Burger', descricao: 'Hambúrguer de grão-de-bico, rúcula, tomate seco e maionese verde.', preco: 26.90, imagem_url: '', modelo3d_url: '', possui_modelo3d: false, ativo: false, criado_em: '2026-02-01T11:00:00' },
    ];

    function init() {
        if (!localStorage.getItem(KEYS.usuarios)) {
            localStorage.setItem(KEYS.usuarios, JSON.stringify(SEED_USUARIOS));
        }
        if (!localStorage.getItem(KEYS.categorias)) {
            localStorage.setItem(KEYS.categorias, JSON.stringify(SEED_CATEGORIAS));
        }
        if (!localStorage.getItem(KEYS.produtos)) {
            localStorage.setItem(KEYS.produtos, JSON.stringify(SEED_PRODUTOS));
        }
        
        // Aplica o tema imediatamente
        if (getTema() === 'light') {
            document.body.classList.add('light-mode');
        }
    }

    /* ── Generic CRUD ── */
    function _getAll(key) {
        return JSON.parse(localStorage.getItem(key) || '[]');
    }

    function _save(key, data) {
        localStorage.setItem(key, JSON.stringify(data));
    }

    function _nextId(items) {
        return items.length ? Math.max(...items.map(i => i.id)) + 1 : 1;
    }

    /* ── Temas (Dark/Light) ── */
    function getTema() {
        return localStorage.getItem(KEYS.tema) || 'dark';
    }

    function toggleTema() {
        const atual = getTema();
        const novo = atual === 'dark' ? 'light' : 'dark';
        localStorage.setItem(KEYS.tema, novo);
        
        if (novo === 'light') {
            document.body.classList.add('light-mode');
        } else {
            document.body.classList.remove('light-mode');
        }
        return novo;
    }

    /* ── Usuários (Admins/Colaboradores) ── */
    function getUsuarios() { return _getAll(KEYS.usuarios); }

    function getUsuarioById(id) {
        return getUsuarios().find(u => u.id === Number(id));
    }

    function createUsuario(data) {
        const all = getUsuarios();
        const exists = all.find(u => u.email.toLowerCase() === data.email.trim().toLowerCase());
        if (exists) return { error: 'Já existe um usuário com este e-mail.' };
        const item = {
            id: _nextId(all),
            nome: data.nome.trim(),
            email: data.email.trim().toLowerCase(),
            papel: data.papel || 'colaborador',
            ativo: true,
            criado_em: new Date().toISOString(),
        };
        // A senha seria tratada no backend, aqui apenas criamos o registro.
        all.push(item);
        _save(KEYS.usuarios, all);
        return { success: true, item };
    }

    function removeUsuario(id) {
        const all = getUsuarios();
        if (all.length <= 1) return { error: 'Não é possível remover o último administrador.' };
        const filtered = all.filter(u => u.id !== Number(id));
        _save(KEYS.usuarios, filtered);
        return { success: true };
    }

    /* ── Categorias ── */
    function getCategorias() { return _getAll(KEYS.categorias); }
    function getCategoriasAtivas() { return getCategorias().filter(c => c.ativo); }

    function getCategoriaById(id) {
        return getCategorias().find(c => c.id === Number(id));
    }

    function createCategoria(data) {
        const all = getCategorias();
        const exists = all.find(c => c.nome.toLowerCase() === data.nome.trim().toLowerCase());
        if (exists) return { error: 'Já existe uma categoria com este nome.' };
        const item = {
            id: _nextId(all),
            nome: data.nome.trim(),
            descricao: (data.descricao || '').trim(),
            ativo: data.ativo !== undefined ? data.ativo : true,
            criado_em: new Date().toISOString(),
        };
        all.push(item);
        _save(KEYS.categorias, all);
        return { success: true, item };
    }

    function updateCategoria(id, data) {
        const all = getCategorias();
        const idx = all.findIndex(c => c.id === Number(id));
        if (idx < 0) return { error: 'Categoria não encontrada.' };
        const dup = all.find(c => c.nome.toLowerCase() === data.nome.trim().toLowerCase() && c.id !== Number(id));
        if (dup) return { error: 'Já existe outra categoria com este nome.' };
        all[idx] = { ...all[idx], ...data, nome: data.nome.trim(), descricao: (data.descricao || '').trim(), atualizado_em: new Date().toISOString() };
        _save(KEYS.categorias, all);
        return { success: true, item: all[idx] };
    }

    function removeCategoria(id) {
        const prods = getProdutos().filter(p => p.categoria_id === Number(id));
        if (prods.length) return { error: `Não é possível excluir: ${prods.length} produto(s) vinculado(s).` };
        const all = getCategorias().filter(c => c.id !== Number(id));
        _save(KEYS.categorias, all);
        return { success: true };
    }

    function toggleCategoria(id) {
        const all = getCategorias();
        const item = all.find(c => c.id === Number(id));
        if (!item) return;
        item.ativo = !item.ativo;
        item.atualizado_em = new Date().toISOString();
        _save(KEYS.categorias, all);
        return item;
    }

    /* ── Produtos ── */
    function getProdutos() { return _getAll(KEYS.produtos); }

    function getProdutoById(id) {
        return getProdutos().find(p => p.id === Number(id));
    }

    function createProduto(data) {
        const all = getProdutos();
        const item = {
            id: _nextId(all),
            categoria_id: Number(data.categoria_id),
            nome: data.nome.trim(),
            descricao: (data.descricao || '').trim(),
            preco: parseFloat(data.preco),
            imagem_url: data.imagem_url || '',
            modelo3d_url: data.modelo3d_url || '',
            possui_modelo3d: !!data.modelo3d_url,
            ativo: data.ativo !== undefined ? data.ativo : true,
            criado_em: new Date().toISOString(),
        };
        all.push(item);
        _save(KEYS.produtos, all);
        return { success: true, item };
    }

    function updateProduto(id, data) {
        const all = getProdutos();
        const idx = all.findIndex(p => p.id === Number(id));
        if (idx < 0) return { error: 'Produto não encontrado.' };
        all[idx] = {
            ...all[idx],
            categoria_id: Number(data.categoria_id),
            nome: data.nome.trim(),
            descricao: (data.descricao || '').trim(),
            preco: parseFloat(data.preco),
            imagem_url: data.imagem_url !== undefined ? data.imagem_url : all[idx].imagem_url,
            modelo3d_url: data.modelo3d_url !== undefined ? data.modelo3d_url : all[idx].modelo3d_url,
            possui_modelo3d: !!(data.modelo3d_url || all[idx].modelo3d_url),
            ativo: data.ativo !== undefined ? data.ativo : all[idx].ativo,
            atualizado_em: new Date().toISOString(),
        };
        _save(KEYS.produtos, all);
        return { success: true, item: all[idx] };
    }

    function removeProduto(id) {
        const all = getProdutos().filter(p => p.id !== Number(id));
        _save(KEYS.produtos, all);
        return { success: true };
    }

    function toggleProduto(id) {
        const all = getProdutos();
        const item = all.find(p => p.id === Number(id));
        if (!item) return;
        item.ativo = !item.ativo;
        item.atualizado_em = new Date().toISOString();
        _save(KEYS.produtos, all);
        return item;
    }

    /* ── Stats ── */
    function getStats() {
        const prods = getProdutos();
        const cats = getCategorias();
        return {
            totalProdutos: prods.length,
            produtosAtivos: prods.filter(p => p.ativo).length,
            produtosInativos: prods.filter(p => !p.ativo).length,
            totalCategorias: cats.length,
        };
    }

    init();

    return {
        getTema, toggleTema,
        getUsuarios, getUsuarioById, createUsuario, removeUsuario,
        getCategorias, getCategoriasAtivas, getCategoriaById, createCategoria, updateCategoria, removeCategoria, toggleCategoria,
        getProdutos, getProdutoById, createProduto, updateProduto, removeProduto, toggleProduto,
        getStats,
    };
})();


/* ═══════════════════════════════════════════
   UI HELPERS
   ═══════════════════════════════════════════ */

const AdminUI = (() => {

    /* ── Toast ── */
    function toast(message, type = 'success') {
        const existing = document.querySelector('.admin-toast');
        if (existing) existing.remove();

        const icon = type === 'success'
            ? '<polyline points="20 6 9 17 4 12"/>'
            : '<circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>';

        const el = document.createElement('div');
        el.className = `admin-toast ${type}`;
        el.innerHTML = `
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">${icon}</svg>
            <span>${message}</span>
        `;
        document.body.appendChild(el);
        requestAnimationFrame(() => el.classList.add('show'));
        setTimeout(() => {
            el.classList.remove('show');
            setTimeout(() => el.remove(), 350);
        }, 3000);
    }

    /* ── Modal confirm ── */
    function confirmModal(title, message, onConfirm) {
        const backdrop = document.getElementById('confirmModal');
        if (!backdrop) return;
        backdrop.querySelector('.admin-modal h3').textContent = title;
        backdrop.querySelector('.admin-modal p').textContent = message;
        backdrop.classList.add('show');

        const btnConfirm = document.getElementById('btnConfirmDelete');
        const btnCancel = document.getElementById('btnCancelDelete');

        const cleanup = () => {
            backdrop.classList.remove('show');
            btnConfirm.replaceWith(btnConfirm.cloneNode(true));
            btnCancel.replaceWith(btnCancel.cloneNode(true));
        };

        btnConfirm.addEventListener('click', () => { cleanup(); onConfirm(); }, { once: true });
        btnCancel.addEventListener('click', cleanup, { once: true });
        backdrop.addEventListener('click', e => { if (e.target === backdrop) cleanup(); }, { once: true });
    }

    /* ── Sidebar mobile ── */
    function initSidebar() {
        const btn = document.querySelector('.mobile-menu-btn');
        const sidebar = document.querySelector('.admin-sidebar');
        const overlay = document.querySelector('.sidebar-overlay');
        if (!btn) return;

        btn.addEventListener('click', () => {
            sidebar.classList.toggle('open');
            overlay.classList.toggle('open');
        });
        if (overlay) {
            overlay.addEventListener('click', () => {
                sidebar.classList.remove('open');
                overlay.classList.remove('open');
            });
        }
    }

    /* ── Format price ── */
    function formatPrice(value) {
        return 'R$ ' + Number(value).toFixed(2).replace('.', ',');
    }

    /* ── Category name by id ── */
    function getCategoryName(id) {
        const cat = AdminStore.getCategoriaById(id);
        return cat ? cat.nome : '—';
    }

    /* ── Populate category select ── */
    function populateCategorySelect(selectEl, selectedId) {
        const cats = AdminStore.getCategorias();
        selectEl.innerHTML = '<option value="">Selecione a categoria</option>';
        cats.forEach(c => {
            const opt = document.createElement('option');
            opt.value = c.id;
            opt.textContent = c.nome + (c.ativo ? '' : ' (inativa)');
            if (Number(selectedId) === c.id) opt.selected = true;
            selectEl.appendChild(opt);
        });
    }

    /* ── Form validation helper ── */
    function validateField(input, errorEl, rules) {
        const val = input.value.trim();
        for (const rule of rules) {
            if (!rule.test(val)) {
                input.classList.add('is-invalid');
                input.classList.remove('is-valid');
                if (errorEl) {
                    errorEl.textContent = '✗ ' + rule.msg;
                    errorEl.classList.add('visible');
                    errorEl.classList.remove('form-success');
                }
                return false;
            }
        }
        input.classList.remove('is-invalid');
        input.classList.add('is-valid');
        if (errorEl) {
            errorEl.classList.remove('visible');
        }
        return true;
    }

    function clearValidation(input, errorEl) {
        input.classList.remove('is-invalid', 'is-valid');
        if (errorEl) errorEl.classList.remove('visible');
    }

    return { toast, confirmModal, initSidebar, formatPrice, getCategoryName, populateCategorySelect, validateField, clearValidation };
})();
