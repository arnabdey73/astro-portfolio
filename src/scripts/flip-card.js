// Enhanced flip card functionality with smooth image switching
document.addEventListener('DOMContentLoaded', () => {
  const flipCards = document.querySelectorAll('.flip-card');
  // Detect if device is touch-enabled
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  
  flipCards.forEach(card => {
    // Make the card focusable and set initial state
    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'button');
    card.setAttribute('aria-label', 'Profile photo. Press Enter, Space, or tap to flip and see alternate view.');
    card.setAttribute('data-flipped', 'false');
    
    if (isTouchDevice) {
      // Disable hover effect on touch devices and rely on click/tap
      card.classList.add('touch-device');
      
      // For mobile devices, add visual feedback on touch
      card.addEventListener('touchstart', function() {
        card.classList.add('touch-active');
      }, false);
      
      card.addEventListener('touchend', function() {
        setTimeout(() => card.classList.remove('touch-active'), 150);
      }, false);
    }
    
    // Enhanced click event with visual feedback
    card.addEventListener('click', (e) => {
      e.preventDefault();
      toggleCardFlip(card);
      // Add a subtle scale effect on click
      card.style.transform = 'scale(0.98)';
      setTimeout(() => {
        card.style.transform = '';
      }, 150);
    });
    
    // Enhanced keyboard event
    card.addEventListener('keydown', (e) => {
      // Enter or Space key
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleCardFlip(card);
        // Add visual feedback for keyboard users
        card.classList.add('keyboard-active');
        setTimeout(() => card.classList.remove('keyboard-active'), 200);
      }
    });
    
    // Add mouse enter/leave events for better desktop experience
    if (!isTouchDevice) {
      let hoverTimeout;
      
      card.addEventListener('mouseenter', () => {
        // Clear any existing timeout
        clearTimeout(hoverTimeout);
        // Auto-flip after a short delay on hover
        hoverTimeout = setTimeout(() => {
          if (!card.classList.contains('manually-flipped')) {
            toggleCardFlip(card, true); // true indicates auto-flip
          }
        }, 500);
      });
      
      card.addEventListener('mouseleave', () => {
        clearTimeout(hoverTimeout);
        // Auto-flip back if it was auto-flipped
        if (card.getAttribute('data-auto-flipped') === 'true') {
          setTimeout(() => {
            toggleCardFlip(card, true);
          }, 300);
        }
      });
    }
  });
  
  // Enhanced helper function to toggle card flip with better state management
  function toggleCardFlip(card, isAutoFlip = false) {
    const inner = card.querySelector('.flip-card-inner');
    const isCurrentlyFlipped = card.getAttribute('data-flipped') === 'true';
    
    // Toggle the transform
    inner.style.transform = isCurrentlyFlipped ? 'rotateY(0deg)' : 'rotateY(180deg)';
    
    // Update state attributes
    card.setAttribute('data-flipped', isCurrentlyFlipped ? 'false' : 'true');
    card.setAttribute('data-auto-flipped', isAutoFlip ? 'true' : 'false');
    
    // Mark as manually flipped if user clicked/tapped
    if (!isAutoFlip) {
      card.classList.toggle('manually-flipped', !isCurrentlyFlipped);
    }
    
    // Update aria attributes for accessibility
    card.setAttribute('aria-pressed', isCurrentlyFlipped ? 'false' : 'true');
    
    // Update the instruction for screen readers
    const newInstruction = isCurrentlyFlipped ? 
      'Profile photo showing. Press Enter, Space, or tap to see alternate view.' :
      'Alternate photo showing. Press Enter, Space, or tap to return to main photo.';
    card.setAttribute('aria-label', newInstruction);
    
    // Add CSS class to indicate flip state for styling
    card.classList.toggle('is-flipped', !isCurrentlyFlipped);
    
    // Add a subtle pulse effect to indicate the change
    card.classList.add('flip-transition');
    setTimeout(() => {
      card.classList.remove('flip-transition');
    }, 800);
    
    // Announce to screen readers
    if (!isAutoFlip) {
      announceToScreenReader(isCurrentlyFlipped ? 'Showing main profile photo' : 'Showing alternate photo');
    }
  }
  
  // Helper function for screen reader announcements
  function announceToScreenReader(message) {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.style.position = 'absolute';
    announcement.style.left = '-10000px';
    announcement.style.width = '1px';
    announcement.style.height = '1px';
    announcement.style.overflow = 'hidden';
    
    document.body.appendChild(announcement);
    announcement.textContent = message;
    
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  }
});
