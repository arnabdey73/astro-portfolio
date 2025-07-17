import { getSiteMetadata, getPersonalInfo } from './portfolio-data.js';

export function generatePersonStructuredData() {
  const siteMetadata = getSiteMetadata();
  const personalInfo = getPersonalInfo();
  
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": personalInfo.name,
    "jobTitle": personalInfo.title,
    "description": personalInfo.tagline,
    "url": siteMetadata.baseUrl,
    "image": `${siteMetadata.baseUrl}${siteMetadata.image}`,
    "email": personalInfo.email,
    "telephone": personalInfo.phone,
    "address": {
      "@type": "PostalAddress",
      "addressLocality": personalInfo.location,
      "addressCountry": "IN"
    },
    "alumniOf": {
      "@type": "Organization", 
      "name": siteMetadata.seo.structuredData.person.alumniOf
    },
    "worksFor": {
      "@type": "Organization",
      "name": siteMetadata.seo.structuredData.person.worksFor.name
    },
    "sameAs": personalInfo.socialLinks?.map(link => link.url) || [],
    "knowsAbout": siteMetadata.seo.keywords,
    "hasOccupation": {
      "@type": "Occupation",
      "name": personalInfo.title,
      "description": personalInfo.tagline,
      "skills": siteMetadata.seo.keywords.join(", ")
    }
  };
  
  return JSON.stringify(structuredData);
}

export function generateWebsiteStructuredData() {
  const siteMetadata = getSiteMetadata();
  
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": siteMetadata.title,
    "description": siteMetadata.description,
    "url": siteMetadata.baseUrl,
    "author": {
      "@type": "Person",
      "name": siteMetadata.author
    },
    "potentialAction": {
      "@type": "SearchAction",
      "target": `${siteMetadata.baseUrl}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string"
    }
  };
  
  return JSON.stringify(structuredData);
}

export function generateProfilePageStructuredData() {
  const siteMetadata = getSiteMetadata();
  const personalInfo = getPersonalInfo();
  
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "mainEntity": {
      "@type": "Person",
      "name": personalInfo.name,
      "jobTitle": personalInfo.title,
      "description": personalInfo.tagline,
      "url": siteMetadata.baseUrl,
      "image": `${siteMetadata.baseUrl}${siteMetadata.image}`
    }
  };
  
  return JSON.stringify(structuredData);
}

export function generateBreadcrumbStructuredData(breadcrumbs) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbs.map((crumb, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": crumb.name,
      "item": crumb.url
    }))
  };
  
  return JSON.stringify(structuredData);
}

export function generateArticleStructuredData(article) {
  const siteMetadata = getSiteMetadata();
  const personalInfo = getPersonalInfo();
  
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": article.title,
    "description": article.description,
    "image": article.image || `${siteMetadata.baseUrl}${siteMetadata.image}`,
    "author": {
      "@type": "Person",
      "name": personalInfo.name,
      "url": siteMetadata.baseUrl
    },
    "publisher": {
      "@type": "Person",
      "name": personalInfo.name,
      "logo": {
        "@type": "ImageObject",
        "url": `${siteMetadata.baseUrl}${siteMetadata.image}`
      }
    },
    "datePublished": article.datePublished,
    "dateModified": article.dateModified || article.datePublished,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": article.url
    }
  };
  
  return JSON.stringify(structuredData);
}
