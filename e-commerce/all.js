// All Products Page Specific JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Filter Functionality
    const filterButtons = document.querySelectorAll('.filter-btn');
    const productCards = document.querySelectorAll('.product-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            button.classList.add('active');

            const filterValue = button.getAttribute('data-filter');

            productCards.forEach(card => {
                // Show all items if 'all' is selected
                if (filterValue === 'all') {
                    card.style.display = 'flex';
                    setTimeout(() => card.style.opacity = '1', 0);
                } else {
                    // Show/hide items based on category
                    if (card.getAttribute('data-category') === filterValue) {
                        card.style.display = 'flex';
                        setTimeout(() => card.style.opacity = '1', 0);
                    } else {
                        card.style.opacity = '0';
                        setTimeout(() => card.style.display = 'none', 300);
                    }
                }
            });
        });
    });

    // Cart Functionality
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

    // Search Functionality
    const searchInput = document.getElementById('searchInput');
    const searchResults = document.getElementById('searchResults');

    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const productNames = document.querySelectorAll('.product-name');

        if (searchTerm.length > 0) {
            searchResults.innerHTML = '';
            searchResults.style.display = 'block';

            productNames.forEach(name => {
                if (name.textContent.toLowerCase().includes(searchTerm)) {
                    const resultItem = document.createElement('div');
                    resultItem.classList.add('search-result-item');
                    resultItem.textContent = name.textContent;
                    searchResults.appendChild(resultItem);
                }
            });
        } else {
            searchResults.style.display = 'none';
        }
    });

    // Close search results when clicking outside
    document.addEventListener('click', (e) => {
        if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
            searchResults.style.display = 'none';
        }
    });

    // Animate products on scroll
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    productCards.forEach(card => observer.observe(card));
}); 