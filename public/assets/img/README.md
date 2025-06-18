# Image Assets Directory

This directory contains all the image assets used in your Astro portfolio site.

## Current Assets

- `about.jpeg` - Image used on the About page
- `avatar.jpg` - Your profile/avatar image
- `img.jpg` - General purpose image
- `portfolio-thumbnail.jpg` - Default Open Graph image for social sharing (placeholder)

## Images To Copy From Old Portfolio

- Project screenshots and thumbnails
- Any additional background images or icons
- Favicon and app icons

## Source Location

The original image files can be found at:
[https://github.com/arnabdey73/arnabdey73.github.io/tree/main/assets/img/](https://github.com/arnabdey73/arnabdey73.github.io/tree/main/assets/img/)

## Image Optimization

When adding images to your portfolio, consider the following best practices:

- Optimize images for web using tools like [Squoosh](https://squoosh.app/)
- Use WebP format when possible for better compression
- Keep file sizes under 200KB for better performance
- Use descriptive filenames (e.g., `project-azure-dashboard.webp`)

## Recommended Image Dimensions

- Project thumbnails: 600x400px
- Avatar/profile: 400x400px (1:1 ratio)
- Open Graph/social sharing: 1200x630px
- Background images: 1920x1080px or larger

## Important Note

Remember that images placed in the `public` directory are served as-is, without processing by Astro. For images that need processing (optimization, responsive variants), consider using Astro's image integration.
