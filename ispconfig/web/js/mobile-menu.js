/**
 * Mobile Menu Handler for MATRIX CBS
 * Compatible with iOS Safari, Android Chrome, and all modern browsers
 */
(function() {
  'use strict';

  // Wait for DOM to be ready
  document.addEventListener('DOMContentLoaded', function() {
    initMobileMenu();
  });

  // Also run on load in case DOMContentLoaded already fired
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    setTimeout(initMobileMenu, 1);
  }

  function initMobileMenu() {
    // Find the hamburger button
    var menuButton = document.querySelector('button[aria-label="Menü megnyitása"]');
    if (!menuButton) {
      menuButton = document.querySelector('header button.lg\\:hidden');
    }
    
    if (!menuButton) {
      console.log('Mobile menu button not found');
      return;
    }

    // Find the mobile menu container (div after nav with max-h-0)
    var mobileMenu = document.querySelector('header nav + div.lg\\:hidden');
    if (!mobileMenu) {
      mobileMenu = document.querySelector('header .lg\\:hidden.overflow-hidden');
    }
    
    if (!mobileMenu) {
      console.log('Mobile menu container not found');
      return;
    }

    var isOpen = false;

    // Toggle menu function
    function toggleMenu(e) {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }
      
      isOpen = !isOpen;
      
      if (isOpen) {
        mobileMenu.style.maxHeight = '400px';
        mobileMenu.style.opacity = '1';
        mobileMenu.classList.add('mobile-menu-open');
        menuButton.setAttribute('aria-label', 'Menü bezárása');
        menuButton.innerHTML = '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>';
      } else {
        mobileMenu.style.maxHeight = '0';
        mobileMenu.style.opacity = '0';
        mobileMenu.classList.remove('mobile-menu-open');
        menuButton.setAttribute('aria-label', 'Menü megnyitása');
        menuButton.innerHTML = '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>';
      }
    }

    // Close menu when clicking a link
    function closeMenuOnLinkClick() {
      if (isOpen) {
        toggleMenu();
      }
    }

    // Add click event to menu button
    menuButton.addEventListener('click', toggleMenu);
    
    // Touch support for iOS
    menuButton.addEventListener('touchend', function(e) {
      e.preventDefault();
      toggleMenu(e);
    }, { passive: false });

    // Close menu when clicking on links
    var menuLinks = mobileMenu.querySelectorAll('a');
    menuLinks.forEach(function(link) {
      link.addEventListener('click', closeMenuOnLinkClick);
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
      if (isOpen && !mobileMenu.contains(e.target) && !menuButton.contains(e.target)) {
        toggleMenu();
      }
    });

    // Close menu on escape key
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && isOpen) {
        toggleMenu();
      }
    });

    // Handle resize - close menu if switching to desktop
    window.addEventListener('resize', function() {
      if (window.innerWidth >= 1024 && isOpen) {
        toggleMenu();
      }
    });

    console.log('Mobile menu initialized successfully');
  }
})();
