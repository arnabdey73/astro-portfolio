export function getRandomPlaceholderImage(index) {
  const placeholders = [
    '/blog-placeholder-1.jpg',
    '/blog-placeholder-2.jpg',
    '/blog-placeholder-3.jpg',
    '/blog-placeholder-4.jpg',
    '/blog-placeholder-5.jpg'
  ];
  
  if (typeof index === 'number' && index < placeholders.length) {
    return placeholders[index];
  }
  
  return placeholders[Math.floor(Math.random() * placeholders.length)];
}
