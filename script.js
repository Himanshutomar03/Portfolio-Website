/* ===========================
   Portfolio JavaScript
   =========================== */

document.addEventListener('DOMContentLoaded', () => {
    initCustomCursor();
    initParticles();
    initTypingAnimation();
    initThemeToggle();
    initNavbar();
    initScrollAnimations();
    initSkillBars();
    initContactForm();
    initParallax();
    initCertificatePreview();
});

/* ===========================
   Custom Cursor
   =========================== */
function initCustomCursor() {
    const glow = document.getElementById('cursor-glow');
    
    if (!glow) return;
    
    // Check if mobile
    if (window.innerWidth <= 768) return;

    let mouseX = 0, mouseY = 0;
    let lastSparkleTime = 0;
    let lastX = 0, lastY = 0;
    const sparklePool = [];
    const MAX_SPARKLES = 30;
    const SPARKLE_INTERVAL = 40; // ms between sparkles
    const STAR_CHARS = ['✦', '✧', '⬦', '•'];

    // Move glow dot
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        glow.style.left = mouseX + 'px';
        glow.style.top = mouseY + 'px';

        // Only spawn sparkles if mouse is moving enough
        const dx = mouseX - lastX;
        const dy = mouseY - lastY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        const now = Date.now();
        if (dist > 3 && now - lastSparkleTime > SPARKLE_INTERVAL) {
            createSparkle(mouseX, mouseY, dx, dy);
            lastSparkleTime = now;
        }
        
        lastX = mouseX;
        lastY = mouseY;
    });

    function createSparkle(x, y, dx, dy) {
        const isStar = Math.random() > 0.5;
        const el = document.createElement('div');
        
        if (isStar) {
            el.className = 'sparkle-star';
            el.textContent = STAR_CHARS[Math.floor(Math.random() * STAR_CHARS.length)];
            const size = Math.random() * 8 + 8;
            el.style.fontSize = size + 'px';
            const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
            el.style.color = isDark 
                ? `hsl(${160 + Math.random() * 30}, 80%, ${60 + Math.random() * 20}%)`
                : `hsl(${160 + Math.random() * 30}, 70%, ${40 + Math.random() * 20}%)`;
            el.style.textShadow = `0 0 6px currentColor`;
        } else {
            el.className = 'sparkle';
            const size = Math.random() * 5 + 2;
            el.style.width = size + 'px';
            el.style.height = size + 'px';
            const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
            const hue = 160 + Math.random() * 30;
            el.style.background = `hsl(${hue}, 80%, ${55 + Math.random() * 25}%)`;
            el.style.boxShadow = `0 0 ${size * 2}px hsl(${hue}, 80%, 60%)`;
        }
        
        el.style.left = x + 'px';
        el.style.top = y + 'px';
        document.body.appendChild(el);
        
        // Physics: slight velocity opposite to movement + random spread
        const vx = -(dx * 0.15) + (Math.random() - 0.5) * 2;
        const vy = -(dy * 0.15) + (Math.random() - 0.5) * 2 - 0.5; // slight upward float
        const rotation = Math.random() * 360;
        const duration = 600 + Math.random() * 500;
        const startTime = performance.now();

        function animateSparkle(now) {
            const elapsed = now - startTime;
            const progress = elapsed / duration;
            
            if (progress >= 1) {
                el.remove();
                return;
            }

            const currentX = x + vx * elapsed * 0.08;
            const currentY = y + vy * elapsed * 0.08 - 0.5 * elapsed * 0.003; // gravity-defying float
            const scale = 1 - progress * 0.6;
            const opacity = 1 - progress;
            
            el.style.left = currentX + 'px';
            el.style.top = currentY + 'px';
            el.style.opacity = opacity;
            el.style.transform = `translate(-50%, -50%) scale(${scale}) rotate(${rotation + progress * 180}deg)`;
            
            requestAnimationFrame(animateSparkle);
        }
        
        requestAnimationFrame(animateSparkle);
    }

    // Hover effect on interactive elements
    const hoverElements = document.querySelectorAll('a, button, .project-card, .activity-card, .skill-icon-item, .cert-card, input, textarea');
    hoverElements.forEach(el => {
        el.addEventListener('mouseenter', () => glow.classList.add('active'));
        el.addEventListener('mouseleave', () => glow.classList.remove('active'));
    });
}

/* ===========================
   Particle Background
   =========================== */
function initParticles() {
    const canvas = document.getElementById('particles-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let particles = [];

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    // Confetti-like particle shapes
    const SHAPES = ['dash', 'dot', 'rect', 'diamond'];
    
    class Particle {
        constructor() {
            this.reset();
        }
        
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.shape = SHAPES[Math.floor(Math.random() * SHAPES.length)];
            
            // Size varies by shape
            this.size = Math.random() * 4 + 2;
            if (this.shape === 'dash') this.size = Math.random() * 8 + 4;
            if (this.shape === 'rect') this.size = Math.random() * 5 + 3;

            // Slow, gentle drift
            this.speedX = (Math.random() - 0.5) * 0.3;
            this.speedY = (Math.random() - 0.5) * 0.2 - 0.1; // slight upward bias
            
            // Rotation
            this.rotation = Math.random() * Math.PI * 2;
            this.rotationSpeed = (Math.random() - 0.5) * 0.02;
            
            // Opacity
            this.opacity = Math.random() * 0.5 + 0.15;
            this.opacityTarget = this.opacity;
            this.opacitySpeed = (Math.random() - 0.5) * 0.003;
            
            // Color — emerald/teal/cyan hues
            const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
            const hue = 150 + Math.random() * 50; // 150-200 covers emerald to cyan
            const saturation = 60 + Math.random() * 30;
            const lightness = isDark ? (45 + Math.random() * 25) : (35 + Math.random() * 25);
            this.color = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            this.rotation += this.rotationSpeed;
            
            // Gentle opacity pulsing
            this.opacity += this.opacitySpeed;
            if (this.opacity > 0.65 || this.opacity < 0.1) {
                this.opacitySpeed *= -1;
            }

            // Wrap around edges with padding
            if (this.x < -20) this.x = canvas.width + 20;
            if (this.x > canvas.width + 20) this.x = -20;
            if (this.y < -20) this.y = canvas.height + 20;
            if (this.y > canvas.height + 20) this.y = -20;
        }

        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rotation);
            ctx.globalAlpha = this.opacity;
            ctx.fillStyle = this.color;
            
            switch (this.shape) {
                case 'dash':
                    // Small rectangular dash
                    ctx.fillRect(-this.size / 2, -1, this.size, 2);
                    break;
                case 'dot':
                    // Small circle
                    ctx.beginPath();
                    ctx.arc(0, 0, this.size / 2, 0, Math.PI * 2);
                    ctx.fill();
                    break;
                case 'rect':
                    // Small square/rectangle
                    ctx.fillRect(-this.size / 2, -this.size / 3, this.size, this.size * 0.6);
                    break;
                case 'diamond':
                    // Small diamond shape
                    ctx.beginPath();
                    ctx.moveTo(0, -this.size / 2);
                    ctx.lineTo(this.size / 3, 0);
                    ctx.moveTo(0, this.size / 2);
                    ctx.lineTo(-this.size / 3, 0);
                    ctx.closePath();
                    ctx.fill();
                    break;
            }
            
            ctx.restore();
        }
    }

    // Create particles — more for larger screens
    const particleCount = Math.min(120, Math.floor((canvas.width * canvas.height) / 8000));
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        requestAnimationFrame(animate);
    }
    animate();
}

/* ===========================
   Typing Animation
   =========================== */
function initTypingAnimation() {
    const el = document.getElementById('typing-text');
    if (!el) return;

    const phrases = [
        'Aspiring Software Engineer',
        'AI & ML Enthusiast',
        'Full-Stack Developer',
        'Open Source Contributor',
        'Problem Solver'
    ];

    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeSpeed = 80;

    function type() {
        const currentPhrase = phrases[phraseIndex];

        if (isDeleting) {
            el.textContent = currentPhrase.substring(0, charIndex - 1);
            charIndex--;
            typeSpeed = 40;
        } else {
            el.textContent = currentPhrase.substring(0, charIndex + 1);
            charIndex++;
            typeSpeed = 80;
        }

        if (!isDeleting && charIndex === currentPhrase.length) {
            isDeleting = true;
            typeSpeed = 2000; // Pause before deleting
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            typeSpeed = 400; // Pause before next phrase
        }

        setTimeout(type, typeSpeed);
    }

    setTimeout(type, 1000);
}

/* ===========================
   Theme Toggle
   =========================== */
function initThemeToggle() {
    const toggle = document.getElementById('theme-toggle');
    const icon = document.getElementById('theme-icon');
    if (!toggle || !icon) return;

    // Load saved theme
    const savedTheme = localStorage.getItem('portfolio-theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme, icon);

    toggle.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme');
        const next = current === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', next);
        localStorage.setItem('portfolio-theme', next);
        updateThemeIcon(next, icon);
    });
}

function updateThemeIcon(theme, icon) {
    icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
}

/* ===========================
   Navbar
   =========================== */
function initNavbar() {
    const navbar = document.getElementById('navbar');
    const menuBtn = document.getElementById('mobile-menu-btn');
    const navLinks = document.getElementById('nav-links');
    const links = document.querySelectorAll('.nav-link');

    // Scroll effect
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        
        if (scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        lastScroll = scrollY;

        // Update active nav link
        updateActiveLink();
    });

    // Mobile menu toggle
    if (menuBtn && navLinks) {
        menuBtn.addEventListener('click', () => {
            menuBtn.classList.toggle('active');
            navLinks.classList.toggle('open');
        });

        // Close menu on link click
        links.forEach(link => {
            link.addEventListener('click', () => {
                menuBtn.classList.remove('active');
                navLinks.classList.remove('open');
            });
        });
    }
}

function updateActiveLink() {
    const sections = document.querySelectorAll('section[id]');
    const links = document.querySelectorAll('.nav-link');
    
    let current = '';
    sections.forEach(section => {
        const top = section.offsetTop - 100;
        if (window.scrollY >= top) {
            current = section.getAttribute('id');
        }
    });

    links.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + current) {
            link.classList.add('active');
        }
    });
}

/* ===========================
   Scroll Animations
   =========================== */
function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    document.querySelectorAll('.animate-on-scroll').forEach(el => {
        observer.observe(el);
    });
}

/* ===========================
   Skill Progress Bars
   =========================== */
function initSkillBars() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const bars = entry.target.querySelectorAll('.skill-progress');
                bars.forEach(bar => {
                    const width = bar.getAttribute('data-width');
                    setTimeout(() => {
                        bar.style.width = width + '%';
                    }, 200);
                });
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    document.querySelectorAll('.skill-category').forEach(cat => {
        observer.observe(cat);
    });
}

/* ===========================
   Contact Form
   =========================== */
function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const btn = document.getElementById('submit-btn');
        const originalHTML = btn.innerHTML;
        
        // Simulate sending
        btn.innerHTML = '<span>Sending...</span><i class="fas fa-spinner fa-spin"></i>';
        btn.disabled = true;

        setTimeout(() => {
            btn.innerHTML = '<span>Message Sent!</span><i class="fas fa-check"></i>';
            btn.style.background = 'linear-gradient(135deg, #00c853, #00d4ff)';
            
            setTimeout(() => {
                btn.innerHTML = originalHTML;
                btn.style.background = '';
                btn.disabled = false;
                form.reset();
            }, 2500);
        }, 1500);
    });
}

/* ===========================
   Parallax Effect
   =========================== */
function initParallax() {
    const hero = document.querySelector('.hero');
    const avatar = document.querySelector('.avatar-container');
    
    if (!hero || !avatar || window.innerWidth <= 768) return;

    hero.addEventListener('mousemove', (e) => {
        const rect = hero.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;

        avatar.style.transform = `translate(${x * 20}px, ${y * 20}px)`;

        // Move floating badges in opposite direction
        const badges = document.querySelectorAll('.floating-badge');
        badges.forEach((badge, i) => {
            const factor = (i + 1) * 8;
            badge.style.transform = `translate(${-x * factor}px, ${-y * factor}px)`;
        });
    });

    hero.addEventListener('mouseleave', () => {
        avatar.style.transform = '';
        document.querySelectorAll('.floating-badge').forEach(badge => {
            badge.style.transform = '';
        });
    });
}

/* ===========================
   Certificate Preview
   =========================== */
function initCertificatePreview() {
    const certCards = document.querySelectorAll('.cert-card[data-preview]');
    const modalOverlay = document.getElementById('cert-modal-overlay');
    const modalContent = document.getElementById('cert-modal-content');
    const modalClose = document.getElementById('cert-modal-close');
    
    if (!certCards.length || !modalOverlay) return;

    // Create floating preview element
    const floatPreview = document.createElement('div');
    floatPreview.className = 'cert-preview-float';
    document.body.appendChild(floatPreview);

    let currentCard = null;
    let previewTimeout = null;

    // Hover: show floating preview tooltip
    certCards.forEach(card => {
        card.addEventListener('mouseenter', (e) => {
            currentCard = card;
            const previewFile = card.dataset.preview;
            const previewType = card.dataset.previewType;

            // Load preview content
            floatPreview.innerHTML = '';
            if (previewType === 'image') {
                const img = document.createElement('img');
                img.src = previewFile;
                img.alt = 'Certificate Preview';
                floatPreview.appendChild(img);
            } else {
                const iframe = document.createElement('iframe');
                iframe.src = previewFile;
                iframe.title = 'Certificate Preview';
                floatPreview.appendChild(iframe);
            }

            // Show with delay for smooth UX
            previewTimeout = setTimeout(() => {
                floatPreview.classList.add('visible');
            }, 200);
        });

        card.addEventListener('mousemove', (e) => {
            const x = e.clientX + 20;
            const y = e.clientY - 120;
            
            // Keep preview within viewport
            const maxX = window.innerWidth - 340;
            const maxY = window.innerHeight - 240;
            
            floatPreview.style.left = Math.min(x, maxX) + 'px';
            floatPreview.style.top = Math.max(10, Math.min(y, maxY)) + 'px';
        });

        card.addEventListener('mouseleave', () => {
            currentCard = null;
            clearTimeout(previewTimeout);
            floatPreview.classList.remove('visible');
            // Clear content after transition
            setTimeout(() => {
                if (!currentCard) floatPreview.innerHTML = '';
            }, 300);
        });

        // Click: open full modal
        card.addEventListener('click', () => {
            const previewFile = card.dataset.preview;
            const previewType = card.dataset.previewType;

            modalContent.innerHTML = '';
            if (previewType === 'image') {
                const img = document.createElement('img');
                img.src = previewFile;
                img.alt = 'Certificate';
                modalContent.appendChild(img);
            } else {
                const iframe = document.createElement('iframe');
                iframe.src = previewFile;
                iframe.title = 'Certificate';
                modalContent.appendChild(iframe);
            }

            modalOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';

            // Hide floating preview
            floatPreview.classList.remove('visible');
        });
    });

    // Close modal
    function closeModal() {
        modalOverlay.classList.remove('active');
        document.body.style.overflow = '';
        setTimeout(() => {
            modalContent.innerHTML = '';
        }, 400);
    }

    modalClose.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) closeModal();
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
            closeModal();
        }
    });
}
