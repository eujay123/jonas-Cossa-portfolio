document.addEventListener('DOMContentLoaded', () => {
    // ==========================================================================
    // INITIALIZE LUCIDE ICONS
    // ==========================================================================
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // ==========================================================================
    // CURSOR GLOW FOLLOW EFFECT
    // ==========================================================================
    const cursorGlow = document.getElementById('cursorGlow');
    
    // Check if device is desktop / has fine pointer
    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    
    if (cursorGlow && !isMobile) {
        let mouseX = window.innerWidth / 2;
        let mouseY = window.innerHeight / 2;
        let currentX = mouseX;
        let currentY = mouseY;
        
        window.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        // Smooth damping animation loop
        const animateCursor = () => {
            const dx = mouseX - currentX;
            const dy = mouseY - currentY;
            
            currentX += dx * 0.08;
            currentY += dy * 0.08;
            
            cursorGlow.style.left = `${currentX}px`;
            cursorGlow.style.top = `${currentY}px`;
            
            requestAnimationFrame(animateCursor);
        };
        
        animateCursor();
    } else if (cursorGlow) {
        cursorGlow.style.display = 'none';
    }

    // ==========================================================================
    // FLOATING NAV PILL ACTIVE INDICATOR & SCROLL SPY
    // ==========================================================================
    const navPill = document.querySelector('.nav-pill');
    const navLinks = document.querySelectorAll('.nav-link');
    const navIndicator = document.querySelector('.nav-indicator');
    const sections = document.querySelectorAll('section');

    const updateNavIndicator = (activeLink) => {
        if (!activeLink || !navIndicator) return;
        
        const pillRect = navPill.getBoundingClientRect();
        const linkRect = activeLink.getBoundingClientRect();
        
        const leftOffset = linkRect.left - pillRect.left;
        
        navIndicator.style.width = `${linkRect.width}px`;
        navIndicator.style.left = `${leftOffset}px`;
    };

    // Click behavior
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            updateNavIndicator(link);
        });
    });

    // Hover sliding indicator behavior
    navLinks.forEach(link => {
        link.addEventListener('mouseenter', () => {
            updateNavIndicator(link);
        });
        
        link.addEventListener('mouseleave', () => {
            const currentActive = document.querySelector('.nav-link.active');
            updateNavIndicator(currentActive);
        });
    });

    // Scroll spy: highlight matching link as user scrolls
    const scrollSpy = () => {
        let currentSectionId = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 180;
            const sectionHeight = section.offsetHeight;
            const scrollPos = window.scrollY;
            
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        if (currentSectionId) {
            const targetLink = document.querySelector(`.nav-link[href="#${currentSectionId}"]`);
            if (targetLink && !targetLink.classList.contains('active')) {
                navLinks.forEach(l => l.classList.remove('active'));
                targetLink.classList.add('active');
                updateNavIndicator(targetLink);
            }
        }
    };

    window.addEventListener('scroll', scrollSpy);
    // Initial call to set navigation active on page load
    setTimeout(() => {
        const initialActive = document.querySelector('.nav-link.active');
        updateNavIndicator(initialActive);
    }, 200);

    // Resize listener to prevent indicator misalignment
    window.addEventListener('resize', () => {
        const currentActive = document.querySelector('.nav-link.active');
        updateNavIndicator(currentActive);
    });

    // ==========================================================================
    // TIMELINE PAGE INTRO ANIMATION (ANIME.JS DESIGN SPELL)
    // ==========================================================================
    if (typeof anime !== 'undefined') {
        const introTl = anime.timeline({
            easing: 'easeOutQuart',
            duration: 1000
        });

        // 1. Stagger header nav slide down
        introTl.add({
            targets: '.header',
            translateY: [-40, 0],
            opacity: [0, 1],
            duration: 900
        });

        // 2. Stagger Hero left elements
        introTl.add({
            targets: '.hero-intro, .hero-title, .hero-subtitle, .hero-actions, .hero-socials',
            translateY: [30, 0],
            opacity: [0, 1],
            delay: anime.stagger(120),
            duration: 900
        }, '-=600');

        // 3. Reveal and scale Hero avatar on right
        introTl.add({
            targets: '.hero-image-container',
            scale: [0.93, 1],
            opacity: [0, 1],
            duration: 1200,
            easing: 'easeOutElastic(1, 0.8)'
        }, '-=1000');
    }

    // ==========================================================================
    // SCROLL REVEAL ANIMATIONS (INTERSECTION OBSERVER & ANIME.JS)
    // ==========================================================================
    const revealCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                
                if (target.classList.contains('services-grid')) {
                    anime({
                        targets: '.service-card',
                        translateY: [50, 0],
                        opacity: [0, 1],
                        delay: anime.stagger(150),
                        duration: 800,
                        easing: 'easeOutQuad'
                    });
                } 
                else if (target.classList.contains('about-approach-area')) {
                    anime({
                        targets: '.approach-card',
                        translateY: [30, 0],
                        opacity: [0, 1],
                        delay: anime.stagger(150),
                        duration: 800,
                        easing: 'easeOutQuad'
                    });
                }
                else if (target.classList.contains('stats-area')) {
                    // Animating stats
                    anime({
                        targets: '.stat-item, .stat-divider',
                        scaleY: [0.5, 1],
                        opacity: [0, 1],
                        delay: anime.stagger(100),
                        duration: 700,
                        easing: 'easeOutQuad'
                    });
                }
                else if (target.classList.contains('skills-grid')) {
                    anime({
                        targets: '.skills-card',
                        scale: [0.96, 1],
                        opacity: [0, 1],
                        delay: anime.stagger(120),
                        duration: 700,
                        easing: 'easeOutQuad'
                    });
                }
                else if (target.classList.contains('projects-grid')) {
                    anime({
                        targets: '.project-card',
                        translateY: [40, 0],
                        opacity: [0, 1],
                        delay: anime.stagger(200),
                        duration: 800,
                        easing: 'easeOutQuad'
                    });
                }

                observer.unobserve(target); // Only trigger once
            }
        });
    };

    const observerOptions = {
        root: null,
        threshold: 0.15
    };

    const revealObserver = new IntersectionObserver(revealCallback, observerOptions);

    // Register sections grids to the observer
    const animTargets = [
        document.querySelector('.services-grid'),
        document.querySelector('.about-approach-area'),
        document.querySelector('.stats-area'),
        document.querySelector('.skills-grid'),
        document.querySelector('.projects-grid')
    ];

    animTargets.forEach(element => {
        if (element) {
            revealObserver.observe(element);
        }
    });

    // ==========================================================================
    // LET'S TALK MODAL INTERACTIVE LOOPS
    // ==========================================================================
    const talkModal = document.getElementById('talkModal');
    const openTalkModal = document.getElementById('openTalkModal');
    const closeTalkModal = document.getElementById('closeTalkModal');

    const toggleModal = (show) => {
        if (show) {
            talkModal.classList.add('active');
            document.body.style.overflow = 'hidden'; // Lock main scroll
            
            // Animate card entrance inside modal
            anime({
                targets: '.modal-card',
                scale: [0.92, 1],
                opacity: [0, 1],
                duration: 650,
                easing: 'easeOutCubic'
            });
        } else {
            anime({
                targets: '.modal-card',
                scale: [1, 0.92],
                opacity: [1, 0],
                duration: 400,
                easing: 'easeInCubic',
                complete: () => {
                    talkModal.classList.remove('active');
                    document.body.style.overflow = ''; // Unlock scroll
                }
            });
        }
    };

    if (openTalkModal && talkModal) {
        openTalkModal.addEventListener('click', () => toggleModal(true));
    }
    
    if (closeTalkModal) {
        closeTalkModal.addEventListener('click', () => toggleModal(false));
    }

    // Backdrop click to close
    if (talkModal) {
        talkModal.addEventListener('click', (e) => {
            if (e.target === talkModal) {
                toggleModal(false);
            }
        });
    }

    // Escape key to close
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && talkModal.classList.contains('active')) {
            toggleModal(false);
        }
    });

    // ==========================================================================
    // MOBILE HAMBURGER MENU INTERACTIVITY
    // ==========================================================================
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

    const openMobileMenu = () => {
        mobileMenuBtn.classList.add('active');
        mobileMenu.classList.add('active');
        document.body.style.overflow = 'hidden'; // Lock background scroll
    };

    const closeMobileMenu = () => {
        mobileMenuBtn.classList.remove('active');
        mobileMenu.classList.remove('active');
        document.body.style.overflow = ''; // Restore background scroll
    };

    const toggleMobileMenu = () => {
        const isOpen = mobileMenuBtn.classList.contains('active');
        if (isOpen) {
            closeMobileMenu();
        } else {
            openMobileMenu();
        }
    };

    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleMobileMenu();
        });
    }

    // Close menu when clicking a link
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', () => {
            closeMobileMenu();
        });
    });

    // Close menu when clicking backdrop
    if (mobileMenu) {
        mobileMenu.addEventListener('click', (e) => {
            if (e.target === mobileMenu) {
                closeMobileMenu();
            }
        });
    }

    // Scroll spy for mobile links
    const mobileScrollSpy = () => {
        let currentSectionId = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 180;
            const sectionHeight = section.offsetHeight;
            const scrollPos = window.scrollY;
            
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        if (currentSectionId) {
            const targetMobileLink = document.querySelector(`.mobile-nav-link[href="#${currentSectionId}"]`);
            if (targetMobileLink && !targetMobileLink.classList.contains('active')) {
                mobileNavLinks.forEach(l => l.classList.remove('active'));
                targetMobileLink.classList.add('active');
            }
        }
    };

    window.addEventListener('scroll', mobileScrollSpy);
});
