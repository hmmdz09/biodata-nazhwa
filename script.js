/**
 * NAZHWA SAVA AZAHRA - PORTFOLIO INTERACTIVITY SCRIPT
 * Features: Background Particle Simulation, Cursor Glow, Scrollspy,
 * Lightbox Modal, Copy to Clipboard, and Toast Notifications
 */

document.addEventListener('DOMContentLoaded', () => {
    initHeaderScroll();
    initMobileMenu();
    initScrollSpy();
    initCursorGlow();
    initParticleCanvas();
    initCardTilt();
});

/* --- 1. HEADER SCROLL EFFECT --- */
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

/* --- 2. MOBILE MENU --- */
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

/* --- 3. SCROLLSPY --- */
function initScrollSpy() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        let current = '';
        const scrollPosition = window.scrollY + 200;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }, { passive: true });
}

/* --- 4. CURSOR GLOW TRACKING --- */
function initCursorGlow() {
    const glow = document.getElementById('cursorGlow');
    if (!glow) return;

    // Check if mouse device
    if (window.matchMedia('(pointer: fine)').matches) {
        window.addEventListener('mousemove', (e) => {
            glow.style.left = `${e.clientX}px`;
            glow.style.top = `${e.clientY}px`;
        });
    } else {
        glow.style.display = 'none';
    }
}

/* --- 5. BACKGROUND PARTICLES CANVAS --- */
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

/* --- 6. 3D TILT EFFECT ON CARDS --- */
function initCardTilt() {
    if (!window.matchMedia('(pointer: fine)').matches) return;

    const cards = document.querySelectorAll('.bento-card');
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

/* --- 7. LIGHTBOX MODAL --- */
window.openLightbox = function(imageSrc, title, desc) {
    const modal = document.getElementById('lightboxModal');
    const img = document.getElementById('lightboxImg');
    const titleEl = document.getElementById('lightboxTitle');
    const descEl = document.getElementById('lightboxDesc');

    if (!modal || !img) return;

    img.src = imageSrc;
    img.alt = title;
    titleEl.textContent = title;
    descEl.textContent = desc;

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

/* --- 8. COPY TO CLIPBOARD --- */
window.copyNIM = function() {
    const nim = document.getElementById('nimText')?.textContent || '2505016';
    navigator.clipboard.writeText(nim).then(() => {
        showToast('NIM 2505016 berhasil disalin ke clipboard! 📋');
    }).catch(() => {
        showToast('NIM: 2505016');
    });
};

/* --- 9. TOAST NOTIFICATION --- */
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

/* --- 10. CONTACT FORM SUBMIT SIMULATION --- */
window.handleContactSubmit = function(event) {
    event.preventDefault();
    const name = document.getElementById('senderName').value;
    const email = document.getElementById('senderEmail').value;

    showToast(`Terima kasih, ${name}! Pesanmu telah terkirim ke Nazhwa. ✨`);

    // Reset form
    event.target.reset();
};
