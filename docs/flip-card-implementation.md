# Flip Card Animation Implementation

I've implemented a flip card animation that displays `avatar.jpg` on the front and `img.jpg` on the back side of the profile image. Here's what I've done:

## Features Added

1. Created a flip card animation that shows:
   - `avatar.jpg` on the front side
   - `img.jpg` on the back side when hovered or clicked

2. Added the flip card to both:
   - Homepage in the hero section
   - About page in the profile section

3. Enhanced with accessibility features:
   - Keyboard navigation support (tab, enter, space)
   - ARIA labels and roles
   - Reduced motion support
   - Focus states

4. Mobile optimization:
   - Touch event support
   - Responsive sizing
   - Clear tap instructions on mobile

5. Visual enhancements:
   - Hover instruction text
   - Smooth transition effects
   - Compatible with both light and dark mode

## Files Created/Modified

- Created `/src/styles/flip-animation.css` for the flip animation styles
- Created `/src/scripts/flip-card.js` for interactive functionality
- Updated `Layout.astro` to include the new CSS file
- Updated `index.astro` and `about.astro` to implement the flip cards
- Updated image placeholder README with better instructions

## How It Works

The flip card uses CSS 3D transforms to create the flip effect. When a user hovers or clicks on the card:
1. The card rotates 180 degrees on the Y-axis
2. The back face becomes visible
3. The front face is hidden

On mobile devices or touch screens, the hover effect is disabled and the card will flip only when tapped. All interactions are keyboard accessible for better accessibility.

## Next Steps

You may want to consider:
1. Adding more images to create a multi-face flip card
2. Adding custom transitions between the images
3. Implementing a slideshow effect with multiple images
4. Creating a gallery section with multiple flip cards
