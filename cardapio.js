/**
 * Cardápio do Cliente - Motor WebGL Scrollytelling (Nível Active Theory)
 */

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

// --- 1. DADOS TOTAIS DO CARDÁPIO (Transcrição da Imagem) ---
const menuData = [
    {
        category: "Mais Pedidos",
        id: "section-mais-pedidos",
        items: [
            { id: 1, name: "Double Bacon", price: "R$ 36,99", desc: "Pão Brioche, 02 Burguer de 180g, Queijo Cheddar, Bacon artesanal." },
            { id: 2, name: "Classic Smash", price: "R$ 34,99", desc: "Pão Brioche, 02 Smash Burguer de 80g, Queijo cheddar, picles." },
            { id: 3, name: "Chicken Burguer", price: "R$ 38,99", desc: "Sobrecoxa de frango empanada, Queijo, Alface e Maionese." },
            { id: 4, name: "Burguer Salada", price: "R$ 35,99", desc: "Pão Brioche, 01 Burguer de 180g, Queijo Cheddar, Alface e Tomate." }
        ]
    },
    {
        category: "Hamburguers",
        id: "section-hamburguers",
        items: [
            { id: 5, name: "Burguer Bacon", price: "R$ 38,99", desc: "Pão Brioche, Burguer 180g, Bacon crocante e Queijo Cheddar." },
            { id: 6, name: "Double Smash", price: "R$ 34,99", desc: "Dois discos de 80g, Queijo, Cebola, Picles e molho especial." }
        ]
    },
    {
        category: "Combos",
        id: "section-combos",
        items: [
            { id: 7, name: "Combo 1", price: "R$ 49,99", desc: "Lanche + Batata Frita 150g + Suco de Morango 500ml." },
            { id: 8, name: "Combo 2", price: "R$ 60,99", desc: "Dois Lanches + Batata Frita 250g + Coca-cola Lata." }
        ]
    },
    {
        category: "Sobremesas",
        id: "section-sobremesas",
        items: [
            { id: 9, name: "Pudim", price: "R$ 25,99", desc: "Pudim de leite condensado 50g com Blueberries frescos." },
            { id: 10, name: "Trio de Sobremesas", price: "R$ 60,99", desc: "Três mini sobremesas do chef para compartilhar." }
        ]
    },
    {
        category: "Drinks",
        id: "section-drinks",
        items: [
            { id: 11, name: "Caipirinha", price: "R$ 45,99", desc: "Caipirinha de limão tradicional com cachaça 500ml." },
            { id: 12, name: "Piña Colada", price: "R$ 40,99", desc: "Piña Colada refrescante de abacaxi 450ml." },
            { id: 13, name: "Moscow Mule", price: "R$ 50,99", desc: "Vodka, suco de limão e espuma de gengibre artesanal." }
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
                addToCart(item, currentQty);
                const originalText = addBtn.innerText;
                addBtn.innerText = "✓ Adicionado";
                addBtn.classList.add('added');
                setTimeout(() => {
                    addBtn.innerText = originalText;
                    addBtn.classList.remove('added');
                }, 1500);
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
                    xOffset = 0; yOffset = 1.8; zOffset = 1.5;
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
                xOffset = 0; yOffset = 1.8; zOffset = 1.5;
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
                xOffset = 0; yOffset = 1.8; zOffset = 1.5;
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
    
    window.addEventListener('scroll', () => {
        const hint = document.querySelector('.scroll-hint');
        if(hint && window.scrollY > 50) hint.style.opacity = '0';
    });
});
