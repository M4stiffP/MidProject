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
    
    // Wait for DOM to be fully loaded before setting up
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        this.initialize();
      });
    } else {
      this.initialize();
    }
  }

  private initialize(): void {
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
    if (shoeType === 'bondi8') {
      switch (colorValue) {
        case 'black':
          img.src = 'image/shoe/HOKA Bondi8 6490/HK_Bondi8_Black.png';
          break;
        case 'cream':
          img.src = 'image/shoe/HOKA Bondi8 6490/HK_Bondi8_Cream.png';
          break;
        case 'cyan':
          img.src = 'image/shoe/HOKA Bondi8 6490/HK_Bondi8_Cyan.png';
          break;
        case 'white':
          img.src = 'image/shoe/HOKA Bondi8 6490/HK_Bondi8_White.png';
          break;
      }
    }
    // HOKA Bondi 9 Wide color change
    if (shoeType === 'bondi9-wide') {
      switch (colorValue) {
        case 'black':
          img.src = 'image/shoe/HOKA Bondi9 Wide 6990/HK_Bondi9Wide_Black.png';
          break;
        case 'blue':
          img.src = 'image/shoe/HOKA Bondi9 Wide 6990/HK_Bondi9Wide_Blue.png';
          break;
        case 'cyan':
          img.src = 'image/shoe/HOKA Bondi9 Wide 6990/HK_Bondi9Wide_Cyan.png';
          break;
        case 'gold':
          img.src = 'image/shoe/HOKA Bondi9 Wide 6990/HK_Bondi9Wide_Gold.png';
          break;
      }
    }
    // Nike Alphafly 3 color change
    if (shoeType === 'nike-alphafly3') {
      switch (colorValue) {
        case 'blue':
          img.src = 'image/shoe/NIKE Alphafly 3  9400/Nike_Alphafly3_Blue.png';
          break;
        case 'green':
          img.src = 'image/shoe/NIKE Alphafly 3  9400/Nike_Alphafly3_Green.png';
          break;
        case 'orange':
          img.src = 'image/shoe/NIKE Alphafly 3  9400/Nike_Alphafly3_Orange.png';
          break;
        case 'white':
          img.src = 'image/shoe/NIKE Alphafly 3  9400/Nike_Alphafly3_White.png';
          break;
      }
    }
    // NEW BALANCE 327 color change
    if (shoeType === 'nb327') {
      switch (colorValue) {
        case 'black':
          img.src = 'image/shoe/NEW BALANCE 327  3600/NB_327_Black.png';
          break;
        case 'blue':
          img.src = 'image/shoe/NEW BALANCE 327  3600/NB_327_Blue.png';
          break;
        case 'cream':
          img.src = 'image/shoe/NEW BALANCE 327  3600/NB_327_Cream.png';
          break;
        case 'white':
          img.src = 'image/shoe/NEW BALANCE 327  3600/NB_327_White.png';
          break;
      }
    }
    // NEW BALANCE 530 color change
    if (shoeType === 'nb530') {
      switch (colorValue) {
        case 'black':
          img.src = 'image/shoe/NEW BALANCE 530  3900/NB_530_Black.png';
          break;
        case 'gray':
          img.src = 'image/shoe/NEW BALANCE 530  3900/NB_530_Gray.png';
          break;
        case 'pink':
          img.src = 'image/shoe/NEW BALANCE 530  3900/NB_530_Pink.png';
          break;
        case 'silver':
          img.src = 'image/shoe/NEW BALANCE 530  3900/NB_530_Silver.png';
          break;
      }
    }
    // HOKA Hopara 2 color change
    if (shoeType === 'hopara2') {
      switch (colorValue) {
        case 'black':
          img.src = 'image/shoe/HOKA Hopara 2  5490/HK_Hopara2_Black.png';
          break;
        case 'cream':
          img.src = 'image/shoe/HOKA Hopara 2  5490/HK_Hopara2_Cream.png';
          break;
        case 'gray':
          img.src = 'image/shoe/HOKA Hopara 2  5490/HK_Hopara2_Gray.png';
          break;
        case 'green':
          img.src = 'image/shoe/HOKA Hopara 2  5490/HK_Hopara2_Green.png';
          break;
      }
    }
    // NIKE Pegasus 41 color change
    if (shoeType === 'nike-pegasus41') {
      switch (colorValue) {
        case 'black':
          img.src = 'image/shoe/NIKE Pegasus 41  5200/Nike_Pegasus_Black.png';
          break;
        case 'blue':
          img.src = 'image/shoe/NIKE Pegasus 41  5200/Nike_Pegasus_Blue.png';
          break;
        case 'gray':
          img.src = 'image/shoe/NIKE Pegasus 41  5200/Nike_Pegasus_Gray.png';
          break;
        case 'pink':
          img.src = 'image/shoe/NIKE Pegasus 41  5200/Nike_Pegasus_Pink.png';
          break;
      }
    }
    // NIKE Vomero 18 color change
    if (shoeType === 'nike-vomero18') {
      switch (colorValue) {
        case 'black':
          img.src = 'image/shoe/NIKE Vomero 18  5500/Nike_Vomero18_Black.png';
          break;
        case 'blue':
          img.src = 'image/shoe/NIKE Vomero 18  5500/Nike_Vomero18_Blue.png';
          break;
        case 'cyan':
          img.src = 'image/shoe/NIKE Vomero 18  5500/Nike_Vomero18_Cyan.png';
          break;
      }
    }
    // HOKA Kawana color change
    if (shoeType === 'kawana') {
      switch (colorValue) {
        case 'black':
          img.src = 'image/shoe/HOKA Kawana  5490/HK_Kawana_Black.png';
          break;
        case 'blue':
          img.src = 'image/shoe/HOKA Kawana  5490/HK_Kawana_Blue.png';
          break;
        case 'gray':
          img.src = 'image/shoe/HOKA Kawana  5490/HK_Kawana_Gray.png';
          break;
        case 'white':
          img.src = 'image/shoe/HOKA Kawana  5490/HK_Kawana_White.png';
          break;
      }
    }
    // HOKA Mach 6 color change
    if (shoeType === 'mach6') {
      switch (colorValue) {
        case 'cyan':
          img.src = 'image/shoe/HOKA Mach 6  5990/HK_Mach6_Cyan.png';
          break;
        case 'green':
          img.src = 'image/shoe/HOKA Mach 6  5990/HK_Mach6_Green.png';
          break;
        case 'white':
          img.src = 'image/shoe/HOKA Mach 6  5990/HK_Mach6_White.png';
          break;
        case 'yellow':
          img.src = 'image/shoe/HOKA Mach 6  5990/HK_Mach6_Yellow.png';
          break;
      }
    }
    // HOKA Rincon 4 Wide color change
    if (shoeType === 'rincon4-wide') {
      switch (colorValue) {
        case 'black':
          img.src = 'image/shoe/HOKA Rincon 4 Wide 4990/HK_Rincon4_Black.png';
          break;
        case 'blue':
          img.src = 'image/shoe/HOKA Rincon 4 Wide 4990/HK_Rincon4_Blue.png';
          break;
        case 'cream':
          img.src = 'image/shoe/HOKA Rincon 4 Wide 4990/HK_Rincon4_Cream.png';
          break;
        case 'white':
          img.src = 'image/shoe/HOKA Rincon 4 Wide 4990/HK_Rincon4_White.png';
          break;
      }
    }
    // Columbia card color change (optional, add more if needed)
    if (shoeType === 'columbia') {
      switch (colorValue) {
        case 'brown':
          img.src = 'image/shoe/COLUMBIA.png';
          break;
        case 'black':
          img.src = 'image/shoe/COLUMBIA.png'; // ถ้ามีไฟล์สีดำแยก ให้เปลี่ยน path
          break;
        case 'grey':
          img.src = 'image/shoe/COLUMBIA.png'; // ถ้ามีไฟล์สีเทาแยก ให้เปลี่ยน path
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
    
    // Get selected size and color, with defaults if none selected
    let selectedSize = card.querySelector('.size span.selected')?.textContent;
    let selectedColor = card.querySelector('.color span.selected')?.getAttribute('data-color');
    
    // Set defaults if nothing is selected
    if (!selectedSize) {
      const firstSizeElement = card.querySelector('.size span[data-size]');
      if (firstSizeElement) {
        firstSizeElement.classList.add('selected');
        selectedSize = firstSizeElement.textContent || '40';
      } else {
        selectedSize = '40';
      }
    }
    
    if (!selectedColor) {
      const firstColorElement = card.querySelector('.color span[data-color]');
      if (firstColorElement) {
        firstColorElement.classList.add('selected');
        selectedColor = firstColorElement.getAttribute('data-color') || 'default';
        // Update image when auto-selecting color
        this.updateShoeImage(firstColorElement as HTMLElement);
      } else {
        selectedColor = 'default';
      }
    }
    
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
    button.textContent = '✓ เพิ่มแล้ว!';
    button.style.background = '#10b981';
    button.style.color = '#ffffff';
    
    setTimeout(() => {
      button.textContent = originalText;
      button.style.background = '';
      button.style.color = '';
    }, 1500);
  }

  private updateCartDisplay(): void {
    if (!this.cartItems || !this.cartTotal || !this.cartSummary) return;

    // Clear current items and remove old event listeners
    this.cartItems.innerHTML = '';
    
    // Remove existing event listeners to prevent duplication
    const newCartItems = this.cartItems.cloneNode(true) as HTMLElement;
    this.cartItems.parentNode?.replaceChild(newCartItems, this.cartItems);
    this.cartItems = newCartItems;

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
        <div class="item-details">ไซส์: ${item.size}, สี: ${item.color}</div>
        <div class="flex justify-between items-center mt-2">
          <span class="item-price">฿${item.price.toLocaleString()}</span>
          <div class="quantity-controls flex items-center gap-2">
            <button class="decrease-qty bg-gray-200 hover:bg-gray-300 w-6 h-6 rounded-full text-sm" data-id="${item.id}">-</button>
            <span class="quantity font-bold">${item.quantity}</span>
            <button class="increase-qty bg-amber-200 hover:bg-amber-300 w-6 h-6 rounded-full text-sm" data-id="${item.id}">+</button>
            <button class="remove-item text-red-500 hover:text-red-700 text-lg font-bold ml-2" data-id="${item.id}">×</button>
          </div>
        </div>
      `;
      
      if (this.cartItems) {
        this.cartItems.appendChild(itemElement);
      }
    });

    // Update total
    this.cartTotal.textContent = `฿${total.toLocaleString()}`;

    // Add single event listener for cart item interactions
    this.cartItems.addEventListener('click', (e: Event) => {
      const target = e.target as HTMLElement;
      const itemId = target.getAttribute('data-id');
      
      if (target.classList.contains('remove-item')) {
        this.removeItem(itemId);
      } else if (target.classList.contains('increase-qty')) {
        this.changeQuantity(itemId, 1);
      } else if (target.classList.contains('decrease-qty')) {
        this.changeQuantity(itemId, -1);
      }
    });
  }

  private removeItem(itemId: string | null): void {
    if (!itemId) return;
    
    this.items = this.items.filter(item => item.id !== itemId);
    this.updateCartDisplay();
  }

  private changeQuantity(itemId: string | null, change: number): void {
    if (!itemId) return;
    
    const item = this.items.find(item => item.id === itemId);
    if (!item) return;
    
    item.quantity += change;
    
    // Remove item if quantity becomes 0 or less
    if (item.quantity <= 0) {
      this.removeItem(itemId);
      return;
    }
    
    // Limit maximum quantity to 99
    if (item.quantity > 99) {
      item.quantity = 99;
    }
    
    this.updateCartDisplay();
  }

  private checkout(): void {
    if (this.items.length === 0) {
      alert('ตะกร้าของคุณว่างเปล่า!');
      return;
    }

    try {
      const total = this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      const itemCount = this.items.reduce((sum, item) => sum + item.quantity, 0);
      
      // Create order summary
      let orderSummary = 'รายการสั่งซื้อ:\n\n';
      this.items.forEach(item => {
        orderSummary += `${item.name} (ไซส์: ${item.size}, สี: ${item.color})\n`;
        orderSummary += `จำนวน: ${item.quantity} x ฿${item.price.toLocaleString()} = ฿${(item.price * item.quantity).toLocaleString()}\n\n`;
      });
      
      const confirmed = confirm(`${orderSummary}จำนวนสินค้า: ${itemCount} ชิ้น\nยอดรวม: ฿${total.toLocaleString()}\n\nต้องการสั่งซื้อสินค้าเหล่านี้ใช่หรือไม่?`);
      
      if (confirmed) {
        alert(`ขอบคุณสำหรับการสั่งซื้อ!\n\nจำนวนสินค้า: ${itemCount} ชิ้น\nยอดรวม: ฿${total.toLocaleString()}\n\nคำสั่งซื้อของคุณจะได้รับการดำเนินการในไม่ช้า`);
        this.clearCart();
      }
    } catch (error) {
      console.error('Error during checkout:', error);
      alert('เกิดข้อผิดพลาดในระหว่างการสั่งซื้อ กรุณาลองใหม่อีกครั้ง');
    }
  }

  private clearCart(): void {
    this.items = [];
    this.updateCartDisplay();
    
    // Show feedback that cart was cleared
    const clearBtn = document.getElementById('clear-cart-btn');
    if (clearBtn) {
      const originalText = clearBtn.textContent;
      clearBtn.textContent = '✓ ล้างแล้ว!';
      clearBtn.style.background = '#10b981';
      
      setTimeout(() => {
        clearBtn.textContent = originalText;
        clearBtn.style.background = '';
      }, 1500);
    }
  }
}

// Initialize shopping cart
document.addEventListener('DOMContentLoaded', () => {
  new ShoppingCart();
});

// Handle navigation to why-choose-us section
document.addEventListener('click', (e: Event) => {
  const target = e.target as HTMLElement;

  // Handle navigation to why-choose-us section
  if (target.textContent?.includes('Why Us') || target.getAttribute('href') === '#why-choose-us') {
    e.preventDefault();
    const whyChooseUsSection = document.getElementById('why-choose-us');
    whyChooseUsSection?.scrollIntoView({ behavior: 'smooth' });
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
