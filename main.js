/**
 * Main JavaScript for Feng Shui Intelligence Website
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize mobile menu
    initMobileMenu();
    
    // Initialize smooth scrolling
    initSmoothScroll();
    
    // Initialize file upload functionality
    initFileUpload();
    
    // Initialize animations
    initAnimations();
    
    // Initialize compass rotation
    initCompassRotation();
    
    // Initialize five elements animations
    initFiveElementsAnimations();
    
    // Initialize AI chat box
    initAIChatBox();
});

/**
 * Mobile menu functionality
 */
function initMobileMenu() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const nav = document.querySelector('nav');
    
    if (mobileMenuBtn && nav) {
        mobileMenuBtn.addEventListener('click', function() {
            nav.classList.toggle('active');
            
            // Change menu icon based on state
            const isOpen = nav.classList.contains('active');
            mobileMenuBtn.innerHTML = isOpen ? '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!nav.contains(event.target) && !mobileMenuBtn.contains(event.target) && nav.classList.contains('active')) {
                nav.classList.remove('active');
                mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
            }
        });
    }
}

/**
 * Smooth scrolling for anchor links
 */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Close mobile menu if open
                const nav = document.querySelector('nav');
                if (nav && nav.classList.contains('active')) {
                    nav.classList.remove('active');
                    document.querySelector('.mobile-menu-btn').innerHTML = '<i class="fas fa-bars"></i>';
                }
                
                // Scroll to target
                window.scrollTo({
                    top: targetElement.offsetTop - 80, // Adjust for header height
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * File upload functionality
 */
function initFileUpload() {
    // Skip initialization if we're on the upload.html page to avoid duplicate event listeners
    if (window.location.pathname.includes('upload.html')) {
        return;
    }
    
    const uploadArea = document.querySelector('.upload-area');
    const fileInput = document.querySelector('#fileInput') || document.querySelector('#file-upload');
    const browseButton = document.querySelector('#browseButton');
    const uploadBtn = document.querySelector('.upload-btn');
    
    if (uploadArea && fileInput) {
        // Handle click on upload area
        uploadArea.addEventListener('click', (e) => {
            // Don't trigger if clicking on the browse button itself
            if (e.target !== browseButton) {
                fileInput.click();
            }
        });
        
        // Handle click on browse button
        if (browseButton) {
            browseButton.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                fileInput.click();
            });
        }
        
        // Handle click on upload button (for other pages)
        if (uploadBtn) {
            uploadBtn.addEventListener('click', function() {
                fileInput.click();
            });
        }
        
        // Handle drag and drop
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            uploadArea.addEventListener(eventName, preventDefaults, false);
        });
        
        function preventDefaults(e) {
            e.preventDefault();
            e.stopPropagation();
        }
        
        ['dragenter', 'dragover'].forEach(eventName => {
            uploadArea.addEventListener(eventName, highlight, false);
        });
        
        ['dragleave', 'drop'].forEach(eventName => {
            uploadArea.addEventListener(eventName, unhighlight, false);
        });
        
        function highlight() {
            uploadArea.classList.add('highlight');
        }
        
        function unhighlight() {
            uploadArea.classList.remove('highlight');
        }
        
        // Handle file drop
        uploadArea.addEventListener('drop', handleDrop, false);
        
        function handleDrop(e) {
            const dt = e.dataTransfer;
            const files = dt.files;
            handleFiles(files);
        }
        
        // Handle file selection
        fileInput.addEventListener('change', function() {
            handleFiles(this.files);
        });
        
        function handleFiles(files) {
            if (files.length > 0) {
                // Display file name and preview if it's an image
                const file = files[0];
                displayFileInfo(file);
                
                if (file.type.startsWith('image/')) {
                    previewImage(file);
                    
                    // Enable analyze button if it exists
                    const analyzeButton = document.getElementById('analyzeButton');
                    if (analyzeButton) {
                        analyzeButton.disabled = false;
                    }
                }
            }
        }
        
        function displayFileInfo(file) {
            const infoElement = document.querySelector('.upload-info') || document.createElement('div');
            infoElement.className = 'upload-info';
            infoElement.innerHTML = `
                <p><strong>File:</strong> ${file.name}</p>
                <p><strong>Size:</strong> ${formatFileSize(file.size)}</p>
                <p><strong>Type:</strong> ${file.type}</p>
            `;
            
            if (!document.querySelector('.upload-info')) {
                uploadArea.appendChild(infoElement);
            }
        }
        
        function formatFileSize(bytes) {
            if (bytes === 0) return '0 Bytes';
            const k = 1024;
            const sizes = ['Bytes', 'KB', 'MB', 'GB'];
            const i = Math.floor(Math.log(bytes) / Math.log(k));
            return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
        }
        
        function previewImage(file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                // Check if we're on the upload page with existing preview elements
                const previewContainer = document.getElementById('previewContainer');
                const previewImage = document.getElementById('previewImage');
                
                if (previewContainer && previewImage) {
                    // Use existing preview elements on upload page
                    previewImage.src = e.target.result;
                    previewContainer.style.display = 'block';
                } else {
                    // Create new preview element for other pages
                    let preview = document.getElementById('upload-preview');
                    if (!preview) {
                        preview = document.createElement('img');
                        preview.id = 'upload-preview';
                        preview.style.maxWidth = '300px';
                        preview.style.marginTop = '1em';
                        preview.style.borderRadius = '8px';
                        preview.style.boxShadow = '0 3px 10px rgba(0,0,0,0.1)';
                        uploadArea.appendChild(preview);
                    }
                    preview.src = e.target.result;
                }
            };
        reader.readAsDataURL(file);
        }
        
        // Handle remove button functionality
        const removeButton = document.getElementById('removeButton');
        if (removeButton) {
            removeButton.addEventListener('click', function() {
                // Clear file input
                fileInput.value = '';
                
                // Hide preview container
                const previewContainer = document.getElementById('previewContainer');
                if (previewContainer) {
                    previewContainer.style.display = 'none';
                }
                
                // Remove custom preview if exists
                const customPreview = document.getElementById('upload-preview');
                if (customPreview) {
                    customPreview.remove();
                }
                
                // Clear upload info
                const uploadInfo = document.querySelector('.upload-info');
                if (uploadInfo) {
                    uploadInfo.remove();
                }
                
                // Disable analyze button
                const analyzeButton = document.getElementById('analyzeButton');
                if (analyzeButton) {
                    analyzeButton.disabled = true;
                }
            });
        }
    }
}

/**
 * Initialize animations
 */
function initAnimations() {
    // Animate elements when they come into view
    const animateElements = document.querySelectorAll('.animate-on-scroll');
    
    if (animateElements.length > 0) {
        // Check if IntersectionObserver is supported
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animated');
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.1 });
            
            animateElements.forEach(element => {
                observer.observe(element);
            });
        } else {
            // Fallback for browsers that don't support IntersectionObserver
            animateElements.forEach(element => {
                element.classList.add('animated');
            });
        }
    }
}

/**
 * Contact form validation and submission
 */
function initContactForm() {
    const contactForm = document.querySelector('#contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Basic validation
            let isValid = true;
            const nameInput = contactForm.querySelector('#name');
            const emailInput = contactForm.querySelector('#email');
            const messageInput = contactForm.querySelector('#message');
            
            // Reset previous error messages
            contactForm.querySelectorAll('.error-message').forEach(el => el.remove());
            
            // Validate name
            if (!nameInput.value.trim()) {
                showError(nameInput, 'Please enter your name');
                isValid = false;
            }
            
            // Validate email
            if (!isValidEmail(emailInput.value)) {
                showError(emailInput, 'Please enter a valid email address');
                isValid = false;
            }
            
            // Validate message
            if (!messageInput.value.trim()) {
                showError(messageInput, 'Please enter your message');
                isValid = false;
            }
            
            if (isValid) {
                // Simulate form submission
                const submitButton = contactForm.querySelector('button[type="submit"]');
                submitButton.disabled = true;
                submitButton.innerHTML = 'Sending...';
                
                // In a real application, you would send the form data to a server here
                setTimeout(() => {
                    contactForm.innerHTML = '<div class="success-message"><i class="fas fa-check-circle"></i><h3>Thank You!</h3><p>Your message has been sent successfully. We will get back to you soon.</p></div>';
                }, 1500);
            }
        });
        
        function showError(input, message) {
            const errorElement = document.createElement('div');
            errorElement.className = 'error-message';
            errorElement.textContent = message;
            input.parentNode.appendChild(errorElement);
            input.classList.add('error');
        }
        
        function isValidEmail(email) {
            const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(String(email).toLowerCase());
        }
    }
}

/**
 * Testimonial slider
 */
function initTestimonialSlider() {
    const testimonialContainer = document.querySelector('.testimonial-slider');
    
    if (testimonialContainer) {
        const testimonials = testimonialContainer.querySelectorAll('.testimonial');
        const totalTestimonials = testimonials.length;
        
        if (totalTestimonials > 1) {
            let currentIndex = 0;
            
            // Create navigation dots
            const dotsContainer = document.createElement('div');
            dotsContainer.className = 'slider-dots';
            
            for (let i = 0; i < totalTestimonials; i++) {
                const dot = document.createElement('span');
                dot.className = 'slider-dot';
                if (i === 0) dot.classList.add('active');
                dot.dataset.index = i;
                dotsContainer.appendChild(dot);
            }
            
            testimonialContainer.appendChild(dotsContainer);
            
            // Add click event to dots
            dotsContainer.querySelectorAll('.slider-dot').forEach(dot => {
                dot.addEventListener('click', function() {
                    const index = parseInt(this.dataset.index);
                    showTestimonial(index);
                });
            });
            
            // Create prev/next buttons
            const prevButton = document.createElement('button');
            prevButton.className = 'slider-btn prev-btn';
            prevButton.innerHTML = '<i class="fas fa-chevron-left"></i>';
            
            const nextButton = document.createElement('button');
            nextButton.className = 'slider-btn next-btn';
            nextButton.innerHTML = '<i class="fas fa-chevron-right"></i>';
            
            testimonialContainer.appendChild(prevButton);
            testimonialContainer.appendChild(nextButton);
            
            // Add click events to buttons
            prevButton.addEventListener('click', () => {
                showTestimonial(currentIndex - 1);
            });
            
            nextButton.addEventListener('click', () => {
                showTestimonial(currentIndex + 1);
            });
            
            // Show testimonial function
            function showTestimonial(index) {
                // Handle index bounds
                if (index < 0) index = totalTestimonials - 1;
                if (index >= totalTestimonials) index = 0;
                
                // Update current index
                currentIndex = index;
                
                // Update testimonial visibility
                testimonials.forEach((testimonial, i) => {
                    testimonial.style.display = i === index ? 'block' : 'none';
                });
                
                // Update dots
                dotsContainer.querySelectorAll('.slider-dot').forEach((dot, i) => {
                    dot.classList.toggle('active', i === index);
                });
            }
            
            // Initialize - show first testimonial
            showTestimonial(0);
            
            // Auto-rotate testimonials
            setInterval(() => {
                showTestimonial(currentIndex + 1);
            }, 5000);
        }
    }
}

/**
 * Initialize compass rotation functionality
 */
function initCompassRotation() {
    const compassImage = document.querySelector('.luo-pan-image');
    
    if (!compassImage) return;
    
    let isDragging = false;
    let startAngle = 0;
    let currentRotation = 0;
    
    // Get center point of the image
    function getCenter(element) {
        const rect = element.getBoundingClientRect();
        return {
            x: rect.left + rect.width / 2,
            y: rect.top + rect.height / 2
        };
    }
    
    // Calculate angle from center to mouse position
    function getAngle(centerX, centerY, mouseX, mouseY) {
        return Math.atan2(mouseY - centerY, mouseX - centerX) * (180 / Math.PI);
    }
    
    // Mouse down event
    compassImage.addEventListener('mousedown', function(e) {
        e.preventDefault();
        isDragging = true;
        
        compassImage.style.cursor = 'grabbing';
        document.body.style.userSelect = 'none';
        compassImage.style.transition = 'none'; // Disable transition during dragging
    });
    
    // Mouse move event
    document.addEventListener('mousemove', function(e) {
        if (!isDragging) return;
        
        const center = getCenter(compassImage);
        const angle = getAngle(center.x, center.y, e.clientX, e.clientY);
        currentRotation = angle;
        
        compassImage.style.transform = `rotate(${currentRotation}deg)`;
    });
    
    // Mouse up event - reset to 0 degrees
    document.addEventListener('mouseup', function() {
        if (isDragging) {
            isDragging = false;
            compassImage.style.cursor = 'grab';
            document.body.style.userSelect = '';
            
            // Reset to 0 degrees with smooth animation
            currentRotation = 0;
            compassImage.style.transition = 'transform 0.5s ease-out';
            compassImage.style.transform = 'rotate(0deg)';
            
            // Reset transition back to none for next drag
            setTimeout(() => {
                compassImage.style.transition = 'none';
            }, 500);
        }
    });
    
    // Touch events for mobile support
    compassImage.addEventListener('touchstart', function(e) {
        e.preventDefault();
        isDragging = true;
        compassImage.style.transition = 'none'; // Disable transition during dragging
    });
    
    document.addEventListener('touchmove', function(e) {
        if (!isDragging) return;
        e.preventDefault();
        
        const touch = e.touches[0];
        const center = getCenter(compassImage);
        const angle = getAngle(center.x, center.y, touch.clientX, touch.clientY);
        currentRotation = angle;
        
        compassImage.style.transform = `rotate(${currentRotation}deg)`;
    });
    
    document.addEventListener('touchend', function() {
        if (isDragging) {
            isDragging = false;
            
            // Reset to 0 degrees with smooth animation
            currentRotation = 0;
            compassImage.style.transition = 'transform 0.5s ease-out';
            compassImage.style.transform = 'rotate(0deg)';
            
            // Reset transition back to none for next drag
            setTimeout(() => {
                compassImage.style.transition = 'none';
            }, 500);
        }
    });
    
    // Set initial cursor style
    compassImage.style.cursor = 'grab';
    compassImage.style.transition = 'none';
}

/**
 * Five Elements Interactive Animations
 */
function initFiveElementsAnimations() {
    const principleCards = document.querySelectorAll('.principle-card');
    
    principleCards.forEach((card, index) => {
        // Add staggered entrance animation
        card.style.animationDelay = `${index * 0.2}s`;
        
        const element = card.getAttribute('data-element');
        
        // Add hover effects
        card.addEventListener('mouseenter', function() {
            if (element === 'wood' || element === 'fire' || element === 'earth' || element === 'metal' || element === 'water') {
                createElementParticles(card);
            } else if (element === 'chi') {
                createEnergyFlow(card);
            } else if (element === 'yin-yang') {
                createBalanceEffect(card);
            }
        });
        
        // Add click effects
        card.addEventListener('click', function() {
            card.classList.add('clicked');
            setTimeout(() => card.classList.remove('clicked'), 200);
            
            if (element === 'wood' || element === 'fire' || element === 'earth' || element === 'metal' || element === 'water') {
                createElementParticles(card);
            } else if (element === 'chi') {
                createEnergyFlow(card);
            } else if (element === 'yin-yang') {
                createBalanceEffect(card);
            }
        });
    });
    
    // Five Elements card with simple animations
        const fiveElementsCard = document.querySelector('.principle-card[data-element="five-elements"]');
        if (fiveElementsCard) {
            // Simple hover effects
            fiveElementsCard.addEventListener('mouseenter', () => {
                fiveElementsCard.style.transform = 'scale(1.05)';
                fiveElementsCard.style.boxShadow = '0 10px 30px rgba(0,0,0,0.3), 0 0 20px rgba(255,215,0,0.3)';
            });
            
            fiveElementsCard.addEventListener('mouseleave', () => {
                fiveElementsCard.style.transform = 'scale(1)';
                fiveElementsCard.style.boxShadow = '';
            });
        }
}

/**
 * Create element particles for Five Elements card
 */
function createElementParticles(element) {
    const particles = element.querySelector('.element-particles');
    if (!particles) return;
    
    // Clear existing particles
    particles.innerHTML = '';
    
    // Element symbols and colors
    const elements = [
        { symbol: '🌳', color: '#4CAF50', name: 'Wood' },
        { symbol: '🔥', color: '#FF5722', name: 'Fire' },
        { symbol: '🌍', color: '#8D6E63', name: 'Earth' },
        { symbol: '⚡', color: '#FFC107', name: 'Metal' },
        { symbol: '💧', color: '#2196F3', name: 'Water' }
    ];
    
    // Create element symbol particles
    elements.forEach((elem, index) => {
        const particle = document.createElement('div');
        particle.className = 'element-symbol';
        particle.textContent = elem.symbol;
        particle.style.cssText = `
            position: absolute;
            font-size: 1.5rem;
            color: ${elem.color};
            pointer-events: none;
            z-index: 10;
            animation: elementOrbit 4s infinite linear;
            animation-delay: ${index * 0.8}s;
            left: 50%;
            top: 50%;
            transform-origin: 0 0;
            filter: drop-shadow(0 0 8px ${elem.color}50);
        `;
        particles.appendChild(particle);
    });
    
    // Create floating energy particles
    for (let i = 0; i < 12; i++) {
        const particle = document.createElement('div');
        particle.className = 'energy-particle';
        const randomElement = elements[Math.floor(Math.random() * elements.length)];
        particle.style.cssText = `
            position: absolute;
            width: 6px;
            height: 6px;
            background: radial-gradient(circle, ${randomElement.color} 0%, transparent 70%);
            border-radius: 50%;
            pointer-events: none;
            animation: energyFloat 3s infinite ease-in-out;
            animation-delay: ${i * 0.25}s;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            box-shadow: 0 0 10px ${randomElement.color};
        `;
        particles.appendChild(particle);
    }
    
    // Create central energy core
    const core = document.createElement('div');
    core.className = 'energy-core';
    core.style.cssText = `
        position: absolute;
        width: 20px;
        height: 20px;
        background: radial-gradient(circle, rgba(255,255,255,0.9) 0%, rgba(255,215,0,0.6) 50%, transparent 100%);
        border-radius: 50%;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        animation: corePulse 2s infinite ease-in-out;
        box-shadow: 0 0 20px rgba(255,215,0,0.8);
        z-index: 5;
    `;
    particles.appendChild(core);
}

/**
 * Create energy flow for Chi card
 */
function createEnergyFlow(element) {
    const flows = element.querySelector('.energy-flows');
    if (!flows) return;
    
    // Clear existing flows
    flows.innerHTML = '';
    
    // Create energy streams
    for (let i = 0; i < 5; i++) {
        const flow = document.createElement('div');
        flow.className = 'energy-stream';
        flow.style.cssText = `
            position: absolute;
            width: 2px;
            height: 20px;
            background: linear-gradient(to bottom, rgba(0,255,255,0.8), transparent);
            left: ${20 + i * 15}%;
            top: 30%;
            animation: energyFlow 2s infinite ease-in-out;
            animation-delay: ${i * 0.2}s;
        `;
        flows.appendChild(flow);
    }
}

/**
 * Create balance effect for Yin Yang card
 */
function createBalanceEffect(element) {
    const balance = element.querySelector('.balance-effect');
    if (!balance) return;
    
    // Clear existing effects
    balance.innerHTML = '';
    
    // Create ripple effect
    for (let i = 0; i < 3; i++) {
        const ripple = document.createElement('div');
        ripple.className = 'ripple';
        ripple.style.cssText = `
            position: absolute;
            width: 50px;
            height: 50px;
            border: 2px solid rgba(255,255,255,0.6);
            border-radius: 50%;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            animation: balanceRipple 2s infinite ease-out;
            animation-delay: ${i * 0.5}s;
        `;
        balance.appendChild(ripple);
    }
}

/**
 * Create element connections for Five Elements card
 */
function createElementConnections(element) {
    const connections = element.querySelector('.element-connections') || document.createElement('div');
    connections.className = 'element-connections';
    connections.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 1;
    `;
    
    if (!element.querySelector('.element-connections')) {
        element.appendChild(connections);
    }
    
    connections.innerHTML = '';
    
    // Create connecting lines between elements
    for (let i = 0; i < 5; i++) {
        const line = document.createElement('div');
        line.className = 'element-connection';
        line.style.cssText = `
            position: absolute;
            width: 2px;
            height: 30px;
            background: linear-gradient(to bottom, rgba(255,215,0,0.8), transparent);
            left: ${20 + i * 15}%;
            top: 20%;
            animation: connectionPulse 3s infinite ease-in-out;
            animation-delay: ${i * 0.3}s;
            transform-origin: bottom;
        `;
        connections.appendChild(line);
    }
}

/**
 * Create element burst effect
 */
function createElementBurst(element) {
    const burst = element.querySelector('.element-burst') || document.createElement('div');
    burst.className = 'element-burst';
    burst.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 15;
    `;
    
    if (!element.querySelector('.element-burst')) {
        element.appendChild(burst);
    }
    
    burst.innerHTML = '';
    
    // Create burst particles
    for (let i = 0; i < 8; i++) {
        const particle = document.createElement('div');
        particle.className = 'burst-particle';
        const angle = (i * 45) * (Math.PI / 180);
        particle.style.cssText = `
            position: absolute;
            width: 8px;
            height: 8px;
            background: radial-gradient(circle, #FFD700, #FFA500);
            border-radius: 50%;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            animation: burstOut 1s ease-out forwards;
            animation-delay: ${i * 0.05}s;
            --angle: ${angle}rad;
        `;
        burst.appendChild(particle);
    }
}

/**
 * Create subtle element pulse
 */
function createSubtleElementPulse(element) {
    const pulse = element.querySelector('.subtle-pulse') || document.createElement('div');
    pulse.className = 'subtle-pulse';
    pulse.style.cssText = `
        position: absolute;
        top: 50%;
        left: 50%;
        width: 20px;
        height: 20px;
        background: radial-gradient(circle, rgba(255,215,0,0.3), transparent);
        border-radius: 50%;
        transform: translate(-50%, -50%);
        animation: subtlePulse 3s ease-in-out;
        pointer-events: none;
        z-index: 2;
    `;
    
    if (!element.querySelector('.subtle-pulse')) {
        element.appendChild(pulse);
    }
    
    // Remove after animation
    setTimeout(() => {
        if (pulse.parentNode) {
            pulse.parentNode.removeChild(pulse);
        }
    }, 3000);
}

/**
 * AI Chat Box Functionality
 */
function initAIChatBox() {
    const chatToggleBtn = document.getElementById('chatToggleBtn');
    const chatWindow = document.getElementById('chatWindow');
    const chatCloseBtn = document.getElementById('chatCloseBtn');
    const chatInput = document.getElementById('chatInput');
    const chatSendBtn = document.getElementById('chatSendBtn');
    const chatMessages = document.getElementById('chatMessages');
    
    if (!chatToggleBtn || !chatWindow) return;
    
    // Toggle chat window
    chatToggleBtn.addEventListener('click', () => {
        chatWindow.classList.toggle('active');
        if (chatWindow.classList.contains('active')) {
            chatInput.focus();
        }
    });
    
    // Close chat window
    chatCloseBtn.addEventListener('click', () => {
        chatWindow.classList.remove('active');
    });
    
    // Send message function
    function sendMessage() {
        const message = chatInput.value.trim();
        if (!message) return;
        
        // Add user message
        addMessage(message, 'user');
        chatInput.value = '';
        
        // Simulate AI response
        setTimeout(() => {
            const aiResponse = generateAIResponse(message);
            addMessage(aiResponse, 'ai');
        }, 1000);
    }
    
    // Add message to chat
    function addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;
        
        const avatar = document.createElement('div');
        avatar.className = 'message-avatar';
        avatar.innerHTML = sender === 'ai' ? '<i class="fas fa-robot"></i>' : '<i class="fas fa-user"></i>';
        
        const content = document.createElement('div');
        content.className = 'message-content';
        content.innerHTML = `<p>${text}</p>`;
        
        messageDiv.appendChild(avatar);
        messageDiv.appendChild(content);
        chatMessages.appendChild(messageDiv);
        
        // Scroll to bottom
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    // Generate AI response
    function generateAIResponse(userMessage) {
        const responses = {
            'hello': 'Hello! I\'m here to help you with feng shui principles and creating harmony in your space.',
            'five elements': 'The Five Elements (Wood, Fire, Earth, Metal, Water) are fundamental to feng shui. Each element has specific colors, shapes, and placements that can enhance different areas of your life.',
            'bagua': 'The Bagua map is an essential feng shui tool that divides your space into nine areas, each corresponding to different life aspects like wealth, relationships, and career.',
            'colors': 'Colors play a vital role in feng shui. For example, red represents fire energy and passion, while blue represents water energy and calmness.',
            'bedroom': 'For good bedroom feng shui, position your bed away from the door, use calming colors, and avoid mirrors facing the bed.',
            'office': 'In your office, position your desk to face the door, use plants for wood energy, and keep the space clutter-free for better chi flow.',
            'plants': 'Plants bring wood energy and life force into your space. Good feng shui plants include bamboo, peace lilies, and money trees.',
            'mirror': 'Mirrors can double energy and create the illusion of space, but avoid placing them directly facing beds or main entrances.',
            'clutter': 'Clutter blocks the flow of positive energy (chi). Regular decluttering is essential for good feng shui.',
            'water': 'Water features like fountains can enhance wealth energy when placed in the southeast area of your home or office.'
        };
        
        const lowerMessage = userMessage.toLowerCase();
        
        // Find matching response
        for (const [key, response] of Object.entries(responses)) {
            if (lowerMessage.includes(key)) {
                return response;
            }
        }
        
        // Default responses
        const defaultResponses = [
            'That\'s an interesting question about feng shui! Could you be more specific about what aspect you\'d like to know?',
            'I\'d be happy to help you with feng shui guidance. Try asking about specific topics like colors, furniture placement, or the five elements.',
            'Feng shui is all about creating harmony and balance. What particular area of your space would you like to improve?',
            'Great question! For personalized feng shui advice, consider our AI analysis service. In the meantime, what specific feng shui principle interests you?'
        ];
        
        return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
    }
    
    // Send message on button click
    chatSendBtn.addEventListener('click', sendMessage);
    
    // Send message on Enter key
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
    
    // Close chat when clicking outside
    document.addEventListener('click', (e) => {
        if (!chatWindow.contains(e.target) && !chatToggleBtn.contains(e.target)) {
            chatWindow.classList.remove('active');
        }
    });
}



// Add simple CSS animations via JavaScript
const style = document.createElement('style');
style.textContent = `
    @keyframes floatUp {
         0% {
             opacity: 0;
             transform: translateY(20px);
         }
         50% {
             opacity: 1;
             transform: translateY(-10px);
         }
         100% {
             opacity: 0;
             transform: translateY(-40px);
         }
     }
     
     @keyframes elementOrbit {
         0% {
             transform: translate(-50%, -50%) rotate(0deg) translateX(40px) rotate(0deg);
             opacity: 0.8;
         }
         25% {
             opacity: 1;
             transform: translate(-50%, -50%) rotate(90deg) translateX(40px) rotate(-90deg);
         }
         50% {
             opacity: 0.9;
             transform: translate(-50%, -50%) rotate(180deg) translateX(40px) rotate(-180deg);
         }
         75% {
             opacity: 1;
             transform: translate(-50%, -50%) rotate(270deg) translateX(40px) rotate(-270deg);
         }
         100% {
             opacity: 0.8;
             transform: translate(-50%, -50%) rotate(360deg) translateX(40px) rotate(-360deg);
         }
     }
     
     @keyframes energyFloat {
         0% {
             opacity: 0.6;
             transform: translateY(0) scale(0.8);
         }
         25% {
             opacity: 1;
             transform: translateY(-10px) scale(1.1);
         }
         50% {
             opacity: 0.8;
             transform: translateY(-5px) scale(0.9);
         }
         75% {
             opacity: 1;
             transform: translateY(-15px) scale(1.2);
         }
         100% {
             opacity: 0.6;
             transform: translateY(-20px) scale(0.7);
         }
     }
     
     @keyframes corePulse {
         0% {
             transform: translate(-50%, -50%) scale(1);
             box-shadow: 0 0 20px rgba(255,215,0,0.8);
         }
         50% {
             transform: translate(-50%, -50%) scale(1.3);
             box-shadow: 0 0 30px rgba(255,215,0,1), 0 0 40px rgba(255,255,255,0.5);
         }
         100% {
             transform: translate(-50%, -50%) scale(1);
             box-shadow: 0 0 20px rgba(255,215,0,0.8);
         }
     }
    
    @keyframes energyFlow {
        0% {
            opacity: 0;
            transform: translateY(0);
        }
        50% {
            opacity: 1;
            transform: translateY(-20px);
        }
        100% {
            opacity: 0;
            transform: translateY(-40px);
        }
    }
    
    @keyframes balanceRipple {
        0% {
            opacity: 0.8;
            transform: translate(-50%, -50%) scale(0.5);
        }
        50% {
            opacity: 0.4;
            transform: translate(-50%, -50%) scale(1.2);
        }
        100% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(2);
        }
    }
    
    @keyframes connectionPulse {
        0% {
            opacity: 0.3;
            transform: scaleY(0.5);
        }
        50% {
            opacity: 1;
            transform: scaleY(1.2);
        }
        100% {
            opacity: 0.3;
            transform: scaleY(0.5);
        }
    }
    
    @keyframes burstOut {
        0% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(0);
        }
        50% {
            opacity: 0.8;
            transform: translate(-50%, -50%) translate(calc(cos(var(--angle)) * 30px), calc(sin(var(--angle)) * 30px)) scale(1.2);
        }
        100% {
            opacity: 0;
            transform: translate(-50%, -50%) translate(calc(cos(var(--angle)) * 50px), calc(sin(var(--angle)) * 50px)) scale(0.5);
        }
    }
    
    @keyframes subtlePulse {
        0% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.5);
        }
        50% {
            opacity: 0.6;
            transform: translate(-50%, -50%) scale(2);
        }
        100% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(3);
        }
    }
    
    .principle-card.clicked {
        transform: scale(0.95);
        transition: transform 0.1s ease;
    }
`;
document.head.appendChild(style);