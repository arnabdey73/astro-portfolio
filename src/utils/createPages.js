// Utility to create pages from GitHub content
import { fetchGithubPages } from './fetchContent.js';
import { getRandomPlaceholderImage } from './images.js';

export async function createPagesFromGithub() {
  try {
    const pages = await fetchGithubPages();
    
    // Enhance the pages with additional metadata
    return pages.map((page, index) => ({
      ...page,
      image: page.image || getRandomPlaceholderImage(index),
      date: page.date || new Date().toISOString(),
      author: page.author || 'Arnab Dey',
      tags: page.tags || ['cloud', 'devops', 'web development'],
      featured: page.featured || index === 0
    }));
  } catch (error) {
    console.error('Error creating pages from GitHub content:', error);
    return [];
  }
}

// Get page content by slug
export async function getPageBySlug(slug) {
  try {
    const pages = await createPagesFromGithub();
    return pages.find(page => page.slug === slug) || null;
  } catch (error) {
    console.error(`Error fetching page with slug ${slug}:`, error);
    return null;
  }
}
