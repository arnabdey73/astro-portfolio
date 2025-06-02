// Utility to fetch blogs from external sources
export async function fetchExternalBlogs() {
  try {
    // Fetch blogs from AstroPaper project
    const response = await fetch('https://astro-paper-project.vercel.app/rss.xml');
    const text = await response.text();

    // Parse the RSS XML data
    const parser = new DOMParser();
    const xml = parser.parseFromString(text, 'application/xml');
    const items = xml.querySelectorAll('item');
    
    // Convert to blog post format
    const blogPosts = Array.from(items).slice(0, 5).map(item => {
      const title = item.querySelector('title')?.textContent || '';
      const link = item.querySelector('link')?.textContent || '';
      const pubDate = item.querySelector('pubDate')?.textContent || '';
      let description = item.querySelector('description')?.textContent || '';
      
      // Extract image from description if possible
      let image = '/blog-placeholder-1.jpg'; // Default image
      const imgMatch = description.match(/<img[^>]+src="([^">]+)"/);
      if (imgMatch && imgMatch[1]) {
        image = imgMatch[1];
      }
      
      // Clean up the description by removing HTML tags
      description = description.replace(/<[^>]*>/g, '').substring(0, 150) + '...';
      
      // Format date
      const date = new Date(pubDate);
      const formattedDate = date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      
      return {
        title,
        excerpt: description,
        date: formattedDate,
        image,
        slug: link,
        external: true
      };
    });
    
    return blogPosts;
  } catch (error) {
    console.error('Error fetching external blogs:', error);
    
    // Return fallback data
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
        external: true
      }
    ];
  }
}

// Utility to fetch pages from GitHub Pages
export async function fetchGithubPages() {
  try {
    // Direct fetch from the GitHub Pages URL
    const response = await fetch('https://arnabdey73.github.io/content/');
    const text = await response.text();
    
    // Parse the HTML to extract content
    const parser = new DOMParser();
    const doc = parser.parseFromString(text, 'text/html');
    
    // Extract content from various elements
    const contentElements = doc.querySelectorAll('article, section, .content');
    
    if (contentElements.length === 0) {
      // Fallback: try fetching content.json
      try {
        const jsonResponse = await fetch('https://arnabdey73.github.io/content/content.json');
        const data = await jsonResponse.json();
        return data.pages || [];
      } catch (jsonError) {
        console.error('Error fetching JSON content:', jsonError);
        throw new Error('No content found');
      }
    }
    
    // Extract and structure the content
    const pages = Array.from(contentElements).map((element, index) => {
      const headings = element.querySelectorAll('h1, h2, h3');
      const title = headings.length > 0 
        ? headings[0].textContent?.trim() 
        : `Content ${index + 1}`;
      
      const paragraphs = element.querySelectorAll('p');
      const excerpt = paragraphs.length > 0 
        ? paragraphs[0].textContent?.trim().substring(0, 150) + '...' 
        : '';
        
      // Generate a slug from the title
      const slug = '/' + (title ? title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') : `content-${index + 1}`);
      
      return {
        title,
        slug,
        excerpt,
        content: element.innerHTML
      };
    });
    
    return pages;
  } catch (error) {
    console.error('Error fetching GitHub pages:', error);
    
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
      }
    ];
  }
}
