document.addEventListener('DOMContentLoaded', function() {
    // Text slider functionality with 3D cube flip
    const slides = document.querySelectorAll('.slide');
    const slider = document.querySelector('.text-slider');
    let currentSlide = 0;
    let previousSlide = 0;
    const totalSlides = slides.length;
    let sliderInterval;
    let pauseOnLastSlide = false;
    let isAnimating = false;
    let isHeroSectionVisible = false;
    
    // Touch and swipe variables for hero slider
    let touchStartX = 0;
    let touchEndX = 0;
    let mouseStartX = 0;
    let mouseEndX = 0;
    let isDragging = false;
    
    // Determine if we're on a mobile device
    const isMobile = window.innerWidth <= 480;
    
    // Animation duration based on device
    const animationDuration = isMobile ? 400 : 600; // Reduced from 600/800 to 400/600 for faster transitions
    
    // Hide all slides initially except the first one
    slides.forEach((slide, index) => {
        if (index !== 0) {
            slide.style.visibility = 'hidden';
        }
    });
    
    // Set initial slide
    slides[currentSlide].classList.add('active');
    slides[currentSlide].style.visibility = 'visible';
    
    function startSlider() {
        // Clear any existing interval first
        if (sliderInterval) {
            clearInterval(sliderInterval);
        }
        
        sliderInterval = setInterval(() => {
            // Don't start a new animation if one is already in progress or if section is not visible
            if (isAnimating || !isHeroSectionVisible) return;
            
            // If we're on the last slide and it's set to pause
            if (currentSlide === totalSlides - 1 && pauseOnLastSlide) {
                // Don't advance, just keep showing the last slide
                return;
            }
            
            isAnimating = true;
            
            // Store previous slide index
            previousSlide = currentSlide;
            
            // Make sure the next slide is ready but hidden
            currentSlide = (currentSlide + 1) % totalSlides;
            slides[currentSlide].style.visibility = 'visible';
            
            // Add prev class to the current slide (which will become the previous)
            slides[previousSlide].classList.remove('active');
            slides[previousSlide].classList.add('prev');
            
            // Add active class to new current slide
            slides[currentSlide].classList.add('active');
            
            // After animation completes, clean up and prepare for next animation
            setTimeout(() => {
                // Hide the previous slide
                slides[previousSlide].style.visibility = 'hidden';
                slides[previousSlide].classList.remove('prev');
                
                // Animation is complete
                isAnimating = false;
                
                // If we've reached the last slide (Why choose NaviTechAid)
                if (currentSlide === totalSlides - 1) {
                    // Pause on this slide for longer (10 seconds)
                    pauseOnLastSlide = true;
                    
                    // After 10 seconds, allow the slider to continue
                    setTimeout(() => {
                        pauseOnLastSlide = false;
                    }, 10000);
                }
            }, animationDuration); // Match this to the CSS transition duration
        }, 6000); // Changed from 12000 to 6000 - display each slide for 6 seconds
    }
    
    // Function to go to next slide for hero slider
    function goToNextSlide() {
        if (isAnimating || !isHeroSectionVisible) return;
        
        isAnimating = true;
        previousSlide = currentSlide;
        
        // Calculate next slide index
        currentSlide = (currentSlide + 1) % totalSlides;
        
        // Make sure the next slide is ready but hidden
        slides[currentSlide].style.visibility = 'visible';
        slides[currentSlide].style.transform = 'rotateX(90deg)';
        
        // Animate current slide out
        slides[previousSlide].style.transform = 'rotateX(-90deg)';
        
        // After half the animation duration, start rotating the new slide in
        setTimeout(() => {
            slides[currentSlide].style.transform = 'rotateX(0deg)';
        }, animationDuration / 2);
        
        // After animation completes, hide previous slide and reset animation flag
        setTimeout(() => {
            slides[previousSlide].classList.remove('active');
            slides[previousSlide].style.visibility = 'hidden';
            slides[currentSlide].classList.add('active');
            isAnimating = false;
        }, animationDuration);
    }
    
    // Function to go to previous slide for hero slider
    function goToPrevSlide() {
        if (isAnimating || !isHeroSectionVisible) return;
        
        isAnimating = true;
        previousSlide = currentSlide;
        
        // Calculate previous slide index
        currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
        
        // Make sure the previous slide is ready but hidden
        slides[currentSlide].style.visibility = 'visible';
        slides[currentSlide].style.transform = 'rotateX(-90deg)';
        
        // Animate current slide out
        slides[previousSlide].style.transform = 'rotateX(90deg)';
        
        // After half the animation duration, start rotating the new slide in
        setTimeout(() => {
            slides[currentSlide].style.transform = 'rotateX(0deg)';
        }, animationDuration / 2);
        
        // After animation completes, hide previous slide and reset animation flag
        setTimeout(() => {
            slides[previousSlide].classList.remove('active');
            slides[previousSlide].style.visibility = 'hidden';
            slides[currentSlide].classList.add('active');
            isAnimating = false;
        }, animationDuration);
    }

    // Add click event for hero slider
    slider.addEventListener('click', function(e) {
        // Prevent click from triggering if we're dragging
        if (isDragging) {
            isDragging = false;
            return;
        }
        
        // Reset the interval to prevent immediate auto-advance
        if (sliderInterval) {
            clearInterval(sliderInterval);
            startSlider();
        }
        
        goToNextSlide();
    });
    
    // Add click event for the entire hero-animation-container
    const heroAnimationContainer = document.querySelector('.hero-animation-container');
    if (heroAnimationContainer) {
        heroAnimationContainer.addEventListener('click', function(e) {
            // Don't propagate the click to avoid double triggering with the slider click
            e.stopPropagation();
            
            // Don't trigger if we're already animating or if the hero section isn't visible
            if (isAnimating || !isHeroSectionVisible) return;
            
            // Reset the interval to prevent immediate auto-advance
            if (sliderInterval) {
                clearInterval(sliderInterval);
                startSlider();
            }
            
            goToNextSlide();
        });
        
        // Make the container clickable by removing pointer-events: none
        heroAnimationContainer.style.pointerEvents = 'auto';
    }
    
    // Touch events for hero slider
    slider.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    
    slider.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });
    
    // Mouse events for hero slider (for drag/swipe with mouse)
    slider.addEventListener('mousedown', function(e) {
        mouseStartX = e.clientX;
        isDragging = false;
    });
    
    slider.addEventListener('mousemove', function(e) {
        if (e.buttons === 1) { // Left mouse button is pressed
            isDragging = true;
        }
    });
    
    slider.addEventListener('mouseup', function(e) {
        if (isDragging) {
            mouseEndX = e.clientX;
            handleMouseSwipe();
        }
    });
    
    // Handle touch swipe
    function handleSwipe() {
        const swipeThreshold = 50; // Minimum distance required for a swipe
        const swipeDistance = touchEndX - touchStartX;
        
        // Reset the interval to prevent immediate auto-advance
        if (sliderInterval) {
            clearInterval(sliderInterval);
            startSlider();
        }
        
        if (swipeDistance > swipeThreshold) {
            // Swiped right - go to previous slide
            goToPrevSlide();
        } else if (swipeDistance < -swipeThreshold) {
            // Swiped left - go to next slide
            goToNextSlide();
        }
    }
    
    // Handle mouse swipe
    function handleMouseSwipe() {
        const swipeThreshold = 50; // Minimum distance required for a swipe
        const swipeDistance = mouseEndX - mouseStartX;
        
        // Reset the interval to prevent immediate auto-advance
        if (sliderInterval) {
            clearInterval(sliderInterval);
            startSlider();
        }
        
        if (swipeDistance > swipeThreshold) {
            // Swiped right - go to previous slide
            goToPrevSlide();
        } else if (swipeDistance < -swipeThreshold) {
            // Swiped left - go to next slide
            goToNextSlide();
        }
        
        isDragging = false;
    }
    
    // About section slider functionality
    const aboutSlides = document.querySelectorAll('.about-slide');
    let currentAboutSlide = 0;
    let previousAboutSlide = 0;
    const totalAboutSlides = aboutSlides.length;
    let aboutSliderInterval;
    let isAboutSectionVisible = false;
    
    // Touch and swipe variables for about slider
    let aboutTouchStartX = 0;
    let aboutTouchEndX = 0;
    let aboutMouseStartX = 0;
    let aboutMouseEndX = 0;
    let isAboutDragging = false;
    
    // Set initial about slide
    aboutSlides[currentAboutSlide].classList.add('active');
    
    function startAboutSlider() {
        // Clear any existing interval first
        if (aboutSliderInterval) {
            clearInterval(aboutSliderInterval);
        }
        
        aboutSliderInterval = setInterval(() => {
            // Only proceed if the about section is visible
            if (!isAboutSectionVisible) return;
            
            // Store previous slide index
            previousAboutSlide = currentAboutSlide;
            
            // Move to next slide or back to first
            currentAboutSlide = (currentAboutSlide + 1) % totalAboutSlides;
            
            // Add exit class to the previous slide
            aboutSlides[previousAboutSlide].classList.remove('active');
            aboutSlides[previousAboutSlide].classList.add('exit');
            
            // Add active class to new current slide
            aboutSlides[currentAboutSlide].classList.add('active');
            
            // Remove exit class after animation completes
            setTimeout(() => {
                aboutSlides[previousAboutSlide].classList.remove('exit');
            }, 2000); // Increased from 1500ms to 2000ms to match the new CSS transition time
        }, 6000); // Changed from 12000 to 6000 - display each slide for 6 seconds
    }
    
    // Function to go to next slide for about slider
    function goToNextAboutSlide() {
        if (!isAboutSectionVisible) return;
        
        // Store previous slide index
        previousAboutSlide = currentAboutSlide;
        
        // Move to next slide or back to first
        currentAboutSlide = (currentAboutSlide + 1) % totalAboutSlides;
        
        // Remove any existing animation classes first
        aboutSlides.forEach(slide => {
            slide.classList.remove('exit', 'exit-reverse', 'active-reverse');
        });
        
        // Add exit class to the previous slide - always exit to the left
        aboutSlides[previousAboutSlide].classList.remove('active');
        aboutSlides[previousAboutSlide].classList.add('exit');
        
        // Add active class to new current slide
        aboutSlides[currentAboutSlide].classList.add('active');
        
        // Remove exit class after animation completes
        setTimeout(() => {
            aboutSlides[previousAboutSlide].classList.remove('exit');
        }, 2000);
        
        // Reset the interval to prevent immediate auto-advance
        if (aboutSliderInterval) {
            clearInterval(aboutSliderInterval);
            startAboutSlider();
        }
    }
    
    // Function to go to previous slide for about slider
    function goToPrevAboutSlide() {
        if (!isAboutSectionVisible) return;
        
        // Store previous slide index
        previousAboutSlide = currentAboutSlide;
        
        // Move to previous slide or to last
        currentAboutSlide = (currentAboutSlide - 1 + totalAboutSlides) % totalAboutSlides;
        
        // Remove any existing animation classes first
        aboutSlides.forEach(slide => {
            slide.classList.remove('exit', 'exit-reverse', 'active-reverse');
        });
        
        // Add exit-reverse class to the previous slide for reverse animation
        aboutSlides[previousAboutSlide].classList.remove('active');
        aboutSlides[previousAboutSlide].classList.add('exit-reverse');
        
        // Add active class to new current slide with reverse entry
        aboutSlides[currentAboutSlide].classList.add('active-reverse');
        aboutSlides[currentAboutSlide].classList.add('active');
        
        // Remove classes after animation completes
        setTimeout(() => {
            aboutSlides[previousAboutSlide].classList.remove('exit-reverse');
            aboutSlides[currentAboutSlide].classList.remove('active-reverse');
        }, 2000);
        
        // Reset the interval to prevent immediate auto-advance
        if (aboutSliderInterval) {
            clearInterval(aboutSliderInterval);
            startAboutSlider();
        }
    }
    
    // Get the about slider container
    const aboutSliderContainer = document.querySelector('.about-slider-container');
    
    // Add click event for about slider
    aboutSliderContainer.addEventListener('click', function(e) {
        // Prevent click from triggering if we're dragging
        if (isAboutDragging) {
            isAboutDragging = false;
            return;
        }
        
        goToNextAboutSlide();
    });
    
    // Touch events for about slider
    aboutSliderContainer.addEventListener('touchstart', function(e) {
        aboutTouchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    
    aboutSliderContainer.addEventListener('touchend', function(e) {
        aboutTouchEndX = e.changedTouches[0].screenX;
        handleAboutSwipe();
    }, { passive: true });
    
    // Mouse events for about slider (for drag/swipe with mouse)
    aboutSliderContainer.addEventListener('mousedown', function(e) {
        aboutMouseStartX = e.clientX;
        isAboutDragging = false;
    });
    
    aboutSliderContainer.addEventListener('mousemove', function(e) {
        if (e.buttons === 1) { // Left mouse button is pressed
            isAboutDragging = true;
        }
    });
    
    aboutSliderContainer.addEventListener('mouseup', function(e) {
        if (isAboutDragging) {
            aboutMouseEndX = e.clientX;
            handleAboutMouseSwipe();
        }
    });
    
    // Handle touch swipe for about slider
    function handleAboutSwipe() {
        const swipeThreshold = 50; // Minimum distance required for a swipe
        const swipeDistance = aboutTouchEndX - aboutTouchStartX;
        
        if (swipeDistance > swipeThreshold) {
            // Swiped right - go to previous slide
            goToPrevAboutSlide();
        } else if (swipeDistance < -swipeThreshold) {
            // Swiped left - go to next slide
            goToNextAboutSlide();
        }
    }
    
    // Handle mouse swipe for about slider
    function handleAboutMouseSwipe() {
        const swipeThreshold = 50; // Minimum distance required for a swipe
        const swipeDistance = aboutMouseEndX - aboutMouseStartX;
        
        if (swipeDistance > swipeThreshold) {
            // Swiped right - go to previous slide
            goToPrevAboutSlide();
        } else if (swipeDistance < -swipeThreshold) {
            // Swiped left - go to next slide
            goToNextAboutSlide();
        }
        
        isAboutDragging = false;
    }
    
    // Set up Intersection Observer for hero section
    const heroSection = document.querySelector('.hero');
    if (heroSection) {
        const heroObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                isHeroSectionVisible = entry.isIntersecting;
                
                if (isHeroSectionVisible) {
                    startSlider();
                } else {
                    clearInterval(sliderInterval);
                }
            });
        }, { threshold: 0.3 }); // Trigger when at least 30% of the section is visible
        
        heroObserver.observe(heroSection);
    }
    
    // Set up Intersection Observer for about section
    const aboutSection = document.querySelector('.about');
    if (aboutSection) {
        const aboutObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                isAboutSectionVisible = entry.isIntersecting;
                
                if (isAboutSectionVisible) {
                    startAboutSlider();
                } else {
                    clearInterval(aboutSliderInterval);
                }
            });
        }, { threshold: 0.3 }); // Trigger when at least 30% of the section is visible
        
        aboutObserver.observe(aboutSection);
    }
    
    // Pause slider on hover (only on desktop)
    const sliderContainer = document.querySelector('.text-slider-container');
    if (sliderContainer && !isMobile) {
        sliderContainer.addEventListener('mouseenter', () => {
            clearInterval(sliderInterval);
        });
        
        sliderContainer.addEventListener('mouseleave', () => {
            if (isHeroSectionVisible) {
                startSlider();
            }
        });
    }
    
    // Pause about slider on hover
    aboutSliderContainer.addEventListener('mouseenter', () => {
        clearInterval(aboutSliderInterval);
    });
    
    aboutSliderContainer.addEventListener('mouseleave', () => {
        if (isAboutSectionVisible) {
            startAboutSlider();
        }
    });
    
    // Language translations
    const translations = {
        en: {
            'service1': 'Knowledge Preservation Training',
            'service1-desc': 'Creating clear and structured content to ensure continuity and effective knowledge sharing.',
            'service2': 'Technical Training',
            'service2-desc': 'Visual guides, videos, and customized solutions tailored to your needs.',
            'service3': 'Customized AI Solutions',
            'service3-desc': 'Utilizing artificial intelligence to enhance training processes and automate technical content.',
            'service4': 'Technical Writing and Translation',
            'service4-desc': 'Professional documentation, user-friendly guides, and precise technical content in multiple languages.',
            'service5': 'Technical Animations',
            'service5-desc': 'Creating advanced simulation videos that illustrate processes and products in a clear and visual way.',
            'service6': 'Organic Effectiveness Processes',
            'service6-desc': 'We use the Lean Six Sigma methodology to improve processes and increase efficiency.'
        },
        he: {
            'service1': 'הכשרת שימור ידע',
            'service1-desc': 'יצירת תוכן ברור ומובנה כדי להבטיח המשכיות ושיתוף ידע יעיל.',
            'service2': 'הכשרה טכנית',
            'service2-desc': 'מדריכים ויזואליים, סרטונים ופתרונות מותאמים אישית לצרכים שלך.',
            'service3': 'פתרונות AI מותאמים אישית',
            'service3-desc': 'שימוש בבינה מלאכותית לשיפור תהליכי הדרכה ואוטומציה של תוכן טכני.',
            'service4': 'כתיבה טכנית ותרגום',
            'service4-desc': 'תיעוד מקצועי, מדריכים ידידותיים למשתמש ותוכן טכני מדויק במספר שפות.',
            'service5': 'אנימציות טכניות',
            'service5-desc': 'יצירת סרטוני סימולציה מתקדמים המדגימים תהליכים ומוצרים בצורה ברורה וויזואלית.',
            'service6': 'תהליכי יעילות אורגניים',
            'service6-desc': 'אנו משתמשים במתודולוגיית Lean Six Sigma לשיפור תהליכים והגדלת היעילות.'
        },
        de: {
            'service1': 'Schulungen zur Wissensbewahrung',
            'service1-desc': 'Klare und strukturierte Inhalte erstellen, um Kontinuität und effektiven Wissensaustausch zu gewährleisten.',
            'service2': 'Technische Schulungen',
            'service2-desc': 'Visuelle Anleitungen, Videos und maßgeschneiderte Lösungen, die auf Ihre Bedürfnisse zugeschnitten sind.',
            'service3': 'Individuelle KI-Lösungen',
            'service3-desc': 'Nutzung künstlicher Intelligenz zur Verbesserung von Schulungsprozessen und zur Automatisierung technischer Inhalte.',
            'service4': 'Technische Dokumentation und Übersetzung',
            'service4-desc': 'Professionelle Dokumentation, benutzerfreundliche Anleitungen und präzise technische Inhalte in mehreren Sprachen.',
            'service5': 'Technische Animationen',
            'service5-desc': 'Erstellung fortschrittlicher Simulationsvideos, die Prozesse und Produkte klar und anschaulich darstellen.',
            'service6': 'Organische Effektivitätsprozesse',
            'service6-desc': 'Wir verwenden die Lean Six Sigma-Methodik, um Prozesse zu verbessern und die Effizienz zu steigern.'
        },
        zh: {
            'service1': '知识保存培训',
            'service1-desc': '创建清晰、结构化的内容，确保知识的连续性和有效共享。',
            'service2': '技术培训',
            'service2-desc': '视觉指南、视频和定制解决方案，满足您的需求。',
            'service3': '定制 AI 解决方案',
            'service3-desc': '利用人工智能增强培训流程并自动化技术内容。',
            'service4': '技术写作和翻译',
            'service4-desc': '专业文档、用户友好指南和多种语言的精确技术内容。',
            'service5': '技术动画',
            'service5-desc': '创建高级模拟视频，以清晰直观的方式说明流程和产品。',
            'service6': '有机效率流程',
            'service6-desc': '我们使用精益六西格玛方法来改进流程并提高效率。'
        }
    };

    // Language switcher
    const langButtons = document.querySelectorAll('.lang-btn');
    
    langButtons.forEach(button => {
        button.addEventListener('click', function() {
            const lang = this.getAttribute('data-lang');
            setLanguage(lang);
            
            // Update active button
            langButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
        });
    });

    function setLanguage(lang) {
        const elements = document.querySelectorAll('[data-key]');
        
        elements.forEach(element => {
            const key = element.getAttribute('data-key');
            if (translations[lang] && translations[lang][key]) {
                element.textContent = translations[lang][key];
            }
        });

        // Set text direction for Hebrew
        if (lang === 'he') {
            document.body.setAttribute('dir', 'rtl');
        } else {
            document.body.setAttribute('dir', 'ltr');
        }
    }

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 100,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Contact form submission handler
    const contactForm = document.getElementById('contactForm');
    const formStatus = document.getElementById('form-status');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;
            
            // Update the reply-to field with the user's email
            const replyToField = contactForm.querySelector('input[name="_replyto"]');
            if (replyToField) {
                replyToField.value = email;
            }
            
            // Show sending status
            formStatus.textContent = "Sending message...";
            formStatus.style.color = "#0066cc";
            
            // Function to create mailto fallback
            const openEmailClient = () => {
                // Get the email address from the contact info
                const recipientEmail = 'Avi@navitechaid.com';
                
                // Create email subject and body
                const subject = `NaviTechAid Contact Form: ${name}`;
                const body = `Name: ${name}%0D%0AEmail: ${email}%0D%0A%0D%0AMessage:%0D%0A${message}`;
                
                // Create mailto link
                const mailtoLink = `mailto:${recipientEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
                
                // Open email client
                window.location.href = mailtoLink;
            };
            
            // Set a timeout for the API call - if it takes longer than 10 seconds, offer the fallback
            let timeoutId = setTimeout(() => {
                formStatus.innerHTML = "The server is taking too long to respond. <a href='#' id='email-fallback'>Click here</a> to send via email client instead.";
                formStatus.style.color = "#ff9800";
                
                // Add event listener to the fallback link
                document.getElementById('email-fallback').addEventListener('click', function(e) {
                    e.preventDefault();
                    openEmailClient();
                });
            }, 10000); // 10 second timeout
            
            // Send the form using fetch API
            fetch(contactForm.action, {
                method: contactForm.method,
                body: new FormData(contactForm),
                headers: {
                    'Accept': 'application/json'
                }
            })
            .then(response => {
                // Clear the timeout since we got a response
                clearTimeout(timeoutId);
                
                if (response.ok) {
                    return response.json();
                }
                throw new Error('Network response was not ok.');
            })
            .then(data => {
                // Show success message
                formStatus.textContent = "Thank you! Your message has been sent.";
                formStatus.style.color = "#4CAF50";
                
                // Reset form
                contactForm.reset();
                
                // Clear status message after 5 seconds
                setTimeout(() => {
                    formStatus.textContent = "";
                }, 5000);
            })
            .catch(error => {
                // Clear the timeout since we got an error response
                clearTimeout(timeoutId);
                
                // Show error message with fallback option
                formStatus.innerHTML = "There was a problem sending your message. <a href='#' id='email-fallback'>Click here</a> to open your email client instead.";
                formStatus.style.color = "#f44336";
                console.error('Error:', error);
                
                // Add event listener to the fallback link
                document.getElementById('email-fallback').addEventListener('click', function(e) {
                    e.preventDefault();
                    openEmailClient();
                });
            });
        });
    }

    // Scroll animation for service cards
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe service cards
    document.querySelectorAll('.service-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(card);
    });

    // Add animation class
    document.documentElement.style.setProperty('--animate-in', `
        opacity: 1;
        transform: translateY(0);
    `);

    // Add CSS rule for animation
    const style = document.createElement('style');
    style.textContent = `
        .animate-in {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(style);

    // Shrinking header on mobile scroll
    const header = document.querySelector('header');
    let lastScrollTop = 0;
    
    function handleHeaderOnScroll() {
        const isMobileView = window.innerWidth <= 768;
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (isMobileView) {
            if (scrollTop > 50) {
                // User has scrolled down more than 50px
                header.classList.add('header-scrolled');
            } else {
                // User is at the top of the page
                header.classList.remove('header-scrolled');
            }
        } else {
            // On desktop, always show the full header
            header.classList.remove('header-scrolled');
        }
        
        lastScrollTop = scrollTop;
    }
    
    // Add scroll event listener
    window.addEventListener('scroll', handleHeaderOnScroll);
    
    // Also check on resize to handle device orientation changes
    window.addEventListener('resize', handleHeaderOnScroll);
    
    // Initial check
    handleHeaderOnScroll();
    
    // Add particle background system
    function initParticleSystem() {
        const canvas = document.createElement('canvas');
        canvas.id = 'particle-canvas';
        document.body.insertBefore(canvas, document.body.firstChild);
        
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        
        // Style the canvas
        canvas.style.position = 'fixed';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.zIndex = '-1';
        canvas.style.pointerEvents = 'none';
        
        // Particle settings
        const particlesArray = [];
        const numberOfParticles = 100;
        const colors = ['rgba(0, 102, 204, 0.3)', 'rgba(0, 170, 255, 0.3)', 'rgba(0, 51, 102, 0.3)'];
        
        // Mouse position
        let mouse = {
            x: null,
            y: null,
            radius: 150
        };
        
        window.addEventListener('mousemove', function(event) {
            mouse.x = event.x;
            mouse.y = event.y;
        });
        
        // Create particle class
        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 5 + 1;
                this.baseX = this.x;
                this.baseY = this.y;
                this.density = (Math.random() * 30) + 1;
                this.color = colors[Math.floor(Math.random() * colors.length)];
            }
            
            draw() {
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.closePath();
                ctx.fill();
            }
            
            update() {
                // Check if mouse is close enough to affect this particle
                if (mouse.x != null && mouse.y != null) {
                    let dx = mouse.x - this.x;
                    let dy = mouse.y - this.y;
                    let distance = Math.sqrt(dx * dx + dy * dy);
                    let forceDirectionX = dx / distance;
                    let forceDirectionY = dy / distance;
                    
                    // Max distance, past that the force will be 0
                    const maxDistance = 150; // Increased from 100 to create a wider area of influence
                    let force = (maxDistance - distance) / maxDistance;
                    
                    // If we're close enough, calculate the force
                    if (distance < maxDistance) {
                        // Reduce the force by multiplying by a smaller factor (0.3 instead of 1)
                        // This makes the movement more subtle and less jumpy
                        this.x += forceDirectionX * force * this.density * 0.3;
                        this.y += forceDirectionY * force * this.density * 0.3;
                    } else {
                        // If we're too far, slowly return to base position
                        // Make the return to base position more gradual (30 instead of 20)
                        if (this.x !== this.baseX) {
                            let dx = this.x - this.baseX;
                            this.x -= dx/30;
                        }
                        if (this.y !== this.baseY) {
                            let dy = this.y - this.baseY;
                            this.y -= dy/30;
                        }
                    }
                }
                this.draw();
            }
        }
        
        // Create particles
        function init() {
            particlesArray.length = 0;
            for (let i = 0; i < numberOfParticles; i++) {
                particlesArray.push(new Particle());
            }
        }
        
        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            for (let i = 0; i < particlesArray.length; i++) {
                particlesArray[i].update();
            }
            // Connect particles with lines if they're close enough
            connectParticles();
            requestAnimationFrame(animate);
        }
        
        // Connect nearby particles with lines
        function connectParticles() {
            let opacityValue = 1;
            for (let a = 0; a < particlesArray.length; a++) {
                for (let b = a; b < particlesArray.length; b++) {
                    let distance = ((particlesArray[a].x - particlesArray[b].x) * (particlesArray[a].x - particlesArray[b].x)) +
                                  ((particlesArray[a].y - particlesArray[b].y) * (particlesArray[a].y - particlesArray[b].y));
                    
                    if (distance < (canvas.width/7) * (canvas.height/7)) {
                        opacityValue = 1 - (distance/20000);
                        ctx.strokeStyle = 'rgba(0, 102, 204,' + opacityValue + ')';
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                        ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                        ctx.stroke();
                    }
                }
            }
        }
        
        // Handle window resize
        window.addEventListener('resize', function() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            init();
        });
        
        // Reset mouse position when mouse leaves window
        window.addEventListener('mouseout', function() {
            mouse.x = undefined;
            mouse.y = undefined;
        });
        
        init();
        animate();
    }

    // Call the particle system initialization
    initParticleSystem();

    // Add interactive logo animation
    function initLogoAnimation() {
        const logo = document.querySelector('.logo');
        const logoContainer = document.querySelector('.logo-container');
        
        if (!logo || !logoContainer) return;
        
        // Simply place the logo in the container without animations
        // Keep the original logo in place without any animation wrappers
        
        // Disable all animation and interaction effects
        logo.style.transform = 'none';
        logo.style.transition = 'none';
    }
    
    // Call the logo animation initialization
    initLogoAnimation();

    // Add parallax scrolling effect to process section
    function initParallaxEffect() {
        const processSection = document.querySelector('.process');
        const processSteps = document.querySelectorAll('.process-step');
        
        if (!processSection || processSteps.length === 0) return;
        
        // Add a background element for parallax effect
        const parallaxBg = document.createElement('div');
        parallaxBg.className = 'parallax-bg';
        processSection.prepend(parallaxBg);
        
        // Create floating elements in the background
        for (let i = 0; i < 15; i++) {
            const floatingElement = document.createElement('div');
            floatingElement.className = 'floating-element';
            
            // Randomize properties
            floatingElement.style.left = `${Math.random() * 100}%`;
            floatingElement.style.top = `${Math.random() * 100}%`;
            floatingElement.style.animationDelay = `${Math.random() * 5}s`;
            floatingElement.style.animationDuration = `${Math.random() * 10 + 10}s`;
            floatingElement.style.opacity = Math.random() * 0.5 + 0.1;
            floatingElement.style.width = `${Math.random() * 30 + 10}px`;
            floatingElement.style.height = floatingElement.style.width;
            
            // Random shapes
            const shapes = ['circle', 'square', 'triangle'];
            const shape = shapes[Math.floor(Math.random() * shapes.length)];
            floatingElement.classList.add(shape);
            
            parallaxBg.appendChild(floatingElement);
        }
        
        // Add parallax effect on scroll
        window.addEventListener('scroll', () => {
            const scrollPosition = window.scrollY;
            const sectionTop = processSection.offsetTop;
            const sectionHeight = processSection.offsetHeight;
            
            // Only apply effect when the section is in view
            if (scrollPosition > sectionTop - window.innerHeight && 
                scrollPosition < sectionTop + sectionHeight) {
                
                // Calculate how far we've scrolled into the section
                const scrollIntoSection = scrollPosition - (sectionTop - window.innerHeight);
                const scrollPercentage = scrollIntoSection / (sectionHeight + window.innerHeight);
                
                // Apply parallax effect to background
                parallaxBg.style.transform = `translateY(${scrollPercentage * 100}px)`;
                
                // Apply staggered animation to process steps
                processSteps.forEach((step, index) => {
                    const delay = index * 0.1;
                    const translateY = Math.max(0, 50 * (1 - Math.min(1, scrollPercentage * 2 - delay)));
                    const opacity = Math.min(1, Math.max(0, scrollPercentage * 3 - delay));
                    
                    step.style.transform = `translateY(${translateY}px)`;
                    step.style.opacity = opacity;
                });
            }
        });
        
        // Add 3D tilt effect to process steps
        processSteps.forEach(step => {
            step.addEventListener('mousemove', (e) => {
                const rect = step.getBoundingClientRect();
                const x = e.clientX - rect.left; // x position within the element
                const y = e.clientY - rect.top; // y position within the element
                
                // Calculate rotation based on mouse position
                const xRotation = ((y / rect.height) - 0.5) * 10; // -5 to 5 degrees
                const yRotation = ((x / rect.width) - 0.5) * -10; // -5 to 5 degrees
                
                // Apply the rotation
                step.style.transform = `perspective(1000px) rotateX(${xRotation}deg) rotateY(${yRotation}deg) scale(1.05)`;
                
                // Add glow effect based on mouse position
                const glowX = (x / rect.width) * 100;
                const glowY = (y / rect.height) * 100;
                step.style.background = `radial-gradient(circle at ${glowX}% ${glowY}%, rgba(0, 170, 255, 0.1) 0%, rgba(255, 255, 255, 0) 60%), white`;
            });
            
            // Reset on mouse leave
            step.addEventListener('mouseleave', () => {
                step.style.transform = '';
                step.style.background = '';
            });
        });
    }

    // Call the parallax effect initialization
    initParallaxEffect();

    // Add animated scroll progress indicator
    function initScrollProgressIndicator() {
        // Create the progress bar container
        const progressContainer = document.createElement('div');
        progressContainer.className = 'scroll-progress-container';
        
        // Create the progress bar
        const progressBar = document.createElement('div');
        progressBar.className = 'scroll-progress-bar';
        
        // Add to the DOM
        progressContainer.appendChild(progressBar);
        document.body.appendChild(progressContainer);
        
        // Update progress on scroll
        window.addEventListener('scroll', () => {
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight;
            const scrollTop = window.scrollY;
            
            // Calculate scroll percentage
            const scrollPercentage = (scrollTop / (documentHeight - windowHeight)) * 100;
            
            // Update progress bar width
            progressBar.style.width = `${scrollPercentage}%`;
            
            // Add glow effect when scrolling
            progressBar.classList.add('active');
            
            // Remove glow effect after scrolling stops
            clearTimeout(window.scrollTimeout);
            window.scrollTimeout = setTimeout(() => {
                progressBar.classList.remove('active');
            }, 1000);
        });
    }

    // Call the scroll progress indicator initialization
    initScrollProgressIndicator();

    // Add animated text reveal on scroll
    function initAnimatedTextReveal() {
        // Get all section titles and other important text elements
        const textElements = document.querySelectorAll('.section-title, .service-title, .process-step h3, .hero h1, .hero p');
        
        // Create Intersection Observer
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                // If element is in viewport
                if (entry.isIntersecting) {
                    // Add animation class
                    entry.target.classList.add('text-revealed');
                    // Unobserve after animation is triggered
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.2, // Trigger when 20% of the element is visible
            rootMargin: '0px 0px -50px 0px' // Adjust trigger point (negative value means trigger earlier)
        });
        
        // Prepare each text element for animation
        textElements.forEach(element => {
            // Skip elements that already have animation
            if (element.classList.contains('text-prepared')) return;
            
            // Store the original HTML and text content
            const originalHTML = element.innerHTML;
            
            // Mark as prepared
            element.classList.add('text-prepared');
            
            // Create a wrapper for the text animation
            const wrapper = document.createElement('div');
            wrapper.className = 'text-reveal-wrapper';
            
            // Add original HTML with spans around each word
            const words = originalHTML.split(' ');
            const animatedHTML = words.map((word, index) => {
                return `<span class="text-reveal-word" style="animation-delay: ${index * 0.1}s">${word}</span>`;
            }).join(' ');
            
            wrapper.innerHTML = animatedHTML;
            
            // Clear the element and add the wrapper
            element.innerHTML = '';
            element.appendChild(wrapper);
            
            // Start observing the element
            observer.observe(element);
        });
    }

    // Call the animated text reveal initialization
    initAnimatedTextReveal();

    // Add animated scroll-to-top button
    function initScrollToTopButton() {
        // Create the button
        const scrollTopBtn = document.createElement('button');
        scrollTopBtn.className = 'scroll-top-btn';
        scrollTopBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="none" d="M0 0h24v24H0z"/><path d="M12 10.828l-4.95 4.95-1.414-1.414L12 8l6.364 6.364-1.414 1.414z" fill="currentColor"/></svg>';
        scrollTopBtn.setAttribute('aria-label', 'Scroll to top');
        
        // Add to the DOM
        document.body.appendChild(scrollTopBtn);
        
        // Show/hide button based on scroll position
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                scrollTopBtn.classList.add('visible');
            } else {
                scrollTopBtn.classList.remove('visible');
            }
            
            // Add pulse animation when near bottom of page
            const scrollHeight = document.documentElement.scrollHeight;
            const scrollPosition = window.scrollY + window.innerHeight;
            const scrollPercentage = scrollPosition / scrollHeight;
            
            if (scrollPercentage > 0.9) {
                scrollTopBtn.classList.add('pulse');
            } else {
                scrollTopBtn.classList.remove('pulse');
            }
        });
        
        // Scroll to top with smooth animation when clicked
        scrollTopBtn.addEventListener('click', () => {
            // Add rotation animation on click
            scrollTopBtn.classList.add('rotate');
            
            // Smooth scroll to top
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
            
            // Remove rotation after animation completes
            setTimeout(() => {
                scrollTopBtn.classList.remove('rotate');
            }, 500);
        });
    }

    // Call the scroll-to-top button initialization
    initScrollToTopButton();

    // Add treasure map path animation for the process section
    function initTreasureMapPath() {
        const processSection = document.querySelector('.process');
        if (!processSection) return;
        
        const treasureMapContainer = document.querySelector('.treasure-map-container');
        const pathSvg = document.getElementById('path-svg');
        const journeyPath = document.getElementById('journey-path');
        const pathFollower = document.getElementById('path-follower');
        const processSteps = document.querySelectorAll('.process-step');
        
        if (!pathSvg || !journeyPath || !pathFollower || processSteps.length === 0) return;
        
        // Create a vehicle element that will follow the path
        let vehicle = document.querySelector('.path-vehicle');
        if (!vehicle) {
            vehicle = document.createElement('div');
            vehicle.className = 'path-vehicle';
            treasureMapContainer.appendChild(vehicle);
        }
        
        // Make the path follower invisible (used only for calculations)
        pathFollower.setAttribute('visibility', 'hidden');
        pathFollower.style.visibility = 'hidden';
        
        // Function to get marker center positions
        function getMarkerPositions() {
            const positions = [];
            processSteps.forEach(step => {
                const marker = step.querySelector('.step-marker');
                if (marker) {
                    const rect = marker.getBoundingClientRect();
                    const mapRect = pathSvg.getBoundingClientRect();
                    
                    // Calculate position relative to the SVG
                    const x = rect.left + rect.width / 2 - mapRect.left;
                    const y = rect.top + rect.height / 2 - mapRect.top;
                    
                    positions.push({ x, y });
                }
            });
            return positions;
        }
        
        // Function to create a curved path between points
        function createPath(points) {
            if (points.length < 2) return '';
            
            let pathD = `M${points[0].x},${points[0].y}`;
            
            for (let i = 0; i < points.length - 1; i++) {
                const current = points[i];
                const next = points[i + 1];
                const midX = (current.x + next.x) / 2;
                
                // Create a curved path with control points
                // Ensure consistent curve direction based on step position
                if (i % 2 === 0) {
                    // Path curves down
                    pathD += ` C${midX},${current.y + 50} ${midX},${next.y - 50} ${next.x},${next.y}`;
                } else {
                    // Path curves up
                    pathD += ` C${midX},${current.y - 50} ${midX},${next.y + 50} ${next.x},${next.y}`;
                }
            }
            
            return pathD;
        }
        
        // Function to animate the vehicle along the path
        function animateVehicle() {
            // Make sure the vehicle is visible
            vehicle.style.display = 'block';
            vehicle.style.opacity = '1';
            
            // Create animation variables
            let startTime = null;
            const duration = 30000; // 30 seconds for one complete journey (slowed down from 20 seconds)
            
            // Manual animation function using requestAnimationFrame for better browser support
            function animateFrame(timestamp) {
                if (!startTime) startTime = timestamp;
                const elapsed = timestamp - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                // If we've completed a cycle, restart
                if (progress >= 1) {
                    startTime = timestamp;
                }
                
                // Calculate position along the path
                const pathLength = journeyPath.getTotalLength();
                const point = journeyPath.getPointAtLength(progress * pathLength);
                
                // Calculate the next point for rotation
                const lookAheadPoint = journeyPath.getPointAtLength(Math.min((progress + 0.01) * pathLength, pathLength));
                
                // Calculate angle for rotation
                const angle = Math.atan2(lookAheadPoint.y - point.y, lookAheadPoint.x - point.x) * 180 / Math.PI;
                
                // Position the vehicle relative to the SVG
                const svgRect = pathSvg.getBoundingClientRect();
                const mapRect = treasureMapContainer.getBoundingClientRect();
                
                // Calculate position relative to the map container
                const x = point.x + (svgRect.left - mapRect.left);
                const y = point.y + (svgRect.top - mapRect.top);
                
                // Update vehicle position and rotation
                vehicle.style.left = `${x - 20}px`; // Adjust for vehicle size
                vehicle.style.top = `${y - 15}px`; // Adjust for vehicle size
                vehicle.style.transform = `rotate(${angle}deg)`;
                
                // Continue the animation
                requestAnimationFrame(animateFrame);
            }
            
            // Start the animation
            requestAnimationFrame(animateFrame);
        }
        
        // Function to update the path when window resizes
        function updatePath() {
            const positions = getMarkerPositions();
            
            // Ensure we have valid positions for all steps
            if (positions.length < processSteps.length) {
                console.warn("Not all step positions could be determined");
                return;
            }
            
            const pathD = createPath(positions);
            
            // Update the path
            journeyPath.setAttribute('d', pathD);
            journeyPath.setAttribute('stroke', '#8B4513'); // Brown color for road
            journeyPath.setAttribute('stroke-width', '12'); // Wider for road
            
            // Create specific path segments for steps 2-3 and 4-5 to ensure visibility
            const segment23 = document.getElementById('path-segment-2-3');
            const segment45 = document.getElementById('path-segment-4-5');
            
            // If segments don't exist, create them
            if (!segment23) {
                const segment23Path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                segment23Path.id = 'path-segment-2-3';
                segment23Path.setAttribute('class', 'critical-path-segment');
                pathSvg.appendChild(segment23Path);
            }
            
            if (!segment45) {
                const segment45Path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                segment45Path.id = 'path-segment-4-5';
                segment45Path.setAttribute('class', 'critical-path-segment');
                pathSvg.appendChild(segment45Path);
            }
            
            // Update or create the specific segments for steps 2-3 and 4-5
            if (positions.length >= 5) {
                // Create path for segment 2-3 (index 1 to 2)
                const segment23Path = document.getElementById('path-segment-2-3');
                const p1 = positions[1]; // Step 2
                const p2 = positions[2]; // Step 3
                const midX23 = (p1.x + p2.x) / 2;
                
                // Create path data for segment 2-3
                let pathD23 = `M${p1.x},${p1.y}`;
                pathD23 += ` C${midX23},${p1.y + 50} ${midX23},${p2.y - 50} ${p2.x},${p2.y}`;
                
                segment23Path.setAttribute('d', pathD23);
                segment23Path.setAttribute('stroke', '#8B4513');
                segment23Path.setAttribute('stroke-width', '14'); // Slightly wider than main path
                segment23Path.setAttribute('fill', 'none');
                segment23Path.setAttribute('stroke-linecap', 'round');
                segment23Path.setAttribute('stroke-linejoin', 'round');
                segment23Path.style.opacity = '1';
                
                // Create path for segment 4-5 (index 3 to 4)
                const segment45Path = document.getElementById('path-segment-4-5');
                const p3 = positions[3]; // Step 4
                const p4 = positions[4]; // Step 5
                const midX45 = (p3.x + p4.x) / 2;
                
                // Create path data for segment 4-5
                let pathD45 = `M${p3.x},${p3.y}`;
                pathD45 += ` C${midX45},${p3.y - 50} ${midX45},${p4.y + 50} ${p4.x},${p4.y}`;
                
                segment45Path.setAttribute('d', pathD45);
                segment45Path.setAttribute('stroke', '#8B4513');
                segment45Path.setAttribute('stroke-width', '14'); // Slightly wider than main path
                segment45Path.setAttribute('fill', 'none');
                segment45Path.setAttribute('stroke-linecap', 'round');
                segment45Path.setAttribute('stroke-linejoin', 'round');
                segment45Path.style.opacity = '1';
            }
            
            // Set the path for the follower
            pathFollower.style.offsetPath = `path('${pathD}')`;
            
            // Start the animation
            animateVehicle();
        }
        
        // Initialize the path
        updatePath();
        
        // Update on window resize
        window.addEventListener('resize', updatePath);
        
        // Add scroll-based animation
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Add animation class when section is visible
                    processSection.classList.add('map-visible');
                    
                    // Animate each step with a delay
                    processSteps.forEach((step, index) => {
                        setTimeout(() => {
                            step.classList.add('step-visible');
                        }, 300 * index);
                    });
                    
                    // Force path update after steps are visible
                    setTimeout(() => {
                        updatePath();
                    }, 300 * processSteps.length + 100);
                    
                    // Unobserve after animation is triggered
                    observer.unobserve(processSection);
                }
            });
        }, {
            threshold: 0.2
        });
        
        // Start observing
        observer.observe(processSection);
    }

    // Call the treasure map path initialization
    initTreasureMapPath();
});
