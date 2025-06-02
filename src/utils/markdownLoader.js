// markdownLoader.js - Utility for loading markdown files from disk
import fs from 'node:fs/promises';
import path from 'node:path';

/**
 * Load a markdown file from the content directory
 * @param {string} slug - The slug of the markdown file to load (without extension)
 * @returns {Promise<{content: string, metadata: object}>} - The content and metadata of the markdown file
 */
export async function loadMarkdownFile(slug) {
  try {
    // Normalize the slug to match the filename
    const normalizedSlug = slug.startsWith('/') ? slug.substring(1) : slug;
    const filePath = path.join(process.cwd(), 'content', `${normalizedSlug}.md`);
    
    // Read the file
    const content = await fs.readFile(filePath, 'utf-8');
    
    // Extract frontmatter metadata if any
    const metadata = extractFrontmatter(content);
    
    // Return the content without frontmatter
    return {
      content: removeFrontmatter(content),
      metadata
    };
  } catch (error) {
    console.error(`Error loading markdown file for slug "${slug}":`, error);
    return {
      content: '',
      metadata: { title: 'Not Found', slug }
    };
  }
}

/**
 * Extract frontmatter metadata from a markdown file
 * @param {string} content - The content of the markdown file
 * @returns {object} - The extracted metadata
 */
function extractFrontmatter(content) {
  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n/;
  const match = content.match(frontmatterRegex);
  
  if (!match) {
    return {};
  }
  
  const frontmatter = match[1];
  const metadata = {};
  
  // Extract key-value pairs
  frontmatter.split('\n').forEach(line => {
    const colonIndex = line.indexOf(':');
    if (colonIndex !== -1) {
      const key = line.substring(0, colonIndex).trim();
      let value = line.substring(colonIndex + 1).trim();
      
      // Remove quotes if present
      if ((value.startsWith('"') && value.endsWith('"')) || 
          (value.startsWith("'") && value.endsWith("'"))) {
        value = value.substring(1, value.length - 1);
      }
      
      metadata[key] = value;
    }
  });
  
  return metadata;
}

/**
 * Remove frontmatter from a markdown file's content
 * @param {string} content - The content of the markdown file
 * @returns {string} - The content without frontmatter
 */
function removeFrontmatter(content) {
  const frontmatterRegex = /^---\s*\n[\s\S]*?\n---\s*\n/;
  return content.replace(frontmatterRegex, '');
}
