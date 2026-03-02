
        // Advanced cursor system with trail
        const cursorCore = document.querySelector('.cursor-core');
        const cursorRing = document.querySelector('.cursor-ring');
        const cursorDot = document.querySelector('.cursor-dot');
        let mouseX = 0, mouseY = 0;
        let coreX = 0, coreY = 0;
        let ringX = 0, ringY = 0;
        let dotX = 0, dotY = 0;

        // Create trail particles
        const trails = [];
        for (let i = 0; i < 5; i++) {
            const trail = document.createElement('div');
            trail.className = 'cursor-trail';
            document.body.appendChild(trail);
            trails.push({ el: trail, x: 0, y: 0 });
        }

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        function animateCursor() {
            // Core follows quickly
            coreX += (mouseX - coreX) * 0.2;
            coreY += (mouseY - coreY) * 0.2;
            cursorCore.style.left = coreX - 10 + 'px';
            cursorCore.style.top = coreY - 10 + 'px';

            // Ring follows slower
            ringX += (mouseX - ringX) * 0.1;
            ringY += (mouseY - ringY) * 0.1;
            cursorRing.style.left = ringX - 25 + 'px';
            cursorRing.style.top = ringY - 25 + 'px';

            // Dot is instantaneous
            dotX = mouseX;
            dotY = mouseY;
            cursorDot.style.left = dotX - 3 + 'px';
            cursorDot.style.top = dotY - 3 + 'px';

            // Trails with delay
            trails.forEach((trail, i) => {
                const delay = (i + 1) * 0.05;
                trail.x += (mouseX - trail.x) * (0.1 - delay);
                trail.y += (mouseY - trail.y) * (0.1 - delay);
                trail.el.style.left = trail.x - 5 + 'px';
                trail.el.style.top = trail.y - 5 + 'px';
                trail.el.style.opacity = 1 - (i * 0.15);
            });

            requestAnimationFrame(animateCursor);
        }
        animateCursor();

        // Hover effects
        document.querySelectorAll('button, .item').forEach(el => {
            el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
            el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
        });

        // Create stars
        function createStars() {
            const container = document.getElementById('stars');
            for (let i = 0; i < 100; i++) {
                const star = document.createElement('div');
                star.className = 'star';
                star.style.left = Math.random() * 100 + '%';
                star.style.top = Math.random() * 100 + '%';
                star.style.width = Math.random() * 3 + 'px';
                star.style.height = star.style.width;
                star.style.setProperty('--duration', (2 + Math.random() * 3) + 's');
                star.style.animationDelay = Math.random() * 5 + 's';
                container.appendChild(star);
            }
        }
        createStars();

        // Create floating orbs
        function createOrbs() {
            const container = document.getElementById('orbField');
            const colors = ['#00f5ff', '#ff006e', '#bc13fe', '#ffea00', '#39ff14'];
            for (let i = 0; i < 20; i++) {
                const orb = document.createElement('div');
                orb.className = 'orb';
                orb.style.left = Math.random() * 100 + '%';
                orb.style.width = (10 + Math.random() * 20) + 'px';
                orb.style.height = orb.style.width;
                orb.style.background = colors[Math.floor(Math.random() * colors.length)];
                orb.style.boxShadow = `0 0 30px ${orb.style.background}`;
                orb.style.animationDelay = Math.random() * 10 + 's';
                orb.style.animationDuration = (8 + Math.random() * 6) + 's';
                container.appendChild(orb);
            }
        }
        createOrbs();

        // Character animation for headlines
        function animateCharacters() {
            document.querySelectorAll('.headline').forEach(headline => {
                const text = headline.textContent;
                headline.innerHTML = '';
                text.split('').forEach((char, i) => {
                    const span = document.createElement('span');
                    span.className = 'char';
                    span.textContent = char === ' ' ? '\u00A0' : char;
                    span.style.animationDelay = (0.3 + i * 0.05) + 's';
                    headline.appendChild(span);
                });
            });
        }
        animateCharacters();

        // Slider logic
        const items = document.querySelectorAll('.item');
        const totalSlides = items.length;
        let currentIndex = 1;
        let isPlaying = true;
        let autoPlayInterval;

        function updateProgress() {
            const progress = ((currentIndex - 1) / (totalSlides - 1)) * 100;
            document.getElementById('waveFill').style.width = progress + '%';
            document.getElementById('now').textContent = String(currentIndex).padStart(2, '0');
        }

        function nextSlide() {
            const slide = document.querySelector('.slide-reel');
            const items = document.querySelectorAll('.item');
            
            items[1].style.opacity = '0';
            items[1].style.transform = 'scale(1.1) translateZ(100px)';
            
            setTimeout(() => {
                slide.appendChild(items[0]);
                const newItems = document.querySelectorAll('.item');
                newItems[1].style.opacity = '1';
                newItems[1].style.transform = 'scale(1) translateZ(0)';
                
                currentIndex = currentIndex >= totalSlides ? 1 : currentIndex + 1;
                updateProgress();
                animateCharacters();
            }, 400);
        }

        function prevSlide() {
            const slide = document.querySelector('.slide-reel');
            const items = document.querySelectorAll('.item');
            
            items[1].style.opacity = '0';
            
            setTimeout(() => {
                slide.prepend(items[items.length - 1]);
                const newItems = document.querySelectorAll('.item');
                newItems[1].style.opacity = '1';
                
                currentIndex = currentIndex <= 1 ? totalSlides : currentIndex - 1;
                updateProgress();
                animateCharacters();
            }, 400);
        }

        // Event listeners
        document.querySelector('.next').addEventListener('click', () => {
            nextSlide();
            resetAutoPlay();
        });

        document.querySelector('.prev').addEventListener('click', () => {
            prevSlide();
            resetAutoPlay();
        });

        // Play/Pause
        const masterPlay = document.getElementById('masterPlay');
        masterPlay.addEventListener('click', () => {
            isPlaying = !isPlaying;
            masterPlay.innerHTML = isPlaying ? '<i class="fa-solid fa-pause"></i>' : '<i class="fa-solid fa-play"></i>';
            if (isPlaying) startAutoPlay();
            else clearInterval(autoPlayInterval);
        });

        // Auto play
        function startAutoPlay() {
            clearInterval(autoPlayInterval);
            autoPlayInterval = setInterval(nextSlide, 6000);
        }

        function resetAutoPlay() {
            if (isPlaying) {
                clearInterval(autoPlayInterval);
                startAutoPlay();
            }
        }

        // Keyboard
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowRight') {
                nextSlide();
                resetAutoPlay();
            }
            if (e.key === 'ArrowLeft') {
                prevSlide();
                resetAutoPlay();
            }
        });

        // Thumbnail click
        document.querySelectorAll('.item').forEach((item, index) => {
            item.addEventListener('click', () => {
                if (index > 1) {
                    for (let i = 0; i < index - 1; i++) {
                        setTimeout(() => nextSlide(), i * 200);
                    }
                }
            });
        });

        // 3D tilt on mouse move
        const stage = document.querySelector('.stage');
        document.addEventListener('mousemove', (e) => {
            const x = (e.clientX / window.innerWidth - 0.5) * 30;
            const y = (e.clientY / window.innerHeight - 0.5) * 30;
            stage.style.transform = `translate(-50%, -50%) perspective(2000px) rotateY(${x}deg) rotateX(${-y}deg)`;
        });

        // Initialize
        updateProgress();
        startAutoPlay();

        // Pause on hover
        stage.addEventListener('mouseenter', () => {
            if (isPlaying) clearInterval(autoPlayInterval);
        });

        stage.addEventListener('mouseleave', () => {
            if (isPlaying) startAutoPlay();
        });
   