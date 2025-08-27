// Mobile menu functionality
const menuIcon = document.getElementById('menu-icon');
const mobileMenu = document.getElementById('mobile-menu');
const closeMenu = document.getElementById('close-menu');

// Open mobile menu
menuIcon?.addEventListener('click', function (e: Event) {
  e.preventDefault();
  e.stopPropagation();
  mobileMenu?.classList.remove('hidden');
  document.body.classList.add('menu-open');
});

// Close mobile menu
closeMenu?.addEventListener('click', function (e: Event) {
  e.preventDefault();
  e.stopPropagation();
  mobileMenu?.classList.add('hidden');
  document.body.classList.remove('menu-open');
});

// Close menu when clicking on menu links
const mobileMenuLinks = mobileMenu?.querySelectorAll('a');
mobileMenuLinks?.forEach(link => {
  link.addEventListener('click', function (e: Event) {
    e.preventDefault();
    mobileMenu?.classList.add('hidden');
    document.body.classList.remove('menu-open');
  });
});

// Close menu when clicking outside
mobileMenu?.addEventListener('click', function (e: Event) {
  if (e.target === mobileMenu) {
    mobileMenu.classList.add('hidden');
    document.body.classList.remove('menu-open');
  }
});

// Video scroll functionality
window.addEventListener('scroll', function () {
  const videoContainer = document.getElementById('video-container');
  const videoSection = document.getElementById('video-section');
  const scrollY = window.scrollY;
  const windowHeight = window.innerHeight;

  if (!videoContainer || !videoSection) return;

  // Get video section position
  const videoSectionTop = videoSection.offsetTop;
  const videoSectionBottom = videoSectionTop + videoSection.offsetHeight;

  // Calculate scroll progress relative to video section
  const scrollProgress = Math.max(0, Math.min(1, (scrollY - videoSectionTop) / windowHeight));

  // Check if we're in or past the video section
  if (scrollY >= videoSectionTop && scrollY <= videoSectionBottom + windowHeight) {
    // Calculate scale (from 100% to 40%)
    const scale = 1 - (scrollProgress * 0.6); // 1 to 0.4 (40%)
    const finalScale = Math.max(0.4, scale);

    // Apply transformation
    videoContainer.style.transform = `scale(${finalScale})`;
    videoContainer.style.transformOrigin = 'center center';

    // Optional: Add some opacity change for better effect
    const opacity = Math.max(0.8, 1 - (scrollProgress * 0.2));
    videoContainer.style.opacity = opacity.toString();

    // Add border radius when scaled down
    const borderRadius = scrollProgress * 20;
    videoContainer.style.borderRadius = `${borderRadius}px`;
    videoContainer.style.overflow = 'hidden';

  } else if (scrollY < videoSectionTop) {
    // Reset to full size when scrolling back up
    videoContainer.style.transform = 'scale(1)';
    videoContainer.style.opacity = '1';
    videoContainer.style.borderRadius = '0px';
  }
});

// Pause/play video based on visibility
const observerOptions: IntersectionObserverInit = {
  threshold: 0.3
};

const videoObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    const video = entry.target.querySelector('video') as HTMLVideoElement;
    if (entry.isIntersecting) {
      video?.play().catch(e => console.log('Video play failed:', e));
    } else {
      video?.pause();
    }
  });
}, observerOptions);

// Observe the video section
const videoSection = document.getElementById('video-section');
if (videoSection) {
  videoObserver.observe(videoSection);
}

// Optional: Click to reset video scale
document.getElementById('video-container')?.addEventListener('click', function () {
  const videoSection = document.getElementById('video-section');
  videoSection?.scrollIntoView({ behavior: 'smooth', block: 'start' });
});

// Shopping Cart Interface
interface CartItem {
  id: string;
  name: string;
  price: number;
  size: string;
  color: string;
  image: string;
  quantity: number;
}

class ShoppingCart {
  private items: CartItem[] = [];
  private cartSummary: HTMLElement | null;
  private cartItems: HTMLElement | null;
  private cartTotal: HTMLElement | null;

  constructor() {
    this.cartSummary = document.getElementById('cart-summary');
    this.cartItems = document.getElementById('cart-items');
    this.cartTotal = document.getElementById('cart-total');
    this.setupEventListeners();
    this.updateCartDisplay();
  }

  private setupEventListeners(): void {
    // Size and color selection
    document.addEventListener('click', (e: Event) => {
      const target = e.target as HTMLElement;
      
      // Handle size selection
      if (target.hasAttribute('data-size')) {
        const sizeContainer = target.parentElement;
        sizeContainer?.querySelectorAll('[data-size]').forEach(el => el.classList.remove('selected'));
        target.classList.add('selected');
      }
      
      // Handle color selection
      if (target.hasAttribute('data-color')) {
        const colorContainer = target.parentElement;
        colorContainer?.querySelectorAll('[data-color]').forEach(el => el.classList.remove('selected'));
        target.classList.add('selected');
        
        // Update shoe image based on color selection
        this.updateShoeImage(target);
      }
    });

    // Add to cart buttons
    document.addEventListener('click', (e: Event) => {
      const target = e.target as HTMLElement;
      if (target.classList.contains('add-to-cart-btn')) {
        e.preventDefault();
        this.addToCart(target);
      }
    });

    // Checkout and clear cart buttons
    document.getElementById('checkout-btn')?.addEventListener('click', () => {
      this.checkout();
    });

    document.getElementById('clear-cart-btn')?.addEventListener('click', () => {
      this.clearCart();
    });
  }

  private updateShoeImage(colorElement: HTMLElement): void {
    const colorValue = colorElement.getAttribute('data-color');
    const card = colorElement.closest('.card_shop');
    const img = card?.querySelector('.imgBx img') as HTMLImageElement;
    const shoeType = card?.getAttribute('data-shoe');

    if (!img || !shoeType) return;

    // Update image based on color selection
    if (shoeType?.includes('bondi8')) {
      switch (colorValue) {
        case 'black':
          img.src = 'src/image/shoe/HK_Bondi8_Black.png';
          break;
        case 'cream':
          img.src = 'src/image/shoe/HK_Bondi8_Cream.png';
          break;
        case 'cyan':
          img.src = 'src/image/shoe/HK_Bondi8_Cyan.png';
          break;
      }
    }
  }

  private addToCart(button: HTMLElement): void {
    const card = button.closest('.card_shop');
    if (!card) return;

    const shoeName = card.querySelector('h2')?.textContent || 'Unknown Shoe';
    const priceText = button.getAttribute('data-price') || '0';
    const price = parseFloat(priceText);
    
    // Get selected size and color
    const selectedSize = card.querySelector('.size span.selected')?.textContent || '40';
    const selectedColor = card.querySelector('.color span.selected')?.getAttribute('data-color') || 'default';
    const shoeImage = card.querySelector('.imgBx img')?.getAttribute('src') || '';

    // Create unique ID for cart item
    const itemId = `${shoeName}-${selectedSize}-${selectedColor}`.replace(/\s+/g, '-').toLowerCase();

    // Check if item already exists in cart
    const existingItem = this.items.find(item => item.id === itemId);
    
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      this.items.push({
        id: itemId,
        name: shoeName,
        price: price,
        size: selectedSize,
        color: selectedColor,
        image: shoeImage,
        quantity: 1
      });
    }

    this.updateCartDisplay();
    this.showAddedToCartFeedback(button);
  }

  private showAddedToCartFeedback(button: HTMLElement): void {
    const originalText = button.textContent;
    button.textContent = '✓ Added!';
    button.style.background = '#10b981';
    
    setTimeout(() => {
      button.textContent = originalText;
      button.style.background = '';
    }, 1500);
  }

  private updateCartDisplay(): void {
    if (!this.cartItems || !this.cartTotal || !this.cartSummary) return;

    // Clear current items
    this.cartItems.innerHTML = '';

    if (this.items.length === 0) {
      this.cartSummary.classList.add('hidden');
      return;
    }

    // Show cart summary
    this.cartSummary.classList.remove('hidden');

    // Calculate total
    let total = 0;
    
    // Display items
    this.items.forEach(item => {
      total += item.price * item.quantity;
      
      const itemElement = document.createElement('div');
      itemElement.className = 'cart-item';
      itemElement.innerHTML = `
        <div class="item-name">${item.name}</div>
        <div class="item-details">Size: ${item.size}, Color: ${item.color}</div>
        <div class="flex justify-between items-center mt-1">
          <span class="item-price">$${item.price.toFixed(2)} x ${item.quantity}</span>
          <button class="remove-item text-red-500 hover:text-red-700" data-id="${item.id}">×</button>
        </div>
      `;
      
      if (this.cartItems) {
        this.cartItems.appendChild(itemElement);
      }
    });

    // Update total
    this.cartTotal.textContent = `$${total.toFixed(2)}`;

    // Add remove item functionality
    this.cartItems.addEventListener('click', (e: Event) => {
      const target = e.target as HTMLElement;
      if (target.classList.contains('remove-item')) {
        const itemId = target.getAttribute('data-id');
        this.removeItem(itemId);
      }
    });
  }

  private removeItem(itemId: string | null): void {
    if (!itemId) return;
    
    this.items = this.items.filter(item => item.id !== itemId);
    this.updateCartDisplay();
  }

  private checkout(): void {
    if (this.items.length === 0) {
      alert('Your cart is empty!');
      return;
    }

    const total = this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const itemCount = this.items.reduce((sum, item) => sum + item.quantity, 0);
    
    alert(`Thank you for your purchase!\n\nItems: ${itemCount}\nTotal: $${total.toFixed(2)}\n\nYour order will be processed shortly.`);
    
    this.clearCart();
  }

  private clearCart(): void {
    this.items = [];
    this.updateCartDisplay();
  }
}

// Initialize shopping cart
document.addEventListener('DOMContentLoaded', () => {
  new ShoppingCart();
});

// Smooth scrolling to shop section
document.addEventListener('click', (e: Event) => {
  const target = e.target as HTMLElement;
  
  // Handle navigation to shop section
  if (target.textContent?.includes('Shoes') || target.classList.contains('btn-shopnow')) {
    e.preventDefault();
    const shopSection = document.getElementById('shop');
    shopSection?.scrollIntoView({ behavior: 'smooth' });
  }

  // Handle navigation to why-choose-us section
  if (target.textContent?.includes('Why Us') || target.getAttribute('href') === '#why-choose-us') {
    e.preventDefault();
    const whyChooseUsSection = document.getElementById('why-choose-us');
    whyChooseUsSection?.scrollIntoView({ behavior: 'smooth' });
  }

  // Handle "ดูสินค้าทั้งหมด" button
  if (target.textContent?.includes('ดูสินค้าทั้งหมด')) {
    e.preventDefault();
    const shopSection = document.getElementById('shop');
    shopSection?.scrollIntoView({ behavior: 'smooth' });
  }
});

// Why Choose Us Section Carousel
document.addEventListener('DOMContentLoaded', () => {
  const servicesTrack = document.getElementById('services-track');
  const prevButton = document.getElementById('prev-service') as HTMLButtonElement;
  const nextButton = document.getElementById('next-service') as HTMLButtonElement;
  const dotsContainer = document.getElementById('dots-container');
  
  if (!servicesTrack || !prevButton || !nextButton || !dotsContainer) return;
  
  const services = servicesTrack.children;
  const totalServices = services.length;
  let currentIndex = 0;
  
  // Calculate services per view based on screen size
  const getServicesPerView = () => {
    return window.innerWidth >= 768 ? 2 : 1; // 2 on desktop, 1 on mobile
  };
  
  let servicesPerView = getServicesPerView();
  const maxIndex = Math.max(0, totalServices - servicesPerView);
  
  // Create dots indicators
  function createDots() {
    if (!dotsContainer) return;
    
    dotsContainer.innerHTML = '';
    const totalDots = Math.ceil(totalServices / servicesPerView);
    
    for (let i = 0; i < totalDots; i++) {
      const dot = document.createElement('button');
      dot.className = 'w-3 h-3 rounded-full transition-colors duration-300';
      dot.addEventListener('click', () => goToSlide(i * servicesPerView));
      dotsContainer.appendChild(dot);
    }
    updateDots();
  }
  
  // Update dots appearance
  function updateDots() {
    if (!dotsContainer) return;
    
    const dots = dotsContainer.children;
    const activeDotIndex = Math.floor(currentIndex / servicesPerView);
    
    Array.from(dots).forEach((dot, index) => {
      const htmlDot = dot as HTMLElement;
      if (index === activeDotIndex) {
        htmlDot.className = 'w-3 h-3 rounded-full bg-blue-600 transition-colors duration-300';
      } else {
        htmlDot.className = 'w-3 h-3 rounded-full bg-gray-300 hover:bg-gray-400 transition-colors duration-300';
      }
    });
  }
  
  // Update carousel position
  function updateCarousel() {
    if (!servicesTrack) return;
    
    const translateX = -(currentIndex * (100 / servicesPerView));
    servicesTrack.style.transform = `translateX(${translateX}%)`;
    
    // Update button states
    if (prevButton) {
      prevButton.disabled = currentIndex === 0;
    }
    
    if (nextButton) {
      nextButton.disabled = currentIndex >= maxIndex;
    }
    
    updateDots();
  }
  
  // Go to specific slide
  function goToSlide(index: number) {
    currentIndex = Math.max(0, Math.min(index, maxIndex));
    updateCarousel();
  }
  
  // Previous slide
  function prevSlide() {
    if (currentIndex > 0) {
      currentIndex--;
      updateCarousel();
    }
  }
  
  // Next slide
  function nextSlide() {
    if (currentIndex < maxIndex) {
      currentIndex++;
      updateCarousel();
    }
  }
  
  // Event listeners
  prevButton.addEventListener('click', prevSlide);
  nextButton.addEventListener('click', nextSlide);
  
  // Auto-advance carousel
  let autoAdvanceInterval: number | null = null;
  
  function startAutoAdvance() {
    autoAdvanceInterval = window.setInterval(() => {
      if (currentIndex >= maxIndex) {
        goToSlide(0); // Go back to start
      } else {
        nextSlide();
      }
    }, 5000); // Change slide every 5 seconds
  }
  
  function stopAutoAdvance() {
    if (autoAdvanceInterval) {
      clearInterval(autoAdvanceInterval);
      autoAdvanceInterval = null;
    }
  }
  
  // Pause auto-advance on hover
  const whyChooseSection = document.getElementById('why-choose-us');
  whyChooseSection?.addEventListener('mouseenter', stopAutoAdvance);
  whyChooseSection?.addEventListener('mouseleave', startAutoAdvance);
  
  // Handle window resize
  window.addEventListener('resize', () => {
    const newServicesPerView = getServicesPerView();
    if (newServicesPerView !== servicesPerView) {
      servicesPerView = newServicesPerView;
      currentIndex = 0; // Reset to first slide
      createDots();
      updateCarousel();
    }
  });
  
  // Touch/swipe support for mobile
  let startX = 0;
  let isDragging = false;
  
  servicesTrack.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
    isDragging = true;
    stopAutoAdvance();
  });
  
  servicesTrack.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    e.preventDefault();
  });
  
  servicesTrack.addEventListener('touchend', (e) => {
    if (!isDragging) return;
    
    const endX = e.changedTouches[0].clientX;
    const diff = startX - endX;
    
    if (Math.abs(diff) > 50) { // Minimum swipe distance
      if (diff > 0) {
        nextSlide(); // Swipe left - next slide
      } else {
        prevSlide(); // Swipe right - previous slide
      }
    }
    
    isDragging = false;
    startAutoAdvance();
  });
  
  // Initialize
  createDots();
  updateCarousel();
  startAutoAdvance();
  
  // Pause auto-advance when page is hidden
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      stopAutoAdvance();
    } else {
      startAutoAdvance();
    }
  });
});
