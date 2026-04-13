/**
 * Cardápio do Cliente - Motor WebGL Scrollytelling (Nível Active Theory)
 */

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

// --- 1. DADOS TOTAIS DO CARDÁPIO ---
const defaultExtras = [
    { name: "Cebola Roxa", price: 2.00 },
    { name: "Bacon Extra", price: 4.00 },
    { name: "Queijo Cheddar", price: 3.00 },
    { name: "Queijo Prato", price: 3.00 },
    { name: "Alface Americana", price: 2.50 },
    { name: "Tomate", price: 1.99 },
    { name: "Hambúrguer Extra (180g)", price: 12.99 },
    { name: "Maionese da Casa Extra", price: 2.00 },
    { name: "Picles", price: 2.50 },
    { name: "Fatias de Bacon", price: 4.00 },
    { name: "Cebola Caramelizada", price: 3.99 },
    { name: "Molho Especial", price: 2.00 },
];

const cookingOptions = ["Bem Passado", "Ao Ponto", "Mal Passado"];

const menuData = [
    {
        category: "Mais Pedidos",
        id: "section-mais-pedidos",
        items: [
            { id: 1, name: "Double Bacon", price: "R$ 36,99", desc: "Pão Brioche, 02 Burguer de 180g, Queijo Cheddar, Bacon artesanal.", extras: defaultExtras, cookingOptions },
            { id: 2, name: "Classic Smash", price: "R$ 34,99", desc: "Pão Brioche, 02 Smash Burguer de 80g, Queijo cheddar, picles.", extras: defaultExtras, cookingOptions },
            { id: 3, name: "Chicken Burguer", price: "R$ 38,99", desc: "Sobrecoxa de frango empanada, Queijo, Alface e Maionese.", extras: defaultExtras.slice(0, 6) },
            { id: 4, name: "Burguer Salada", price: "R$ 35,99", desc: "Pão Brioche, 01 Burguer de 180g, Queijo Cheddar, Alface e Tomate.", extras: defaultExtras, cookingOptions }
        ]
    },
    {
        category: "Hamburguers",
        id: "section-hamburguers",
        items: [
            { id: 5, name: "Burguer Bacon", price: "R$ 38,99", desc: "Pão Brioche, Burguer 180g, Bacon crocante e Queijo Cheddar.", extras: defaultExtras, cookingOptions },
            { id: 6, name: "Double Smash", price: "R$ 34,99", desc: "Dois discos de 80g, Queijo, Cebola, Picles e molho especial.", extras: defaultExtras, cookingOptions }
        ]
    },
    {
        category: "Combos",
        id: "section-combos",
        items: [
            { id: 7, name: "Combo 1", price: "R$ 49,99", desc: "Lanche + Batata Frita 150g + Suco de Morango 500ml.", extras: defaultExtras.slice(0, 4), cookingOptions },
            { id: 8, name: "Combo 2", price: "R$ 60,99", desc: "Dois Lanches + Batata Frita 250g + Coca-cola Lata.", extras: defaultExtras.slice(0, 4), cookingOptions }
        ]
    },
    {
        category: "Sobremesas",
        id: "section-sobremesas",
        items: [
            { id: 9, name: "Pudim", price: "R$ 25,99", desc: "Pudim de leite condensado 50g com Blueberries frescos.", extras: [{ name: "Calda Extra", price: 2.00 }, { name: "Chantilly", price: 3.00 }] },
            { id: 10, name: "Trio de Sobremesas", price: "R$ 60,99", desc: "Três mini sobremesas do chef para compartilhar.", extras: [{ name: "Calda Extra", price: 2.00 }] }
        ]
    },
    {
        category: "Drinks",
        id: "section-drinks",
        items: [
            { id: 11, name: "Caipirinha", price: "R$ 45,99", desc: "Caipirinha de limão tradicional com cachaça 500ml.", extras: [{ name: "Dose Extra", price: 8.00 }] },
            { id: 12, name: "Piña Colada", price: "R$ 40,99", desc: "Piña Colada refrescante de abacaxi 450ml.", extras: [{ name: "Dose Extra", price: 8.00 }] },
            { id: 13, name: "Moscow Mule", price: "R$ 50,99", desc: "Vodka, suco de limão e espuma de gengibre artesanal.", extras: [{ name: "Dose Extra", price: 8.00 }] }
        ]
    },
    {
        category: "Bebidas",
        id: "section-bebidas",
        items: [
            { id: 14, name: "Água Mineral", price: "R$ 4,99", desc: "Água mineral crystal 250ml." },
            { id: 15, name: "Coca-Cola", price: "R$ 7,99", desc: "Coca-cola lata 350ml gelada." },
            { id: 16, name: "Guaraná Antártica", price: "R$ 7,99", desc: "Guaraná Antártica lata 350ml gelada." }
        ]
    }
];

// --- 1.1 DADOS DO RESTAURANTE ---
const restaurantInfo = {
    name: "Menu VR",
    address: "Campo Grande, MS",
    phone: "(67) 99999-8888",
    hours: "Seg-Sex: 18h-23h | Sáb-Dom: 11h-23h",
    instagram: "@menuvr"
};

// --- 1.1 ESTADO DO CARRINHO ---
const cart = {
    items: [],
    getTotal() {
        return this.items.reduce((acc, item) => acc + (parseFloat(item.price.replace('R$ ', '').replace(',', '.')) * item.qty), 0);
    },
    getCount() {
        return this.items.reduce((acc, item) => acc + item.qty, 0);
    }
};

// --- 2. RENDERIZAR O DOM (HTML SCROLLÁVEL) ---
function renderHTML() {
    const scrollContainer = document.getElementById('scroll-container');
    if (!scrollContainer) return;

    menuData.forEach((section, index) => {
        section.items.forEach((item, itemIdx) => {
            const secHTML = document.createElement('section');
            secHTML.className = 'product-section';
            if (itemIdx === 0) {
                secHTML.id = section.id;
            } else {
                secHTML.id = `item-${item.id}`;
            }
            
            secHTML.innerHTML = `
                <div class="product-ui">
                    <span class="category-label">${section.category}</span>
                    <h2 class="product-title">${item.name}</h2>
                    <p class="product-desc">${item.desc}</p>
                    <div class="product-actions">
                        <span class="product-price">${item.price}</span>
                        <div class="qty-row">
                            <div class="qty-controls">
                                <button class="qty-btn minus" aria-label="Remover um">-</button>
                                <span class="qty-value">1</span>
                                <button class="qty-btn plus" aria-label="Adicionar um">+</button>
                            </div>
                            <button class="add-to-cart-btn" data-id="${item.id}">Adicionar</button>
                        </div>
                    </div>
                </div>
            `;
            scrollContainer.appendChild(secHTML);
            
            const valElem = secHTML.querySelector('.qty-value');
            const plus = secHTML.querySelector('.plus');
            const minus = secHTML.querySelector('.minus');
            const addBtn = secHTML.querySelector('.add-to-cart-btn');

            let currentQty = 1;
            plus.addEventListener('click', () => { currentQty++; valElem.textContent = currentQty; });
            minus.addEventListener('click', () => { if(currentQty > 1) currentQty--; valElem.textContent = currentQty; });

            addBtn.addEventListener('click', () => {
                openProductDetail(item);
            });
        });
    });
}

function setupNavBar() {
    document.querySelectorAll('.cat-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const targetId = e.target.getAttribute('data-target');
            gsap.to(window, {
                scrollTo: targetId,
                duration: 1.5,
                ease: "power3.inOut"
            });
        });
    });
}

function addToCart(product, qty) {
    const existing = cart.items.find(i => i.id === product.id);
    if (existing) {
        existing.qty += qty;
    } else {
        cart.items.push({ ...product, qty });
    }
    updateCartUI();
    renderCartDrawer();
}

function updateCartUI() {
    const badge = document.querySelector('.cart-badge');
    if (badge) {
        badge.textContent = cart.getCount();
        badge.style.transform = 'scale(1.4)';
        setTimeout(() => badge.style.transform = 'scale(1)', 300);
    }
    
    const totalElem = document.getElementById('cart-total-value');
    if (totalElem) {
        totalElem.textContent = `R$ ${cart.getTotal().toFixed(2).replace('.', ',')}`;
    }
}

// --- 2.1 LOGICA DO MODAL (DRAWER) ---
function initCartModal() {
    const cartDrawer = document.getElementById('cart-drawer');
    const cartOverlay = document.getElementById('modal-overlay');
    const cartTrigger = document.getElementById('cart-trigger');
    const closeCart = document.getElementById('close-cart');

    if (!cartDrawer || !cartOverlay || !cartTrigger) return;

    function toggleCart(open) {
        if (open) {
            cartDrawer.classList.add('active');
            cartOverlay.classList.add('active');
            document.body.classList.add('cart-open');
        } else {
            cartDrawer.classList.remove('active');
            cartOverlay.classList.remove('active');
            document.body.classList.remove('cart-open');
        }
    }

    const checkoutBtn = document.querySelector('.checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            if (cart.items.length > 0) {
                // Redireciona para o login se houver itens
                window.location.href = 'login.html';
            } else {
                // Feedback visual simples se o carrinho estiver vazio
                checkoutBtn.innerText = "❌ Adicione itens!";
                checkoutBtn.style.background = "var(--accent-red)";
                setTimeout(() => {
                    checkoutBtn.innerText = "Finalizar Pedido";
                    checkoutBtn.style.background = "";
                }, 2000);
            }
        });
    }

    cartTrigger.addEventListener('click', () => toggleCart(true));
    closeCart.addEventListener('click', () => toggleCart(false));
    cartOverlay.addEventListener('click', () => toggleCart(false));
}

function renderCartDrawer() {
    const container = document.getElementById('cart-items');
    if (!container) return;
    
    if (cart.items.length === 0) {
        container.innerHTML = '<p style="text-align:center; color:var(--text-fade); margin-top:40px;">Seu carrinho está vazio.</p>';
        return;
    }

    container.innerHTML = cart.items.map(item => `
        <div class="cart-item">
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <p>${item.qty}x ${item.price}</p>
            </div>
            <div class="qty-btn" onclick="removeFromCart(${item.id})" style="cursor:pointer; opacity:0.6;">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
            </div>
        </div>
    `).join('');
}

window.removeFromCart = function(id) {
    const index = cart.items.findIndex(i => i.id === id);
    if (index > -1) {
        cart.items.splice(index, 1);
        updateCartUI();
        renderCartDrawer();
    }
};


// --- 3. MOTOR WEBGL (THREE.JS SCROLLYTELLING) ---
let scene, camera, renderer;
let models3D = [];
const distanceBetweenItems = 10; // Definido globalmente para evitar erros de referência

function initThreeJS() {
    const canvasContainer = document.getElementById('canvas-container');
    if (!canvasContainer) return;

    scene = new THREE.Scene();
    scene.background = null; 

    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 0, 8);
    
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    canvasContainer.appendChild(renderer.domElement);

    // --- LOGICA DE CLIQUE EM AR ---
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    function onModelClick(event) {
        // Calcula posição do mouse (-1 a +1)
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);
        
        // Verifica interseção com os modelos
        const intersects = raycaster.intersectObjects(scene.children, true);

        if (intersects.length > 0) {
            const arViewer = document.querySelector('#ar-trigger');
            if (arViewer) {
                // Ativa a Realidade Aumentada imediatamente
                arViewer.activateAR();
            }
        }
    }

    // Feedback visual (cursor pointer ao passar sobre o lanche)
    function onMouseMove(event) {
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(scene.children, true);
        
        canvasContainer.style.cursor = intersects.length > 0 ? 'pointer' : 'default';
    }

    window.addEventListener('click', onModelClick);
    window.addEventListener('mousemove', onMouseMove);
    
    scene.add(new THREE.AmbientLight(0xffffff, 0.8));
    const dirLight = new THREE.DirectionalLight(0xffffff, 1);
    dirLight.position.set(5, 5, 5);
    scene.add(dirLight);

    const loader = new THREE.GLTFLoader();

    loader.load('assets/hamburguer.glb', (gltf) => {
        let globalItemIndex = 0;
        menuData.forEach((section) => {
            section.items.forEach((item) => {
                const model = gltf.scene.clone();
                model.scale.set(3, 3, 3); 

                const width = window.innerWidth;
                let xOffset = 3.5;
                let yOffset = -0.5;
                let zOffset = 0;

                if (width < 600) {
                    xOffset = 0; yOffset = 0.5; zOffset = 1.5;
                } else if (width < 1024) {
                    xOffset = 1.8; yOffset = 0.5; zOffset = 0.5;
                }
                
                model.position.set(xOffset, -(globalItemIndex * distanceBetweenItems) + yOffset, zOffset);
                model.rotation.y = Math.PI / 4;
                
                scene.add(model);
                models3D.push({ 
                    mesh: model, 
                    baseY: -(globalItemIndex * distanceBetweenItems) + yOffset,
                    originalIndex: globalItemIndex 
                });
                globalItemIndex++;
            });
        });
        setupGSAPScroll(distanceBetweenItems);
    }, undefined, (error) => {
        console.warn('Usando fallback mesh por erro no GLB ou Loader');
        createFallbacks();
    });

    animateThree();
}

function createFallbacks() {
    let globalItemIndex = 0;
    menuData.forEach((section) => {
        section.items.forEach(() => {
            const geometry = new THREE.BoxGeometry(2, 2, 2);
            const material = new THREE.MeshStandardMaterial({ color: 0xD2042D });
            const cube = new THREE.Mesh(geometry, material);
            const width = window.innerWidth;
            let xOffset = 3.5;
            let yOffset = -0.5;
            let zOffset = 0;

            if (width < 600) {
                xOffset = 0; yOffset = 0.5; zOffset = 1.5;
            } else if (width < 1024) {
                xOffset = 1.8; yOffset = 0.5; zOffset = 0.5;
            }
            
            cube.position.set(xOffset, -(globalItemIndex * distanceBetweenItems) + yOffset, zOffset);
            scene.add(cube);
            models3D.push({ 
                mesh: cube, 
                baseY: -(globalItemIndex * distanceBetweenItems) + yOffset,
                originalIndex: globalItemIndex 
            });
            globalItemIndex++;
        });
    });
    setupGSAPScroll(distanceBetweenItems);
}

function animateThree() {
    requestAnimationFrame(animateThree);
    const time = Date.now() * 0.001;
    models3D.forEach((item, i) => {
        item.mesh.rotation.y += 0.005;
        item.mesh.position.y = item.baseY + Math.sin(time + i) * 0.15; 
    });
    renderer.render(scene, camera);
}

function setupGSAPScroll(distance) {
    const sections = gsap.utils.toArray('.product-section');
    if (sections.length === 0) return;
    
    sections.forEach((sec, i) => {
        const ui = sec.querySelector('.product-ui');
        if (!ui) return;
        gsap.to(ui, {
            opacity: 1, y: 0, duration: 1,
            scrollTrigger: {
                trigger: sec,
                start: "top center",
                end: "bottom center",
                toggleActions: "play reverse play reverse",
            }
        });
    });

    menuData.forEach((section) => {
        const el = document.getElementById(section.id);
        if (!el) return;
        ScrollTrigger.create({
            trigger: el,
            start: "top center",
            end: "bottom center",
            onEnter: () => updateTheme(section.id),
            onEnterBack: () => updateTheme(section.id)
        });
    });

    function updateTheme(sectionId) {
        document.body.className = `theme-${sectionId.replace('section-', '')}`;
        document.querySelectorAll('.cat-btn').forEach(btn => {
            btn.classList.toggle('active', btn.getAttribute('data-target') === `#${sectionId}`);
        });
    }

    gsap.to(camera.position, {
        y: -(sections.length - 1) * distance,
        ease: "none",
        scrollTrigger: {
            trigger: "#scroll-container",
            start: "top top",
            end: "bottom bottom",
            scrub: 1
        }
    });
}

window.addEventListener('resize', () => {
    if(camera && renderer) {
        const width = window.innerWidth;
        const height = window.innerHeight;
        
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);

        models3D.forEach((item) => {
            let xOffset = 3.5;
            let yOffset = -0.5;
            let zOffset = 0;

            if (width < 600) {
                xOffset = 0; yOffset = 0.5; zOffset = 1.5;
            } else if (width < 1024) {
                xOffset = 1.8; yOffset = 0.5; zOffset = 0.5;
            }
            
            item.baseY = -(item.originalIndex * distanceBetweenItems) + yOffset;
            item.mesh.position.set(xOffset, item.baseY, zOffset);
        });
    }
});

document.addEventListener('DOMContentLoaded', () => {
    renderHTML();
    setupNavBar();
    initCartModal();
    initThreeJS();
    initCookieBanner();
    initLoginBtn();
    initProductDetailModal();
    renderRestaurantFooter();

    window.addEventListener('scroll', () => {
        const hint = document.querySelector('.scroll-hint');
        if (hint && window.scrollY > 50) hint.style.opacity = '0';
    });
});

// ─── FEATURE 1: COOKIE BANNER (LGPD) ─────────────────────────────────────────
function initCookieBanner() {
    const banner = document.getElementById('cookie-banner');
    const acceptBtn = document.getElementById('cookie-accept');
    if (!banner || !acceptBtn) return;

    // Se já aceitou antes, esconde o banner
    if (localStorage.getItem('cookiesAccepted') === 'true') {
        banner.classList.add('hidden');
        return;
    }

    // Garante que o banner está visível (sem a classe hidden)
    banner.classList.remove('hidden');

    acceptBtn.addEventListener('click', () => {
        localStorage.setItem('cookiesAccepted', 'true');
        banner.classList.add('hidden');
    });
}

// ─── FEATURE 2: BOTÃO ENTRAR ─────────────────────────────────────────────────
function initLoginBtn() {
    const loginTrigger = document.getElementById('login-trigger');
    if (!loginTrigger) return;
    loginTrigger.addEventListener('click', () => {
        window.location.href = 'login.html';
    });
}

// ─── FEATURE 3: FOOTER DO RESTAURANTE ────────────────────────────────────────
function renderRestaurantFooter() {
    const footer = document.getElementById('restaurant-footer');
    if (!footer) return;

    const phone = restaurantInfo.phone.replace(/[^\d]/g, '');

    footer.innerHTML = `
        <img src="assets/Logo.svg" alt="Logo ${restaurantInfo.name}" class="footer-logo">
        <h2 class="footer-name">${restaurantInfo.name}</h2>
        <div class="footer-info">
            <div class="footer-info-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                <span>${restaurantInfo.address}</span>
            </div>
            <div class="footer-info-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.21 3.18 2 2 0 0 1 3.22 1h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 8.1a16 16 0 0 0 6 6l.56-.56a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 21 16z"/></svg>
                <a href="https://wa.me/55${phone}" target="_blank">${restaurantInfo.phone}</a>
            </div>
            <div class="footer-info-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                <span>${restaurantInfo.hours}</span>
            </div>
            <div class="footer-info-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
                <span>${restaurantInfo.instagram}</span>
            </div>
        </div>
        <div class="footer-divider"></div>
        <p class="footer-credits">Feito com <span>❤</span> por BG Tech Solutions</p>
    `;
}

// ─── FEATURE 4: MODAL DE DETALHES DO PRODUTO ─────────────────────────────────
let currentProductItem = null;
let pdExtrasState = {};
let pdQty = 1;

function initProductDetailModal() {
    const modal = document.getElementById('product-detail-modal');
    const closeBtn = document.getElementById('pd-close');
    const minusBtn = document.getElementById('pd-minus');
    const plusBtn = document.getElementById('pd-plus');
    const qtyDisplay = document.getElementById('pd-qty');
    const addBtn = document.getElementById('pd-add-btn');
    if (!modal) return;

    closeBtn.addEventListener('click', closeProductDetail);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeProductDetail();
    });

    minusBtn.addEventListener('click', () => {
        if (pdQty > 1) pdQty--;
        qtyDisplay.textContent = pdQty;
        updatePDAddBtn();
    });

    plusBtn.addEventListener('click', () => {
        pdQty++;
        qtyDisplay.textContent = pdQty;
        updatePDAddBtn();
    });

    addBtn.addEventListener('click', () => {
        if (!currentProductItem) return;

        const obsEl = document.getElementById('pd-obs');
        const observations = obsEl ? obsEl.value.trim() : '';

        const selectedExtras = Object.entries(pdExtrasState)
            .filter(([, qty]) => qty > 0)
            .map(([name, qty]) => {
                const extra = currentProductItem.extras.find(e => e.name === name);
                return { name, qty, price: extra ? extra.price : 0 };
            });

        const totalExtras = selectedExtras.reduce((sum, e) => sum + e.price * e.qty, 0);
        const basePrice = parseFloat(currentProductItem.price.replace('R$ ', '').replace(',', '.'));
        const unitTotal = basePrice + totalExtras;

        const cartItem = {
            ...currentProductItem,
            qty: pdQty,
            extras: selectedExtras,
            observations,
            unitTotal,
            price: `R$ ${unitTotal.toFixed(2).replace('.', ',')}`
        };

        addToCart(cartItem, pdQty);
        closeProductDetail();

        const btn = document.getElementById('pd-add-btn');
        if (btn) {
            btn.textContent = '✓ Adicionado!';
            setTimeout(() => updatePDAddBtn(), 1500);
        }
    });
}

function openProductDetail(item) {
    currentProductItem = item;
    pdExtrasState = {};
    pdQty = 1;

    const modal = document.getElementById('product-detail-modal');
    const body = document.getElementById('pd-body');
    const qtyDisplay = document.getElementById('pd-qty');
    if (!modal || !body) return;

    qtyDisplay.textContent = 1;

    const basePrice = parseFloat(item.price.replace('R$ ', '').replace(',', '.'));

    let html = `
        <h2 class="pd-product-name">${item.name}</h2>
        <p class="pd-product-desc">${item.desc}</p>
        <p class="pd-product-price">${item.price}</p>
    `;

    // Extras / Adicionais
    if (item.extras && item.extras.length > 0) {
        item.extras.forEach(e => { pdExtrasState[e.name] = 0; });

        html += `
            <div class="pd-section-title">
                <h3>Adicionais 🔍</h3>
                <span class="pd-section-badge">0/${item.extras.length}</span>
            </div>
            <p class="pd-section-hint">Escolha entre 0 e ${item.extras.length} opções</p>
        `;

        item.extras.forEach(extra => {
            html += `
                <div class="pd-extra-item" data-extra-name="${extra.name}">
                    <div class="pd-extra-info">
                        <span class="pd-extra-name">${extra.name}</span>
                        <span class="pd-extra-price">+R$ ${extra.price.toFixed(2).replace('.', ',')}</span>
                    </div>
                    <div class="pd-extra-qty">
                        <button class="pd-extra-minus" data-name="${extra.name}">−</button>
                        <span class="pd-extra-count" data-name="${extra.name}">0</span>
                        <button class="pd-extra-plus" data-name="${extra.name}">+</button>
                    </div>
                </div>
            `;
        });
    }

    // Ponto da Carne
    if (item.cookingOptions && item.cookingOptions.length > 0) {
        html += `
            <div class="pd-section-title">
                <h3>Ponto da carne</h3>
                <span class="pd-section-badge">OBRIGATÓRIO</span>
            </div>
            <p class="pd-section-hint">Escolha 1 opção</p>
            <div class="pd-radio-group">
        `;
        item.cookingOptions.forEach((opt, idx) => {
            html += `
                <label class="pd-radio-item">
                    <input type="radio" name="cooking" value="${opt}" ${idx === 0 ? 'checked' : ''}>
                    <span class="pd-radio-label">${opt}</span>
                </label>
            `;
        });
        html += `</div>`;
    }

    // Observações
    html += `
        <div class="pd-obs-section">
            <h3>💬 Alguma Observação?</h3>
            <textarea id="pd-obs" class="pd-obs-textarea" placeholder="Inclua uma observação sobre o pedido."></textarea>
        </div>
    `;

    body.innerHTML = html;

    // Wire up extra +/- buttons
    body.querySelectorAll('.pd-extra-plus').forEach(btn => {
        btn.addEventListener('click', () => {
            const name = btn.dataset.name;
            pdExtrasState[name] = (pdExtrasState[name] || 0) + 1;
            body.querySelector(`.pd-extra-count[data-name="${name}"]`).textContent = pdExtrasState[name];
            updatePDAddBtn();
        });
    });

    body.querySelectorAll('.pd-extra-minus').forEach(btn => {
        btn.addEventListener('click', () => {
            const name = btn.dataset.name;
            if (pdExtrasState[name] > 0) pdExtrasState[name]--;
            body.querySelector(`.pd-extra-count[data-name="${name}"]`).textContent = pdExtrasState[name];
            updatePDAddBtn();
        });
    });

    updatePDAddBtn();
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    // Desativa o canvas 3D enquanto o modal está aberto para não bloquear toques
    const canvas = document.getElementById('canvas-container');
    if (canvas) canvas.style.pointerEvents = 'none';
}

function closeProductDetail() {
    const modal = document.getElementById('product-detail-modal');
    if (modal) modal.classList.remove('active');
    document.body.style.overflow = '';
    currentProductItem = null;
    // Reativa o canvas 3D
    const canvas = document.getElementById('canvas-container');
    if (canvas) canvas.style.pointerEvents = 'auto';
}

function updatePDAddBtn() {
    if (!currentProductItem) return;
    const btn = document.getElementById('pd-add-btn');
    if (!btn) return;

    const basePrice = parseFloat(currentProductItem.price.replace('R$ ', '').replace(',', '.'));
    const extrasTotal = Object.entries(pdExtrasState).reduce((sum, [name, qty]) => {
        const extra = currentProductItem.extras ? currentProductItem.extras.find(e => e.name === name) : null;
        return sum + (extra ? extra.price * qty : 0);
    }, 0);

    const total = (basePrice + extrasTotal) * pdQty;
    btn.textContent = `Adicionar (R$ ${total.toFixed(2).replace('.', ',')})`;
}
