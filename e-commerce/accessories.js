document.addEventListener('DOMContentLoaded', () => {
    // Initialize cart count
    updateCartCount();

    // Add fade-in animation to products as they appear
    const productCards = document.querySelectorAll('.product-card');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, { threshold: 0.1 });

    productCards.forEach(card => observer.observe(card));

    // Filter functionality
    const filterButtons = document.querySelectorAll('.filter-btn');
    const products = document.querySelectorAll('.product-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            button.classList.add('active');

            const filterValue = button.getAttribute('data-filter');

            products.forEach(product => {
                if (filterValue === 'all' || product.getAttribute('data-category') === filterValue) {
                    product.style.display = 'flex';
                    setTimeout(() => {
                        product.style.opacity = '1';
                        product.style.transform = 'translateY(0)';
                    }, 10);
                } else {
                    product.style.opacity = '0';
                    product.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        product.style.display = 'none';
                    }, 300);
                }
            });
        });
    });

    // Add to cart functionality
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', () => {
            const product = button.closest('.product-info');
            const productName = product.querySelector('.product-name').textContent;
            const productPrice = product.querySelector('.product-price').textContent;
            
            // Add item to cart (you can implement your cart logic here)
            addToCart({
                name: productName,
                price: productPrice,
                quantity: 1
            });

            // Show success toast
            showToast(`${productName} added to cart!`);
            
            // Update cart count
            updateCartCount();

            // Add pop animation to cart count
            const cartCount = document.querySelector('.cart-count');
            cartCount.classList.add('pop');
            setTimeout(() => cartCount.classList.remove('pop'), 300);
        });
    });

    // Cart preview functionality
    const cartBtn = document.querySelector('.cart-btn');
    const cartPreview = document.querySelector('.cart-preview');

    cartBtn.addEventListener('click', () => {
        cartPreview.classList.toggle('show');
        updateCartPreview();
    });

    // Close cart preview when clicking outside
    document.addEventListener('click', (e) => {
        if (!cartBtn.contains(e.target) && !cartPreview.contains(e.target)) {
            cartPreview.classList.remove('show');
        }
    });

    // Mobile menu functionality
    const mobileMenu = document.querySelector('.mobile-menu');
    const navLinks = document.querySelector('.nav-links');

    mobileMenu.addEventListener('click', () => {
        mobileMenu.classList.toggle('active');
        navLinks.classList.toggle('show');
    });

    // Search functionality
    const searchInput = document.getElementById('searchInput');
    const searchResults = document.getElementById('searchResults');

    searchInput.addEventListener('input', () => {
        const searchTerm = searchInput.value.toLowerCase();
        const filteredProducts = Array.from(products).filter(product => {
            const name = product.querySelector('.product-name').textContent.toLowerCase();
            const description = product.querySelector('.product-description').textContent.toLowerCase();
            return name.includes(searchTerm) || description.includes(searchTerm);
        });

        // Update search results
        displaySearchResults(filteredProducts);
    });
});

// Helper functions
function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    document.querySelector('.toast-container').appendChild(toast);

    setTimeout(() => {
        toast.classList.add('show');
    }, 10);

    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

function updateCartCount() {
    // Get cart items from localStorage or your cart management system
    const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    document.querySelector('.cart-count').textContent = totalItems;
}

function addToCart(item) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingItem = cart.find(i => i.name === item.name);
    
    if (existingItem) {
        existingItem.quantity += item.quantity;
    } else {
        cart.push(item);
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
}

function updateCartPreview() {
    const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    const cartPreviewItems = document.querySelector('.cart-preview-items');
    const cartPreviewTotal = document.querySelector('.cart-preview-total');

    if (cartItems.length === 0) {
        cartPreviewItems.innerHTML = '<div class="empty-cart">Your cart is empty</div>';
        cartPreviewTotal.textContent = '';
        return;
    }

    cartPreviewItems.innerHTML = cartItems.map(item => `
        <div class="cart-item">
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <p>${item.price} × ${item.quantity}</p>
            </div>
            <button class="remove-item" onclick="removeFromCart('${item.name}')">×</button>
        </div>
    `).join('');

    const total = cartItems.reduce((sum, item) => {
        const price = parseFloat(item.price.replace('$', ''));
        return sum + price * item.quantity;
    }, 0);

    cartPreviewTotal.textContent = `Total: $${total.toFixed(2)}`;
}

function removeFromCart(productName) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart = cart.filter(item => item.name !== productName);
    localStorage.setItem('cart', JSON.stringify(cart));
    
    updateCartCount();
    updateCartPreview();
    showToast('Item removed from cart');
}

function displaySearchResults(products) {
    const searchResults = document.getElementById('searchResults');
    
    if (products.length === 0) {
        searchResults.innerHTML = '<div class="no-results">No products found</div>';
        searchResults.style.display = 'block';
        return;
    }

    searchResults.innerHTML = products.map(product => `
        <div class="search-result">
            <h4>${product.querySelector('.product-name').textContent}</h4>
            <p>${product.querySelector('.product-price').textContent}</p>
        </div>
    `).join('');

    searchResults.style.display = 'block';
}

// Close search results when clicking outside
document.addEventListener('click', (e) => {
    const searchResults = document.getElementById('searchResults');
    const searchContainer = document.querySelector('.search-container');
    
    if (!searchContainer.contains(e.target)) {
        searchResults.style.display = 'none';
    }
});
