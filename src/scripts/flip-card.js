// Add click, touch, and keyboard functionality for flip card
document.addEventListener('DOMContentLoaded', () => {
  const flipCards = document.querySelectorAll('.flip-card');
  // Detect if device is touch-enabled
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  
  flipCards.forEach(card => {
    // Make the card focusable
    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'button');
    card.setAttribute('aria-label', 'Profile photo. Press Enter, Space, or tap to flip the card.');
    
    if (isTouchDevice) {
      // Disable hover effect on touch devices and rely on click/tap
      const innerCard = card.querySelector('.flip-card-inner');
      card.classList.add('touch-device');
      
      // For mobile devices, remove the hover effect and rely on touch
      card.addEventListener('touchstart', function() {
        // This empty handler enables the :active pseudo class on iOS
      }, false);
    }
    
    // Add click event
    card.addEventListener('click', () => {
      toggleCardFlip(card);
    });
    
    // Add keyboard event
    card.addEventListener('keydown', (e) => {
      // Enter or Space key
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleCardFlip(card);
      }
    });
  });
  
  // Helper function to toggle card flip
  function toggleCardFlip(card) {
    const inner = card.querySelector('.flip-card-inner');
    const isFlipped = inner.style.transform === 'rotateY(180deg)';
    
    // Toggle the transform
    inner.style.transform = isFlipped ? '' : 'rotateY(180deg)';
    
    // Update aria attributes for accessibility
    card.setAttribute('aria-pressed', isFlipped ? 'false' : 'true');
    
    // Update the instruction for screen readers
    const newInstruction = isFlipped ? 
      'Profile photo. Press Enter, Space, or tap to flip the card.' :
      'Alternate photo showing. Press Enter, Space, or tap to flip back.';
    card.setAttribute('aria-label', newInstruction);
    
    // Add a class to indicate the card is flipped for CSS targeting
    card.classList.toggle('is-flipped', !isFlipped);
  }
});
