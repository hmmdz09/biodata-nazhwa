/**
 * NAZHWA SAVA AZAHRA - PORTFOLIO INTERACTIVITY SCRIPT
 * Features:
 * 1. Ultra-Modern Seamless Page Transition (Glowing Progress Bar & Soft Blur-Scale Dissolve)
 * 2. Physically Connected Spring & Pendulum Lanyard (Seamless strap-to-clip attachment)
 * 3. Particle Canvas & Ambient Cursor Glow
 * 4. 3D Tilt Effect on Cards
 * 5. Lightbox Modal
 * 6. Copy NIM, Toast Notifications, and Contact Form Simulation
 */

document.addEventListener('DOMContentLoaded', () => {
    initPageTransitions();
    initHeaderScroll();
    initMobileMenu();
    initCursorGlow();
    initParticleCanvas();
    initCardTilt();
    initLanyard();
    initMomentsFilter();
});

/* ==========================================================================
   1. CROSSFADE PAGE TRANSITION ENGINE
   ========================================================================== */
function initPageTransitions() {
    document.body.classList.remove('page-crossfade-out');

    const links = document.querySelectorAll('a[href]');
    links.forEach(link => {
        const href = link.getAttribute('href');
        
        if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('http') || link.target === '_blank') {
            return;
        }

        link.addEventListener('click', (e) => {
            const currentPath = window.location.pathname.split('/').pop() || 'index.html';
            const targetPath = href.split('/').pop() || 'index.html';
            if (currentPath === targetPath) {
                return;
            }

            e.preventDefault();
            document.body.classList.add('page-crossfade-out');

            setTimeout(() => {
                window.location.href = href;
            }, 240);
        });
    });

    // Handle browser back/forward buttons (bfcache)
    window.addEventListener('pageshow', () => {
        document.body.classList.remove('page-crossfade-out');
    });
}

/* ==========================================================================
   2. PHYSICALLY CONNECTED SPRING & PENDULUM LANYARD
   ========================================================================== */
function initLanyard() {
    const container = document.getElementById('lanyardContainer');
    const cardWrapper = document.getElementById('lanyardCardWrapper');
    const strapLeft = document.getElementById('strapLeft');
    const strapRight = document.getElementById('strapRight');
    const strapStitchLeft = document.getElementById('strapStitchLeft');
    const strapStitchRight = document.getElementById('strapStitchRight');
    const cardShine = document.getElementById('cardShine');
    const cardHologram = document.getElementById('cardHologram');
    const hint = document.getElementById('lanyardHint');

    if (!container || !cardWrapper || !strapLeft || !strapRight) return;

    let width = container.clientWidth || 380;
    let height = container.clientHeight || 600;

    // Top anchor points on mount bracket
    let anchorY = 6;
    let anchorLeftX = width * 0.5 - 22;
    let anchorRightX = width * 0.5 + 22;

    // Physics variables (Equilibrium rest position)
    let restX = width * 0.5;
    let restY = 160;

    let currentX = restX;
    let currentY = restY;
    let vx = 0;
    let vy = 0;

    let currentAngle = 0;
    let vAngle = 0;

    let isDragging = false;
    let pointerStartX = 0;
    let pointerStartY = 0;
    let cardStartOffsetX = 0;
    let cardStartOffsetY = 0;

    let time = 0;

    function updateDimensions() {
        width = container.clientWidth || 380;
        height = container.clientHeight || 600;
        anchorLeftX = width * 0.5 - 22;
        anchorRightX = width * 0.5 + 22;
        restX = width * 0.5;
        restY = 160;
        if (!isDragging && Math.abs(currentX - restX) > width * 0.4) {
            currentX = restX;
            currentY = restY;
        }
    }

    window.addEventListener('resize', updateDimensions);

    // Pointer events for mouse & touch
    cardWrapper.addEventListener('pointerdown', (e) => {
        isDragging = true;
        cardWrapper.classList.add('is-dragging');
        cardWrapper.setPointerCapture(e.pointerId);

        pointerStartX = e.clientX;
        pointerStartY = e.clientY;
        cardStartOffsetX = currentX;
        cardStartOffsetY = currentY;

        vx = 0;
        vy = 0;

        if (hint) {
            hint.style.opacity = '0';
        }
    });

    cardWrapper.addEventListener('pointermove', (e) => {
        if (!isDragging) return;

        const deltaX = e.clientX - pointerStartX;
        const deltaY = e.clientY - pointerStartY;

        // Realistic stretch limits
        const targetX = cardStartOffsetX + deltaX;
        const targetY = Math.max(90, Math.min(height - 240, cardStartOffsetY + deltaY));

        vx = (targetX - currentX) * 0.45;
        vy = (targetY - currentY) * 0.45;

        currentX = targetX;
        currentY = targetY;

        const targetAngle = Math.max(-36, Math.min(36, (currentX - restX) * 0.22));
        currentAngle += (targetAngle - currentAngle) * 0.25;
    });

    const endDrag = (e) => {
        if (!isDragging) return;
        isDragging = false;
        cardWrapper.classList.remove('is-dragging');
        try {
            cardWrapper.releasePointerCapture(e.pointerId);
        } catch (_) {}
    };

    cardWrapper.addEventListener('pointerup', endDrag);
    cardWrapper.addEventListener('pointercancel', endDrag);

    // Physics Animation Loop
    function renderPhysics() {
        time += 1;

        if (!isDragging) {
            // Spring restoring force
            const kSpring = 0.045;
            const damping = 0.88;
            const fx = -kSpring * (currentX - restX);
            const fy = -kSpring * (currentY - restY);

            vx = (vx + fx) * damping;
            vy = (vy + fy) * damping;

            currentX += vx;
            currentY += vy;

            // Natural pendulum rotation angle & idle gentle air sway
            const idleSway = Math.sin(time * 0.035) * 1.8;
            const targetAngle = ((currentX - restX) * 0.2) + idleSway;
            const kAngle = 0.065;
            const dampingAngle = 0.86;

            vAngle = (vAngle + -kAngle * (currentAngle - targetAngle)) * dampingAngle;
            currentAngle += vAngle;
        }

        // Connection point into the clip ring (Clip ring center is at currentX, currentY + 6)
        const clipLeftX = currentX - 5;
        const clipLeftY = currentY + 6;
        const clipRightX = currentX + 5;
        const clipRightY = currentY + 6;

        // Draw Left Strap Bezier Curve directly into clip ring
        const leftCtrlX1 = anchorLeftX + (clipLeftX - anchorLeftX) * 0.25;
        const leftCtrlY1 = anchorY + (clipLeftY - anchorY) * 0.55 + 12;
        const leftCtrlX2 = anchorLeftX + (clipLeftX - anchorLeftX) * 0.78;
        const leftCtrlY2 = anchorY + (clipLeftY - anchorY) * 0.85;
        const pathLeft = `M ${anchorLeftX} ${anchorY} C ${leftCtrlX1} ${leftCtrlY1}, ${leftCtrlX2} ${leftCtrlY2}, ${clipLeftX} ${clipLeftY}`;
        strapLeft.setAttribute('d', pathLeft);
        if (strapStitchLeft) strapStitchLeft.setAttribute('d', pathLeft);

        // Draw Right Strap Bezier Curve directly into clip ring
        const rightCtrlX1 = anchorRightX + (clipRightX - anchorRightX) * 0.25;
        const rightCtrlY1 = anchorY + (clipRightY - anchorY) * 0.55 + 12;
        const rightCtrlX2 = anchorRightX + (clipRightX - anchorRightX) * 0.78;
        const rightCtrlY2 = anchorY + (clipRightY - anchorY) * 0.85;
        const pathRight = `M ${anchorRightX} ${anchorY} C ${rightCtrlX1} ${rightCtrlY1}, ${rightCtrlX2} ${rightCtrlY2}, ${clipRightX} ${clipRightY}`;
        strapRight.setAttribute('d', pathRight);
        if (strapStitchRight) strapStitchRight.setAttribute('d', pathRight);

        // Position Card Wrapper: exactly aligned with clip ring at (currentX, currentY)
        const wrapperX = currentX - 145; // 290px card width / 2
        const wrapperY = currentY;

        const rotateY = Math.max(-25, Math.min(25, currentAngle * 0.55));
        const rotateX = Math.max(-14, Math.min(14, (currentY - restY) * -0.07));
        cardWrapper.style.transform = `translate3d(${wrapperX}px, ${wrapperY}px, 0) rotateZ(${currentAngle}deg) rotateY(${rotateY}deg) rotateX(${rotateX}deg)`;

        // Dynamic light reflection shift
        if (cardShine) {
            const shineAngle = 135 + currentAngle * 1.5;
            const shineOpacity = 0.22 + Math.abs(currentAngle) * 0.01;
            cardShine.style.background = `linear-gradient(${shineAngle}deg, rgba(255, 255, 255, ${shineOpacity}) 0%, rgba(255, 255, 255, 0.02) 40%, transparent 60%)`;
        }

        if (cardHologram) {
            const holoX = 50 + (currentX - restX) * 0.3;
            cardHologram.style.transform = `translate(${holoX}%, ${currentAngle * 1.2}px)`;
        }

        requestAnimationFrame(renderPhysics);
    }

    renderPhysics();
}

/* ==========================================================================
   3. HEADER SCROLL EFFECT
   ========================================================================== */
function initHeaderScroll() {
    const header = document.getElementById('header');
    if (!header) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 40) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }, { passive: true });
}

/* ==========================================================================
   4. MOBILE NAVIGATION MENU
   ========================================================================== */
function initMobileMenu() {
    const toggle = document.getElementById('mobileToggle');
    const menu = document.getElementById('navMenu');
    const links = document.querySelectorAll('.nav-link');

    if (!toggle || !menu) return;

    toggle.addEventListener('click', () => {
        menu.classList.toggle('open');
        toggle.classList.toggle('active');
    });

    links.forEach(link => {
        link.addEventListener('click', () => {
            menu.classList.remove('open');
            toggle.classList.remove('active');
        });
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
        if (!menu.contains(e.target) && !toggle.contains(e.target) && menu.classList.contains('open')) {
            menu.classList.remove('open');
            toggle.classList.remove('active');
        }
    });
}

/* ==========================================================================
   5. CURSOR GLOW TRACKING
   ========================================================================== */
function initCursorGlow() {
    const glow = document.getElementById('cursorGlow');
    if (!glow) return;

    if (window.matchMedia('(pointer: fine)').matches) {
        window.addEventListener('mousemove', (e) => {
            glow.style.left = `${e.clientX}px`;
            glow.style.top = `${e.clientY}px`;
        });
    } else {
        glow.style.display = 'none';
    }
}

/* ==========================================================================
   6. BACKGROUND PARTICLES CANVAS
   ========================================================================== */
function initParticleCanvas() {
    const canvas = document.getElementById('particleCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });

    const particles = [];
    const count = Math.min(width > 768 ? 45 : 20, 50);

    for (let i = 0; i < count; i++) {
        particles.push({
            x: Math.random() * width,
            y: Math.random() * height,
            radius: Math.random() * 1.8 + 0.5,
            speedX: (Math.random() - 0.5) * 0.4,
            speedY: (Math.random() - 0.5) * 0.4,
            alpha: Math.random() * 0.5 + 0.2,
            color: Math.random() > 0.5 ? 'rgba(168, 85, 247,' : 'rgba(236, 72, 153,'
        });
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);

        particles.forEach(p => {
            p.x += p.speedX;
            p.y += p.speedY;

            if (p.x < 0) p.x = width;
            if (p.x > width) p.x = 0;
            if (p.y < 0) p.y = height;
            if (p.y > height) p.y = 0;

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fillStyle = `${p.color} ${p.alpha})`;
            ctx.fill();
        });

        requestAnimationFrame(animate);
    }

    animate();
}

/* ==========================================================================
   7. 3D TILT EFFECT ON CARDS
   ========================================================================== */
function initCardTilt() {
    if (!window.matchMedia('(pointer: fine)').matches) return;

    const cards = document.querySelectorAll('.bento-card, .portal-card');
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -4;
            const rotateY = ((x - centerX) / centerX) * 4;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
        });
    });
}

/* ==========================================================================
   8. MOMENTS CATEGORY FILTER
   ========================================================================== */
function initMomentsFilter() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const momentCards = document.querySelectorAll('.moment-card');

    if (!filterBtns.length || !momentCards.length) return;

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter') || 'all';

            momentCards.forEach(card => {
                const category = card.getAttribute('data-category') || '';
                if (filterValue === 'all' || category === filterValue) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

/* ==========================================================================
   9. LIGHTBOX MODAL
   ========================================================================== */
window.openLightbox = function(imageSrc, title, desc) {
    const modal = document.getElementById('lightboxModal');
    const img = document.getElementById('lightboxImg');
    const titleEl = document.getElementById('lightboxTitle');
    const descEl = document.getElementById('lightboxDesc');

    if (!modal || !img) return;

    img.src = imageSrc;
    img.alt = title;
    if (titleEl) titleEl.textContent = title;
    if (descEl) descEl.textContent = desc;

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
};

window.closeLightbox = function(event) {
    if (event.target.id === 'lightboxModal') {
        closeLightboxDirectly();
    }
};

window.closeLightboxDirectly = function() {
    const modal = document.getElementById('lightboxModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
};

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeLightboxDirectly();
    }
});

/* ==========================================================================
   10. COPY NIM TO CLIPBOARD
   ========================================================================== */
window.copyNIM = function() {
    const nim = document.getElementById('nimText')?.textContent || '2505016';
    navigator.clipboard.writeText(nim).then(() => {
        showToast('NIM 2505016 berhasil disalin ke clipboard! 📋');
    }).catch(() => {
        showToast('NIM: 2505016');
    });
};

/* ==========================================================================
   11. TOAST NOTIFICATION
   ========================================================================== */
function showToast(message) {
    const toast = document.getElementById('toastNotification');
    const toastMsg = document.getElementById('toastMessage');

    if (!toast || !toastMsg) return;

    toastMsg.textContent = message;
    toast.classList.add('show');

    setTimeout(() => {
        toast.classList.remove('show');
    }, 3200);
}

/* ==========================================================================
   12. CONTACT FORM SUBMIT SIMULATION
   ========================================================================== */
window.handleContactSubmit = function(event) {
    event.preventDefault();
    const nameEl = document.getElementById('senderName');
    const name = nameEl ? nameEl.value : 'Teman';

    showToast(`Terima kasih, ${name}! Pesanmu telah terkirim ke Nazhwa. ✨`);

    event.target.reset();
};
