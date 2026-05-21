/* ═══════════════════════════════════════════
   login-split.js — Drag & Drop interativo do Hambúrguer
   Usado por TODAS as telas de autenticação
   ═══════════════════════════════════════════ */
(() => {
    const layers = document.querySelectorAll('.drag-layer');
    const btnRemontar = document.getElementById('btnRemontar');
    if (!layers.length || !btnRemontar) return;

    let droppedCount = 0;

    layers.forEach(layer => {
        let isDragging = false;
        let startX, startY;
        let currentX = 0, currentY = 0;

        function onStart(e) {
            isDragging = true;
            layer.classList.remove('dropped');
            layer.classList.add('dragging');

            const point = e.touches ? e.touches[0] : e;
            startX = point.clientX - currentX;
            startY = point.clientY - currentY;

            layer.style.transition = 'none';
            layer.style.zIndex = '100';
        }

        function onMove(e) {
            if (!isDragging) return;
            e.preventDefault();

            const point = e.touches ? e.touches[0] : e;
            currentX = point.clientX - startX;
            currentY = point.clientY - startY;

            const rotation = currentX * 0.04;
            layer.style.transform = `translate(${currentX}px, ${currentY}px) rotate(${rotation}deg)`;
        }

        function onEnd() {
            if (!isDragging) return;
            isDragging = false;
            layer.classList.remove('dragging');

            const distance = Math.sqrt(currentX * currentX + currentY * currentY);

            if (distance > 30) {
                layer.classList.add('dropped');
                layer.style.transition = 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';

                const bounceX = currentX * 1.05;
                const bounceY = currentY * 1.05;
                const rotation = currentX * 0.03;
                layer.style.transform = `translate(${bounceX}px, ${bounceY}px) rotate(${rotation}deg)`;

                setTimeout(() => {
                    layer.style.transform = `translate(${currentX}px, ${currentY}px) rotate(${rotation * 0.5}deg)`;
                }, 200);

                droppedCount++;
                btnRemontar.classList.add('visible');
            } else {
                layer.style.transition = 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)';
                layer.style.transform = '';
                layer.style.zIndex = '';
                currentX = 0;
                currentY = 0;
            }
        }

        layer.addEventListener('mousedown', onStart);
        window.addEventListener('mousemove', onMove);
        window.addEventListener('mouseup', onEnd);
        layer.addEventListener('touchstart', onStart, { passive: true });
        window.addEventListener('touchmove', onMove, { passive: false });
        window.addEventListener('touchend', onEnd);
    });

    btnRemontar.addEventListener('click', () => {
        layers.forEach((layer, i) => {
            setTimeout(() => {
                layer.classList.remove('dropped');
                layer.style.transition = 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
                layer.style.transform = '';
                layer.style.zIndex = '';
            }, i * 80);
        });

        droppedCount = 0;
        setTimeout(() => {
            btnRemontar.classList.remove('visible');
        }, layers.length * 80 + 300);
    });
})();
