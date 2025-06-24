// JavaScript code will go here
document.addEventListener('DOMContentLoaded', () => {
    // Initialize skill progress bars
    initSkillProgress();
    
    // Add works-page class to body when on works.html
    if (window.location.pathname.includes('works.html')) {
        document.body.classList.add('works-page');
    }
    
    // Smooth scrolling for navigation dots
    const navDots = document.querySelectorAll('.nav-dot');
    navDots.forEach(dot => {
        dot.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = dot.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
    
    // Update active navigation dot on scroll
    window.addEventListener('scroll', () => {
        updateNavigation();
        showScrollProgress();
        checkVisibility();
    });
    
    // Initial check for visibility
    checkVisibility();

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]:not([href*="mailto"])').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Scroll progress indicator
    const scrollProgress = document.querySelector('.scroll-progress');
    
    function updateScrollProgress() {
        const windowHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = (window.scrollY / windowHeight) * 100;
        scrollProgress.style.transform = `scaleX(${progress / 100})`;
    }

    // Add cursor effect
    const cursor = document.createElement('div');
    cursor.className = 'cursor';
    document.body.appendChild(cursor);

    // Update cursor position
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    });

    // Add hover effect to buttons
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', () => {
            cursor.style.transform = 'scale(1.5)';
            cursor.style.mixBlendMode = 'difference';
        });

        button.addEventListener('mouseleave', () => {
            cursor.style.transform = 'scale(1)';
            cursor.style.mixBlendMode = 'normal';
        });
    });

    // Add parallax effect to hero section
    const hero = document.querySelector('.hero');
    document.addEventListener('mousemove', (e) => {
        const { clientX, clientY } = e;
        const xPos = (clientX / window.innerWidth - 0.5) * 20;
        const yPos = (clientY / window.innerHeight - 0.5) * 20;
        
        hero.style.transform = `translateY(-5px) rotateX(${yPos}deg) rotateY(${xPos}deg)`;
    });

    // Reset transform on mouse leave
    document.addEventListener('mouseleave', () => {
        hero.style.transform = 'translateY(-5px) rotateX(0) rotateY(0)';
    });

    // Add ripple effect to all .btn elements
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            ripple.className = 'ripple';
            const rect = btn.getBoundingClientRect();
            ripple.style.left = (e.clientX - rect.left) + 'px';
            ripple.style.top = (e.clientY - rect.top) + 'px';
            ripple.style.width = ripple.style.height = Math.max(rect.width, rect.height) + 'px';
            btn.appendChild(ripple);
            ripple.addEventListener('animationend', () => ripple.remove());
        });
    });

    // Handle contact form submission
    document.getElementById('contactForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form elements
        const form = this;
        const submitBtn = form.querySelector('button[type="submit"]');
        const btnText = submitBtn.querySelector('.btn-text');
        const btnLoading = submitBtn.querySelector('.btn-loading');
        const successMessage = document.getElementById('success-message');
        const errorMessage = document.getElementById('error-message');
        
        // Hide any existing messages
        successMessage.style.display = 'none';
        errorMessage.style.display = 'none';
        
        // Show loading state
        btnText.style.display = 'none';
        btnLoading.style.display = 'inline-flex';
        submitBtn.disabled = true;
        
        // Prepare the email parameters
        const templateParams = {
            to_name: 'Carlwyne',
            from_name: form.name.value,
            from_email: form.email.value,
            message: form.message.value,
            reply_to: form.email.value
        };

        // Log the parameters for debugging
        console.log('Sending email with parameters:', templateParams);
        
        // Send the email using EmailJS
        emailjs.send('service_ndg58ro', 'template_1m8o37d', templateParams)
            .then(function(response) {
                console.log('Email sent successfully:', response);
                successMessage.style.display = 'block';
                form.reset();
            })
            .catch(function(error) {
                console.error('Email error details:', error);
                errorMessage.textContent = 'Failed to send message: ' + (error.text || 'Unknown error');
                errorMessage.style.display = 'block';
            })
            .finally(function() {
                btnText.style.display = 'inline';
                btnLoading.style.display = 'none';
                submitBtn.disabled = false;
            });
    });
});

// Function to update navigation dots
function updateNavigation() {
    const sections = document.querySelectorAll('section');
    const navDots = document.querySelectorAll('.nav-dot');
    
    sections.forEach((section, index) => {
        const rect = section.getBoundingClientRect();
        const isVisible = (rect.top <= window.innerHeight * 0.5);
        
        if (isVisible) {
            navDots.forEach(dot => dot.classList.remove('active'));
            navDots[index]?.classList.add('active');
        }
    });
}

// Function to show scroll progress
function showScrollProgress() {
    const scrollProgress = document.querySelector('.scroll-progress');
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const scrolled = window.scrollY;
    const progress = (scrolled / scrollable) * 100;
    scrollProgress.style.width = `${progress}%`;
}

// Function to check section visibility
function checkVisibility() {
    const sections = document.querySelectorAll('.about, .projects, .skills, .contact');
    const aboutItems = document.querySelectorAll('.about-item');
    const projectCards = document.querySelectorAll('.project-card');
    const skillCategories = document.querySelectorAll('.skills-category');
    const contactItems = document.querySelectorAll('.contact-item');
    
    sections.forEach(section => {
        const rect = section.getBoundingClientRect();
        const isVisible = (rect.top <= window.innerHeight * 0.75);
        
        if (isVisible) {
            section.classList.add('visible');
            
            // Handle about items
            if (section.classList.contains('about')) {
                aboutItems.forEach((item, index) => {
                    setTimeout(() => {
                        item.classList.add('visible');
                    }, index * 200);
                });
            }
            
            // Handle project cards
            if (section.classList.contains('projects')) {
                projectCards.forEach((card, index) => {
                    setTimeout(() => {
                        card.classList.add('visible');
                    }, index * 200);
                });
            }
            
            // Handle skill categories
            if (section.classList.contains('skills')) {
                skillCategories.forEach((category, index) => {
                    setTimeout(() => {
                        category.classList.add('visible');
                    }, index * 200);
                });
            }
            
            // Handle contact items
            if (section.classList.contains('contact')) {
                section.classList.add('visible');
                
                // Add visible class to contact form with delay
                const contactForm = document.querySelector('.contact-form');
                if (contactForm) {
                    setTimeout(() => {
                        contactForm.classList.add('visible');
                    }, 200);
                }

                // Add visible class to social links with delay
                const socialLinks = document.querySelector('.social-links');
                if (socialLinks) {
                    setTimeout(() => {
                        socialLinks.classList.add('visible');
                    }, 400);
                }

                // Handle individual contact items with staggered delay
                contactItems.forEach((item, index) => {
                    setTimeout(() => {
                        item.classList.add('visible');
                    }, 600 + (index * 200));
                });
            }
        }
    });
}

// Function to initialize skill progress bars
function initSkillProgress() {
    const skillProgressBars = document.querySelectorAll('.skill-progress');
    skillProgressBars.forEach(bar => {
        const width = bar.getAttribute('data-level');
        bar.style.width = width;
    });
} 