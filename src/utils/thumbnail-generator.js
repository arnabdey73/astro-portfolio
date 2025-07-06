// Thumbnail generation utility for project cards

/**
 * Generates a dynamic SVG thumbnail for a project
 * @param {string} projectTitle - The title of the project
 * @param {string[]} technologies - Array of technologies used
 * @param {Object} options - Customization options
 * @returns {string} - Data URL for the generated SVG
 */
export function generateProjectThumbnail(projectTitle, technologies = [], options = {}) {
  const {
    width = 600,
    height = 400,
    primaryColor = '#4F46E5',
    secondaryColor = '#7C3AED',
    accentColor = '#EC4899',
    textColor = '#FFFFFF'
  } = options;

  // Generate initials from project title
  const initials = projectTitle
    .split(' ')
    .map(word => word[0])
    .join('')
    .slice(0, 3)
    .toUpperCase();

  // Get primary technology for display
  const primaryTech = technologies[0] || 'Web';
  
  // Create technology color mapping
  const techColors = {
    'Terraform': '#623CE4',
    'Azure': '#0078D4',
    'Python': '#3776AB',
    'JavaScript': '#F7DF1E',
    'Astro': '#FF5D01',
    'React': '#61DAFB',
    'Vue': '#4FC08D',
    'Node.js': '#339933',
    'TypeScript': '#3178C6',
    'Docker': '#2496ED',
    'Kubernetes': '#326CE5',
    'AWS': '#FF9900',
    'GCP': '#4285F4'
  };

  const gradientColor1 = techColors[primaryTech] || primaryColor;
  const gradientColor2 = techColors[technologies[1]] || secondaryColor;

  // Create pattern based on technology
  const createTechPattern = (tech) => {
    switch (tech.toLowerCase()) {
      case 'terraform':
        return `<circle cx="50" cy="50" r="5" fill="rgba(255,255,255,0.1)"/>
                <circle cx="550" cy="350" r="8" fill="rgba(255,255,255,0.1)"/>`;
      case 'azure':
        return `<polygon points="40,40 80,40 60,80" fill="rgba(255,255,255,0.1)"/>
                <polygon points="520,320 560,320 540,360" fill="rgba(255,255,255,0.1)"/>`;
      case 'python':
        return `<circle cx="50" cy="50" r="6" fill="rgba(255,255,255,0.15)"/>
                <circle cx="550" cy="350" r="6" fill="rgba(255,255,255,0.15)"/>`;
      default:
        return `<rect x="40" y="40" width="10" height="10" fill="rgba(255,255,255,0.1)" rx="2"/>
                <rect x="540" y="340" width="10" height="10" fill="rgba(255,255,255,0.1)" rx="2"/>`;
    }
  };

  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="mainGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${gradientColor1};stop-opacity:1" />
          <stop offset="100%" style="stop-color:${gradientColor2};stop-opacity:1" />
        </linearGradient>
        <linearGradient id="overlayGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style="stop-color:rgba(0,0,0,0.3);stop-opacity:1" />
          <stop offset="100%" style="stop-color:rgba(0,0,0,0.1);stop-opacity:1" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
          <feMerge> 
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      
      <!-- Background gradient -->
      <rect width="${width}" height="${height}" fill="url(#mainGrad)"/>
      
      <!-- Tech pattern decoration -->
      ${createTechPattern(primaryTech)}
      
      <!-- Overlay for text readability -->
      <rect width="${width}" height="${height}" fill="url(#overlayGrad)"/>
      
      <!-- Main initials -->
      <text x="${width/2}" y="${height/2 - 20}" 
            font-family="Arial, sans-serif" 
            font-size="72" 
            font-weight="bold" 
            text-anchor="middle" 
            fill="${textColor}"
            filter="url(#glow)">
        ${initials}
      </text>
      
      <!-- Primary technology indicator -->
      <text x="${width/2}" y="${height/2 + 40}" 
            font-family="Arial, sans-serif" 
            font-size="20" 
            font-weight="500"
            text-anchor="middle" 
            fill="rgba(255,255,255,0.9)">
        ${primaryTech}
      </text>
      
      <!-- Technology count indicator -->
      ${technologies.length > 1 ? `
        <text x="${width/2}" y="${height/2 + 70}" 
              font-family="Arial, sans-serif" 
              font-size="14" 
              text-anchor="middle" 
              fill="rgba(255,255,255,0.7)">
          +${technologies.length - 1} more
        </text>
      ` : ''}
      
      <!-- Corner accent -->
      <circle cx="${width - 40}" cy="40" r="3" fill="rgba(255,255,255,0.3)"/>
      <circle cx="40" cy="${height - 40}" r="3" fill="rgba(255,255,255,0.3)"/>
    </svg>
  `;
  
  // Use URL encoding for better browser compatibility
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

/**
 * Generates a thumbnail URL for a project, with fallback to auto-generated SVG
 * @param {Object} project - Project object with title, technologies, etc.
 * @returns {string} - URL or data URL for the thumbnail
 */
export function getProjectThumbnail(project) {
  // Check if project has a custom thumbnail
  if (project.thumbnail) {
    return project.thumbnail;
  }
  
  // Check if there's a conventional image file
  const conventionalPath = `/assets/img/projects/${project.title.toLowerCase().replace(/\s+/g, '-')}.jpg`;
  
  // For now, we'll always generate SVG thumbnails
  // In a production app, you might want to check if the file exists first
  return generateProjectThumbnail(project.title, project.technologies);
}

/**
 * Generates placeholder thumbnails for all projects that don't have custom ones
 * @param {Array} projects - Array of project objects
 * @returns {Array} - Projects with thumbnail URLs added
 */
export function addThumbnailsToProjects(projects) {
  return projects.map(project => ({
    ...project,
    thumbnailUrl: getProjectThumbnail(project)
  }));
}

/**
 * Creates a simple technology icon SVG
 * @param {string} technology - Technology name
 * @param {number} size - Icon size
 * @returns {string} - SVG data URL
 */
export function generateTechIcon(technology, size = 24) {
  const techIcons = {
    'Terraform': `<rect width="${size}" height="${size}" fill="#623CE4" rx="3"/>
                  <text x="${size/2}" y="${size/2 + 4}" font-family="Arial" font-size="10" text-anchor="middle" fill="white" font-weight="bold">T</text>`,
    'Azure': `<rect width="${size}" height="${size}" fill="#0078D4" rx="3"/>
              <text x="${size/2}" y="${size/2 + 4}" font-family="Arial" font-size="10" text-anchor="middle" fill="white" font-weight="bold">Az</text>`,
    'Python': `<rect width="${size}" height="${size}" fill="#3776AB" rx="3"/>
               <text x="${size/2}" y="${size/2 + 4}" font-family="Arial" font-size="10" text-anchor="middle" fill="white" font-weight="bold">Py</text>`,
    'JavaScript': `<rect width="${size}" height="${size}" fill="#F7DF1E" rx="3"/>
                   <text x="${size/2}" y="${size/2 + 4}" font-family="Arial" font-size="10" text-anchor="middle" fill="black" font-weight="bold">JS</text>`,
    'Astro': `<rect width="${size}" height="${size}" fill="#FF5D01" rx="3"/>
              <text x="${size/2}" y="${size/2 + 4}" font-family="Arial" font-size="10" text-anchor="middle" fill="white" font-weight="bold">A</text>`
  };

  const icon = techIcons[technology] || `<rect width="${size}" height="${size}" fill="#6B7280" rx="3"/>
                                         <text x="${size/2}" y="${size/2 + 4}" font-family="Arial" font-size="8" text-anchor="middle" fill="white">${technology[0]}</text>`;

  const svg = `<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">${icon}</svg>`;
  
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}
