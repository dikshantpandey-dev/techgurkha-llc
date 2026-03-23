/* ============================================
   TECH GURKHA LLC — INTERACTIVE ENGINE
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

    // --- Cursor Glow ---
    const cursorGlow = document.getElementById('cursorGlow');
    let mouseX = 0, mouseY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        cursorGlow.style.left = mouseX + 'px';
        cursorGlow.style.top = mouseY + 'px';
        if (!cursorGlow.classList.contains('active')) {
            cursorGlow.classList.add('active');
        }
    });

    // --- Particle Background ---
    const particleCanvas = document.getElementById('particleCanvas');
    const pCtx = particleCanvas.getContext('2d');
    let particles = [];

    function resizeParticleCanvas() {
        particleCanvas.width = window.innerWidth;
        particleCanvas.height = window.innerHeight;
    }
    resizeParticleCanvas();
    window.addEventListener('resize', resizeParticleCanvas);

    class Particle {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * particleCanvas.width;
            this.y = Math.random() * particleCanvas.height;
            this.size = Math.random() * 1.5 + 0.5;
            this.speedX = (Math.random() - 0.5) * 0.3;
            this.speedY = (Math.random() - 0.5) * 0.3;
            this.opacity = Math.random() * 0.5 + 0.1;
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            if (this.x < 0 || this.x > particleCanvas.width ||
                this.y < 0 || this.y > particleCanvas.height) {
                this.reset();
            }
        }

        draw() {
            pCtx.beginPath();
            pCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            pCtx.fillStyle = `rgba(0, 240, 255, ${this.opacity})`;
            pCtx.fill();
        }
    }

    function initParticles() {
        const count = Math.min(80, Math.floor((window.innerWidth * window.innerHeight) / 15000));
        particles = [];
        for (let i = 0; i < count; i++) {
            particles.push(new Particle());
        }
    }

    function animateParticles() {
        pCtx.clearRect(0, 0, particleCanvas.width, particleCanvas.height);

        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();

            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 120) {
                    pCtx.beginPath();
                    pCtx.moveTo(particles[i].x, particles[i].y);
                    pCtx.lineTo(particles[j].x, particles[j].y);
                    pCtx.strokeStyle = `rgba(0, 240, 255, ${0.06 * (1 - dist / 120)})`;
                    pCtx.lineWidth = 0.5;
                    pCtx.stroke();
                }
            }
        }

        requestAnimationFrame(animateParticles);
    }

    initParticles();
    animateParticles();

    // --- Neural Network Canvas ---
    const neuralCanvas = document.getElementById('neuralCanvas');
    if (neuralCanvas) {
        const nCtx = neuralCanvas.getContext('2d');
        let nodes = [];
        let connections = [];
        let nWidth, nHeight;

        function resizeNeural() {
            const rect = neuralCanvas.parentElement.getBoundingClientRect();
            nWidth = rect.width * 2;
            nHeight = rect.height * 2;
            neuralCanvas.width = nWidth;
            neuralCanvas.height = nHeight;
            neuralCanvas.style.width = rect.width + 'px';
            neuralCanvas.style.height = rect.height + 'px';
            initNeural();
        }

        function initNeural() {
            nodes = [];
            connections = [];
            const layers = [5, 7, 9, 7, 5];
            const layerSpacing = nWidth / (layers.length + 1);

            layers.forEach((count, layerIdx) => {
                const x = layerSpacing * (layerIdx + 1);
                const nodeSpacing = nHeight / (count + 1);
                for (let i = 0; i < count; i++) {
                    const y = nodeSpacing * (i + 1);
                    nodes.push({
                        x, y,
                        baseX: x,
                        baseY: y,
                        radius: 4 + Math.random() * 3,
                        layer: layerIdx,
                        pulse: Math.random() * Math.PI * 2,
                        pulseSpeed: 0.02 + Math.random() * 0.03,
                    });
                }
            });

            // Connect adjacent layers
            let offset = 0;
            for (let l = 0; l < layers.length - 1; l++) {
                const nextOffset = offset + layers[l];
                for (let i = 0; i < layers[l]; i++) {
                    for (let j = 0; j < layers[l + 1]; j++) {
                        if (Math.random() < 0.5) {
                            connections.push({
                                from: offset + i,
                                to: nextOffset + j,
                                signal: Math.random(),
                                signalSpeed: 0.005 + Math.random() * 0.015,
                                active: Math.random() < 0.3,
                            });
                        }
                    }
                }
                offset = nextOffset;
            }
        }

        function animateNeural() {
            nCtx.clearRect(0, 0, nWidth, nHeight);

            // Update node pulsing
            nodes.forEach(node => {
                node.pulse += node.pulseSpeed;
                node.x = node.baseX + Math.sin(node.pulse) * 3;
                node.y = node.baseY + Math.cos(node.pulse * 0.7) * 3;
            });

            // Draw connections
            connections.forEach(conn => {
                const from = nodes[conn.from];
                const to = nodes[conn.to];

                nCtx.beginPath();
                nCtx.moveTo(from.x, from.y);
                nCtx.lineTo(to.x, to.y);
                nCtx.strokeStyle = 'rgba(0, 240, 255, 0.06)';
                nCtx.lineWidth = 1;
                nCtx.stroke();

                // Animated signal
                if (conn.active) {
                    conn.signal += conn.signalSpeed;
                    if (conn.signal > 1) {
                        conn.signal = 0;
                        conn.active = Math.random() < 0.3;
                    }

                    const sx = from.x + (to.x - from.x) * conn.signal;
                    const sy = from.y + (to.y - from.y) * conn.signal;

                    const gradient = nCtx.createRadialGradient(sx, sy, 0, sx, sy, 12);
                    gradient.addColorStop(0, 'rgba(0, 240, 255, 0.8)');
                    gradient.addColorStop(1, 'rgba(0, 240, 255, 0)');
                    nCtx.beginPath();
                    nCtx.arc(sx, sy, 12, 0, Math.PI * 2);
                    nCtx.fillStyle = gradient;
                    nCtx.fill();
                } else {
                    if (Math.random() < 0.002) conn.active = true;
                }
            });

            // Draw nodes
            nodes.forEach(node => {
                const glow = (Math.sin(node.pulse * 2) + 1) / 2;
                const radius = node.radius + glow * 2;

                // Outer glow
                const gradient = nCtx.createRadialGradient(node.x, node.y, 0, node.x, node.y, radius * 4);
                gradient.addColorStop(0, `rgba(123, 47, 247, ${0.15 + glow * 0.1})`);
                gradient.addColorStop(1, 'rgba(123, 47, 247, 0)');
                nCtx.beginPath();
                nCtx.arc(node.x, node.y, radius * 4, 0, Math.PI * 2);
                nCtx.fillStyle = gradient;
                nCtx.fill();

                // Node
                nCtx.beginPath();
                nCtx.arc(node.x, node.y, radius, 0, Math.PI * 2);
                nCtx.fillStyle = `rgba(0, 240, 255, ${0.4 + glow * 0.4})`;
                nCtx.fill();
                nCtx.strokeStyle = `rgba(0, 240, 255, ${0.2 + glow * 0.3})`;
                nCtx.lineWidth = 1;
                nCtx.stroke();
            });

            requestAnimationFrame(animateNeural);
        }

        resizeNeural();
        animateNeural();

        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(resizeNeural, 200);
        });
    }

    // --- Navbar Scroll ---
    const navbar = document.getElementById('navbar');
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    function onScroll() {
        const scrollY = window.scrollY;

        // Navbar background
        if (scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Active section
        sections.forEach(section => {
            const top = section.offsetTop - 200;
            const bottom = top + section.offsetHeight;
            const id = section.getAttribute('id');

            if (scrollY >= top && scrollY < bottom) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + id) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
    window.addEventListener('scroll', onScroll, { passive: true });

    // --- Mobile Nav Toggle ---
    const navToggle = document.getElementById('navToggle');
    const navLinksContainer = document.getElementById('navLinks');

    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('open');
        navLinksContainer.classList.toggle('open');
        document.body.style.overflow = navLinksContainer.classList.contains('open') ? 'hidden' : '';
    });

    navLinksContainer.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('open');
            navLinksContainer.classList.remove('open');
            document.body.style.overflow = '';
        });
    });

    // --- Scroll Animations ---
    const animatedElements = document.querySelectorAll('[data-animate]');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = parseInt(entry.target.dataset.delay) || 0;
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, delay);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    animatedElements.forEach(el => observer.observe(el));

    // --- Smooth scroll for all anchor links ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

});
