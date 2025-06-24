// Product Data
const products = [
    {
        id: 1,
        name: 'Tech Cargo Pants',
        price: 89.99,
        category: 'clothing',
        image: 'images/tech.jpg',
        badge: 'Best Seller',
        description: 'Tactical streetwear cargo pants with utility pockets'
    },
    {
        id: 2,
        name: 'Urban Bomber Jacket',
        price: 149.99,
        category: 'clothing',
        image: 'images/bomber.jpg',
        badge: 'New Drop',
        description: 'Premium bomber jacket with modern street aesthetic'
    },
    {
        id: 3,
        name: 'Limited Air Force 1',
        price: 199.99,
        category: 'footwear',
        image: 'images/af1.jpg',
        badge: 'Limited',
        description: 'Exclusive Air Force 1 with custom design'
    },
    {
        id: 4,
        name: 'Urban Chain Necklace',
        price: 79.99,
        category: 'accessories',
        image: 'images/necklace.jpg',
        badge: 'Trending',
        description: 'Premium stainless steel chain necklace'
    },
    {
        id: 5,
        name: 'Graphic Street Tee',
        price: 49.99,
        category: 'clothing',
        image: 'images/tee.jpg',
        badge: 'New',
        description: 'Limited edition graphic print t-shirt'
    },
    {
        id: 6,
        name: 'High-Top Sneakers',
        price: 159.99,
        category: 'footwear',
        image: 'images/high top sneak.jpg',
        badge: 'Hot',
        description: 'Premium high-top sneakers with urban style'
    }
];

// State Management
const state = {
    activeFilter: 'all',
    lastScrollPosition: 0,
    cart: [],
    cartTotal: 0
};

// DOM Elements
const header = document.querySelector('.header');
const mobileMenuBtn = document.querySelector('.mobile-menu');
const navLinks = document.querySelector('.nav-links');
const slides = document.querySelectorAll('.slide');
const searchInput = document.getElementById('searchInput');
const searchResults = document.getElementById('searchResults');
const productGrid = document.querySelector('.product-grid');
const filterBtns = document.querySelectorAll('.filter-btn');
const filterLinks = document.querySelectorAll('.nav-link');
const cartBtn = document.querySelector('.cart-btn');
const cartPreview = document.querySelector('.cart-preview');
const cartItems = document.querySelector('.cart-preview-items');
const cartTotal = document.querySelector('.cart-preview-total');
const cartCount = document.querySelector('.cart-count');

// Mobile Menu Toggle
mobileMenuBtn?.addEventListener('click', () => {
    navLinks.classList.toggle('show');
    const spans = mobileMenuBtn.querySelectorAll('span');
    spans[0].style.transform = navLinks.classList.contains('show') ? 'rotate(45deg) translate(5px, 5px)' : '';
    spans[1].style.opacity = navLinks.classList.contains('show') ? '0' : '1';
    spans[2].style.transform = navLinks.classList.contains('show') ? 'rotate(-45deg) translate(5px, -5px)' : '';
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (!mobileMenuBtn?.contains(e.target) && !navLinks?.contains(e.target)) {
        navLinks?.classList.remove('show');
    }
});

// Header Scroll Effect
function initializeHeaderScroll() {
    let lastScroll = 0;
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        const header = document.querySelector('.header');
        
        // Add/remove scrolled class
        if (currentScroll > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    });
}

// Hero Slider
let currentSlide = 0;
const totalSlides = slides.length;

function showSlide(index) {
    slides.forEach(slide => {
        slide.classList.remove('active');
        slide.style.zIndex = 1;
    });
    slides[index].classList.add('active');
    slides[index].style.zIndex = 2;
}

function nextSlide() {
    currentSlide = (currentSlide + 1) % totalSlides;
    showSlide(currentSlide);
}

// Initialize slider if slides exist
if (slides.length > 0) {
    showSlide(0);
    setInterval(nextSlide, 5000);
}

// Product Filtering
function filterProducts(category) {
    const products = document.querySelectorAll('.product-card');
    products.forEach(product => {
        const shouldShow = category === 'all' || product.getAttribute('data-category') === category;
        product.style.display = 'none';
        product.style.opacity = '0';
        
        if (shouldShow) {
            product.style.display = 'flex';
            setTimeout(() => {
                product.style.opacity = '1';
                product.style.transform = 'translateY(0)';
            }, 50);
        }
    });
}

// Initialize Filter Navigation
filterBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        // Update button active state
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        // Update nav link active state
        const filter = btn.getAttribute('data-filter');
        filterLinks.forEach(link => {
            if (link.getAttribute('data-filter') === filter) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
        
        filterProducts(filter);
        state.activeFilter = filter;
    });
});

filterLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        // Only prevent default for links that are filters
        const filter = link.getAttribute('data-filter');
        if (filter) {
            e.preventDefault();
            
            // Update nav link active state
            filterLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            
            // Update button active state
            filterBtns.forEach(btn => {
                if (btn.getAttribute('data-filter') === filter) {
                    btn.classList.add('active');
                } else {
                    btn.classList.remove('active');
                }
            });
            
            filterProducts(filter);
            state.activeFilter = filter;
        }
    });
});

// Shopping Cart Functions
function updateCart() {
    cartCount.textContent = state.cart.length;
    cartItems.innerHTML = state.cart.map(item => `
        <div class="cart-item">
            <img src="${item.image}" alt="${item.name}">
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <p>$${item.price}</p>
            </div>
            <button class="remove-item" data-id="${item.id}">×</button>
        </div>
    `).join('');
    cartTotal.textContent = `Total: $${state.cartTotal.toFixed(2)}`;
}

function addToCart(product) {
    state.cart.push(product);
    state.cartTotal += parseFloat(product.price);
    updateCart();
    showToast('Added to cart');
}

// Cart Toggle
cartBtn?.addEventListener('click', () => {
    cartPreview.classList.toggle('show');
});

// Close cart when clicking outside
document.addEventListener('click', (e) => {
    if (!cartBtn?.contains(e.target) && !cartPreview?.contains(e.target)) {
        cartPreview?.classList.remove('show');
    }
});

// Search Functionality
searchInput?.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const products = document.querySelectorAll('.product-card');
    
    products.forEach(product => {
        const name = product.querySelector('.product-name').textContent.toLowerCase();
        const description = product.querySelector('.product-description').textContent.toLowerCase();
        const shouldShow = name.includes(searchTerm) || description.includes(searchTerm);
        
        product.style.display = shouldShow ? 'block' : 'none';
    });
    
    searchResults.style.display = searchTerm ? 'block' : 'none';
});

// Close search results when clicking outside
document.addEventListener('click', (e) => {
    if (!searchInput?.contains(e.target) && !searchResults?.contains(e.target)) {
        searchResults.style.display = 'none';
    }
});

// Initialize with all products visible
filterProducts('all');

// Toast Notifications
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    toastContainer.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// Event Listeners
function initializeEventListeners() {
    window.addEventListener('scroll', handleScroll);
    
    mobileMenuBtn?.addEventListener('click', () => {
        navLinks.classList.toggle('show');
        const spans = mobileMenuBtn.querySelectorAll('span');
        spans[0].style.transform = navLinks.classList.contains('show') ? 'rotate(45deg) translate(5px, 5px)' : '';
        spans[1].style.opacity = navLinks.classList.contains('show') ? '0' : '1';
        spans[2].style.transform = navLinks.classList.contains('show') ? 'rotate(-45deg) translate(5px, -5px)' : '';
    });

    searchInput?.addEventListener('input', handleSearch);
    searchInput?.addEventListener('blur', () => {
        setTimeout(() => searchResults.classList.remove('show'), 200);
    });

    filterLinks?.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const filter = link.getAttribute('data-filter');
            filterProducts(filter);
            state.activeFilter = filter;

            // Update active class on filter links
            filterLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        });
    });
}

// Initialize Product Event Listeners
function initializeProductListeners() {
    // Filter button listeners
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            filterProducts(btn.dataset.filter);
        });
    });

    // Add to cart button listeners
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    const cartCount = document.querySelector('.cart-count');
    let count = 0;

    addToCartButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Get product info
            const product = button.closest('.product-info');
            const productName = product.querySelector('.product-name').textContent;
            
            // Update cart count
            count++;
            cartCount.textContent = count;
            cartCount.classList.add('pop');

            // Create and show toast notification with product name
            const toast = document.createElement('div');
            toast.classList.add('toast');
            toast.textContent = `${productName} added to cart!`;
            document.querySelector('.toast-container').appendChild(toast);

            // Show toast
            setTimeout(() => toast.classList.add('show'), 100);

            // Remove toast after 3 seconds
            setTimeout(() => {
                toast.classList.remove('show');
                setTimeout(() => toast.remove(), 300);
            }, 3000);

            // Remove pop animation class
            setTimeout(() => cartCount.classList.remove('pop'), 300);
        });
    });
}

// Cart Functionality
function initializeCart() {
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    const cartItems = document.querySelector('.cart-preview-items');
    const cartTotal = document.querySelector('.cart-preview-total');
    const cartCount = document.querySelector('.cart-count');
    let cart = [];

    addToCartButtons.forEach(button => {
        button.addEventListener('click', () => {
            const card = button.closest('.product-card');
            const product = {
                id: Date.now().toString(),
                name: card.querySelector('.product-name').textContent,
                price: parseFloat(card.querySelector('.product-price').textContent.replace('$', '')),
                image: card.querySelector('.product-img').src
            };
            
            cart.push(product);
            updateCartDisplay();
            showToast('Added to cart!');
        });
    });

    function updateCartDisplay() {
        cartCount.textContent = cart.length;
        
        if (cart.length === 0) {
            cartItems.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
            cartTotal.textContent = 'Total: $0.00';
            return;
        }

        const total = cart.reduce((sum, item) => sum + item.price, 0);
        
        cartItems.innerHTML = cart.map(item => `
            <div class="cart-item" data-id="${item.id}">
                <img src="${item.image}" alt="${item.name}">
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <p>$${item.price.toFixed(2)}</p>
                </div>
                <button class="remove-item" onclick="removeFromCart('${item.id}')">×</button>
            </div>
        `).join('');
        
        cartTotal.textContent = `Total: $${total.toFixed(2)}`;
    }

    window.removeFromCart = function(id) {
        cart = cart.filter(item => item.id !== id);
        updateCartDisplay();
        showToast('Item removed from cart');
    };
}

// Smooth Scroll with Intersection Observer
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px'
};

const fadeInObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
            fadeInObserver.unobserve(entry.target);
        }
    });
}, observerOptions);

// Apply fade-in animation to products
function initProductAnimations() {
    const products = document.querySelectorAll('.product-card');
    products.forEach((product, index) => {
        product.style.animationDelay = `${index * 0.1}s`;
        fadeInObserver.observe(product);
    });
}

// Enhanced Search Experience
let searchTimeout;
searchInput.addEventListener('input', (e) => {
    clearTimeout(searchTimeout);
    const query = e.target.value.toLowerCase();
    
    // Add typing animation
    searchInput.classList.add('typing');
    
    searchTimeout = setTimeout(() => {
        const results = products.filter(product => 
            product.name.toLowerCase().includes(query) ||
            product.description.toLowerCase().includes(query)
        );
        
        displaySearchResults(results);
        searchInput.classList.remove('typing');
    }, 300);
});

// Parallax Effect on Product Images
function initParallax() {
    const productImages = document.querySelectorAll('.product-image');
    
    productImages.forEach(img => {
        img.addEventListener('mousemove', (e) => {
            const { left, top, width, height } = img.getBoundingClientRect();
            const x = (e.clientX - left) / width - 0.5;
            const y = (e.clientY - top) / height - 0.5;
            
            img.style.transform = `
                scale(1.1)
                rotateX(${y * 10}deg)
                rotateY(${x * 10}deg)
            `;
        });
        
        img.addEventListener('mouseleave', () => {
            img.style.transform = 'scale(1) rotateX(0) rotateY(0)';
        });
    });
}

// Enhanced Filter Animation
filterButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
        // ...existing code...
        
        // Add ripple effect
        const ripple = document.createElement('span');
        ripple.classList.add('ripple');
        btn.appendChild(ripple);
        
        const rect = btn.getBoundingClientRect();
        ripple.style.left = `${e.clientX - rect.left}px`;
        ripple.style.top = `${e.clientY - rect.top}px`;
        
        setTimeout(() => ripple.remove(), 1000);
    });
});

// Smooth scroll for navigation links
function initializeSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
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
}

// Initialize all animations
document.addEventListener('DOMContentLoaded', () => {
    initProductAnimations();
    initParallax();
    initializeHeaderScroll();
    initializeSmoothScroll();
});

// Initialize
function init() {
    renderProducts();
    initializeEventListeners();
    initializeFilters();
    initializeCart();
}

// Start the app
init();
