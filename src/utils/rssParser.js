// rssParser.js - Utility for parsing RSS feeds in both SSR and client environments

// Check if we're in a server-side environment or browser environment
const isSSR = typeof window === 'undefined';

/**
 * Parse RSS feed from text content, adaptable for both server-side and browser environments
 * @param {string} xmlText - The raw XML text to parse
 * @returns {Array<Object>} - Array of parsed items
 */
export async function parseRSSFeed(xmlText) {
  try {
    if (isSSR) {
      // Server-side parsing
      return parseRSSFeedServer(xmlText);
    } else {
      // Client-side parsing
      return parseRSSFeedClient(xmlText);
    }
  } catch (error) {
    console.error('Error parsing RSS feed:', error);
    return [];
  }
}

// Server-side RSS parsing function
async function parseRSSFeedServer(xmlText) {
  try {
    // We need to dynamically import fast-xml-parser to avoid issues on client-side
    const { XMLParser } = await import('fast-xml-parser');
    const parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: "@_"
    });
    
    const parsed = parser.parse(xmlText);
    let items = parsed.rss?.channel?.item || [];
    
    // Ensure items is an array (handles case where there's only one item)
    if (!Array.isArray(items)) {
      items = [items];
    }

    return items.map(item => ({
      title: item.title || '',
      link: item.link || '',
      pubDate: item.pubDate || '',
      description: item.description || '',
      // Add any other needed fields
    }));
  } catch (error) {
    console.error('Error in server-side RSS parsing:', error);
    return [];
  }
}

// Client-side RSS parsing function
function parseRSSFeedClient(xmlText) {
  try {
    // Client-side: Use DOMParser
    const parser = new DOMParser();
    const xml = parser.parseFromString(xmlText, 'application/xml');
    const itemNodes = xml.querySelectorAll('item');
    
    // Convert NodeList to array of objects with consistent properties
    return Array.from(itemNodes).map(node => ({
      title: node.querySelector('title')?.textContent || '',
      link: node.querySelector('link')?.textContent || '',
      pubDate: node.querySelector('pubDate')?.textContent || '',
      description: node.querySelector('description')?.textContent || '',
      // Add any other needed fields
    }));
  } catch (error) {
    console.error('Error in client-side RSS parsing:', error);
    return [];
  }
}

/**
 * Extract the image URL from HTML content (usually from description)
 * @param {string} htmlContent - HTML content to extract image from
 * @returns {string} - Image URL or default image path
 */
export function extractImageFromHTML(htmlContent) {
  try {
    // Match the first img tag and extract src attribute
    const imgMatch = htmlContent.match(/<img[^>]+src="([^">]+)"/);
    if (imgMatch && imgMatch[1]) {
      return imgMatch[1];
    }
  } catch (error) {
    console.error('Error extracting image from HTML:', error);
  }
  
  // Return default image if no image found
  return '/blog-placeholder-1.jpg';
}

/**
 * Format a date string to a human-readable format
 * @param {string} dateString - Date string to format
 * @returns {string} - Formatted date string
 */
export function formatDate(dateString) {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Unknown date';
  }
}

/**
 * Clean HTML content by removing HTML tags and truncating
 * @param {string} htmlContent - HTML content to clean
 * @param {number} maxLength - Maximum length of cleaned text
 * @returns {string} - Cleaned text
 */
export function cleanHTML(htmlContent, maxLength = 150) {
  try {
    // Remove HTML tags and trim whitespace
    const cleanText = htmlContent.replace(/<[^>]*>/g, '').trim();
    
    // Truncate if needed
    if (cleanText.length > maxLength) {
      return cleanText.substring(0, maxLength) + '...';
    }
    
    return cleanText;
  } catch (error) {
    console.error('Error cleaning HTML content:', error);
    return '';
  }
}
