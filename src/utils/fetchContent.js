// Utility to fetch blogs from external sources
import { parseRSSFeed, extractImageFromHTML, formatDate, cleanHTML } from './rssParser.js';

// Check if we're in a server-side environment
const isSSR = typeof window === 'undefined';

export async function fetchExternalBlogs() {
  try {
    // Handle SSR case - use fallback data directly if in SSR environment
    if (isSSR) {
      console.log('Running in SSR mode, using fallback blog data');
      return getFallbackBlogs();
    }
    
    // Client-side only code (browser environment)
    const response = await fetch('https://astro-paper-project.vercel.app/rss.xml');
    if (!response.ok) {
      throw new Error(`Failed to fetch RSS feed: ${response.status}`);
    }
    
    const text = await response.text();
    
    // Parse the RSS XML data using our environment-agnostic parser
    const items = await parseRSSFeed(text);
    
    // Convert to blog post format
    const blogPosts = items.slice(0, 5).map(item => {
      // Process the item data
      const title = item.title;
      const link = item.link;
      const pubDate = item.pubDate;
      const description = item.description;
      
      // Extract image from description
      const image = extractImageFromHTML(description);
      
      // Clean up the description
      const excerpt = cleanHTML(description, 150);
      
      // Format date
      const date = formatDate(pubDate);
      
      return {
        title,
        excerpt,
        date,
        image,
        slug: link,
        external: true
      };
    });
    
    return blogPosts;
  } catch (error) {
    console.error('Error fetching or processing external blogs:', error);
    return getFallbackBlogs();
  }
}

// Helper function to get fallback blog data when external fetch fails
function getFallbackBlogs() {
  return [
    {
      title: "Implementing CI/CD with GitHub Actions",
      excerpt: "Learn how to set up an efficient CI/CD pipeline using GitHub Actions for your web projects.",
      date: "May 15, 2023",
      image: "/blog-placeholder-1.jpg",
      slug: "https://astro-paper-project.vercel.app/posts/how-to-configure-astropaper-theme/",
      external: true
    },
    {
      title: "Kubernetes vs. Docker Swarm",
      excerpt: "A comparison of container orchestration tools and how to choose the right one for your project.",
      date: "April 28, 2023",
      image: "/blog-placeholder-2.jpg",
      slug: "https://astro-paper-project.vercel.app/posts/adding-new-posts-in-astropaper-theme/",
      external: true
    },
    {
      title: "Cloud Cost Optimization Strategies",
      excerpt: "Practical tips to reduce your cloud infrastructure costs without sacrificing performance.",
      date: "March 12, 2023",
      image: "/blog-placeholder-3.jpg",
      slug: "https://astro-paper-project.vercel.app/posts/example-draft-post/",
      external: true    }
  ];
}

// Utility to fetch markdown content from local files
export async function fetchGithubPages() {
  try {
    // Define the content pages we want to load
    const contentPages = [
      { path: '/content/about.md', slug: '/about' },
      { path: '/content/projects.md', slug: '/projects' },
      { path: '/content/contact.md', slug: '/contact' },
      { path: '/content/blog.md', slug: '/blog' }
    ];
    
    // Process and return the content
    const pages = contentPages.map(page => {
      // Extract metadata from the page's frontmatter
      let title, excerpt, content;
      
      // Set defaults based on the slug
      switch (page.slug) {
        case '/about':
          title = "My Professional Journey";
          excerpt = "Follow my career journey from Linux System Administrator to Cloud Engineer, with a strong focus on shell scripting and on-premise infrastructure.";
          content = `<div class="content-page">
            <div class="timeline">
              <div class="timeline-entry">
                <h3>2009–2015: Linux System Administrator</h3>
                <p>Started my career managing RHEL and CentOS systems, with a strong focus on shell scripting and on-premise infrastructure.</p>
              </div>
              <div class="timeline-entry">
                <h3>2015–Present: DevOps Engineer → Cloud Engineer</h3>
                <p>Built and managed cloud-native systems on Azure using Terraform, Helm, and AKS.<br>
                Led end-to-end infrastructure automation pipelines.</p>
              </div>
            </div>
          </div>`;
          break;
        case '/projects':
          title = "Projects";
          excerpt = "Explore my portfolio of cloud infrastructure, DevOps automation, and web development projects.";
          content = `<div class="project-list">
            <div class="project-card">
              <h3>Azure Core Governance Infrastructure as Code</h3>
              <p>This project implements Azure governance patterns at enterprise scale, providing a foundation for Azure landing zones with comprehensive governance controls.</p>
            </div>
            <div class="project-card">
              <h3>Portfolio Website</h3>
              <p>Personal portfolio website showcasing projects, certifications, and contact information, built with Astro and modern web technologies.</p>
            </div>
          </div>`;
          break;
        case '/contact':
          title = "Contact";
          excerpt = "Get in touch with me for collaboration opportunities or professional inquiries.";
          content = `<div class="contact-container">
            <div class="card">
              <h2>Get In Touch</h2>
              <p>I'm always interested in hearing about new projects, opportunities, or just connecting with fellow professionals in the tech community.</p>
            </div>
          </div>`;
          break;
        case '/blog':
          title = "Blog";
          excerpt = "Read articles on cloud engineering, DevOps practices, Kubernetes, and modern web development.";
          content = `<div class="blog-header">
            <h1>Blog</h1>
            <p>Insights, tutorials, and thoughts on cloud engineering, DevOps, and web development.</p>
          </div>`;
          break;
        default:
          title = "Content";
          excerpt = "Page content";
          content = "<p>Content not available</p>";
      }
      
      return {
        title,
        slug: page.slug,
        excerpt,
        content
      };
    });
    
    return pages;
  } catch (error) {
    console.error('Error fetching content pages:', error);
    
    // Return fallback data
    return [
      {
        title: "About Me",
        slug: "/about",
        excerpt: "I'm a Cloud & DevOps Engineer with expertise in AWS, Azure, and modern development practices.",
        content: "<h1>About Me</h1><p>I'm a Cloud & DevOps Engineer with over 5 years of experience building scalable infrastructure and automating deployment pipelines.</p>"
      },
      {
        title: "Projects",
        slug: "/projects",
        excerpt: "Explore my portfolio of cloud infrastructure, DevOps automation, and web development projects.",
        content: "<h1>Projects</h1><p>Here you'll find a collection of my professional work and personal projects showcasing my skills in cloud architecture, CI/CD pipelines, and web development.</p>"
      },
      {
        title: "Contact",
        slug: "/contact",
        excerpt: "Get in touch with me for collaboration opportunities or professional inquiries.",
        content: "<h1>Contact</h1><p>I'm always interested in discussing new projects, challenges, and opportunities. Feel free to reach out!</p>"
      },
      {
        title: "Blog",
        slug: "/blog",
        excerpt: "Read articles on cloud engineering, DevOps practices, Kubernetes, and modern web development.",
        content: "<h1>Blog</h1><p>Insights, tutorials, and thoughts on cloud engineering, DevOps, and web development.</p>"
      }
    ];
  }
}

// New function to load markdown content from files
export async function loadMarkdownContent(slug) {
  try {
    // Import the markdown loader (dynamically to avoid SSR issues)
    let markdownLoader;
    
    if (import.meta.env.SSR) {
      // Server-side rendering - use node.js file system
      markdownLoader = await import('./markdownLoader.js');
      return await markdownLoader.loadMarkdownFile(slug);
    } else {
      // Client-side rendering - fetch from content directory
      const fileMap = {
        '/about': 'about.md',
        '/projects': 'projects.md',
        '/contact': 'contact.md',
        '/blog': 'blog.md'
      };
      
      const filename = fileMap[slug] || null;
      
      if (!filename) {
        throw new Error(`No markdown file found for slug: ${slug}`);
      }
      
      try {
        const response = await fetch(`/content/${filename}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch ${filename}: ${response.status}`);
        }
        
        const content = await response.text();
        
        // For simplicity, using predefined metadata
        return {
          content,
          metadata: {
            title: slug === '/about' ? 'My Professional Journey' : 
                   slug === '/projects' ? 'Projects' : 
                   slug === '/contact' ? 'Contact' : 
                   slug === '/blog' ? 'Blog' : 'Content',
            slug,
            excerpt: slug === '/about' ? 'My career journey in cloud and DevOps.' :
                    slug === '/projects' ? 'Explore my portfolio of projects.' :
                    slug === '/contact' ? 'Get in touch with me.' :
                    slug === '/blog' ? 'Read my articles and insights.' : 'Page content'
          }
        };
      } catch (fetchError) {
        console.error('Error fetching markdown:', fetchError);
        // Fall back to default content
        return getFallbackContent(slug);
      }
    }
  } catch (error) {
    console.error('Error loading markdown content:', error);
    return getFallbackContent(slug);
  }
}

function getFallbackContent(slug) {
  // Fallback content for each page
  let content = '<p>Content not available</p>';
  
  switch (slug) {
    case '/about':
      content = `
        <div class="content-page">
          <div class="timeline">
            <div class="timeline-entry">
              <h3>2009–2015: Linux System Administrator</h3>
              <p>Started my career managing RHEL and CentOS systems, with a strong focus on shell scripting and on-premise infrastructure.</p>
            </div>
            <div class="timeline-entry">
              <h3>2015–Present: DevOps Engineer → Cloud Engineer</h3>
              <p>Built and managed cloud-native systems on Azure using Terraform, Helm, and AKS.<br>
              Led end-to-end infrastructure automation pipelines.</p>
            </div>
          </div>
        </div>
      `;
      break;
      
    case '/projects':
      content = `
        <div class="project-list">
          <div class="project-card">
            <h3>Azure Core Governance Infrastructure as Code</h3>
            <p>Enterprise-scale Azure governance with Terraform.</p>
          </div>
          <div class="project-card">
            <h3>Portfolio Website</h3>
            <p>Personal portfolio website built with Astro.</p>
          </div>
        </div>
      `;
      break;
      
    case '/contact':
      content = `
        <div class="contact-container">
          <div class="card">
            <h2>Get In Touch</h2>
            <p>Reach out for collaboration opportunities or inquiries.</p>
          </div>
        </div>
      `;
      break;
      
    case '/blog':
      content = `
        <div class="blog-posts">
          <article class="blog-post">
            <h2>Cloud Cost Optimization Strategies</h2>
            <p>Tips to reduce cloud infrastructure costs.</p>
          </article>
        </div>
      `;
      break;
  }
  
  return {
    content,
    metadata: {
      title: slug === '/about' ? 'My Professional Journey' : 
             slug === '/projects' ? 'Projects' : 
             slug === '/contact' ? 'Contact' : 
             slug === '/blog' ? 'Blog' : 'Content',
      slug,
      excerpt: 'Fallback content'
    }
  };
}
