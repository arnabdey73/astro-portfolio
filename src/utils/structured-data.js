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
      "addressLocality": personalInfo.location.split(',')[0].trim(),
      "addressCountry": "SE"
    },
    "alumniOf": {
      "@type": "EducationalOrganization", 
      "name": personalInfo.professional.education.split(' - ')[1].split(' (')[0]
    },
    "worksFor": {
      "@type": "Organization",
      "name": personalInfo.professional.currentEmployer.name
    },
    "sameAs": personalInfo.socialLinks?.map(link => link.url) || [],
    "knowsAbout": siteMetadata.seo.keywords,
    "hasOccupation": {
      "@type": "Occupation",
      "name": personalInfo.title,
      "description": personalInfo.tagline,
      "skills": personalInfo.professional.specialties.join(", "),
      "experienceRequirements": personalInfo.professional.experience,
      "occupationLocation": {
        "@type": "City",
        "name": personalInfo.location.split(',')[0].trim(),
        "containedInPlace": {
          "@type": "Country",
          "name": "Sweden"
        }
      },
      "estimatedSalary": {
        "@type": "MonetaryAmountDistribution",
        "name": "Cloud & DevOps Engineer salary range in Sweden (Stockholm/Göteborg market)",
        "currency": "SEK",
        "duration": "P1Y",
        "percentile10": "800000",  // Entry level: ~800k SEK annually
        "percentile25": "900000",  // Junior-Mid level: ~900k SEK annually  
        "median": "1000000",       // Mid-Senior level: ~1M SEK annually
        "percentile75": "1200000", // Senior level: ~1.2M SEK annually
        "percentile90": "1400000"  // Lead/Architect level: ~1.4M SEK annually
      }
    },
    "hasCredential": personalInfo.professional.certifications.map(cert => ({
      "@type": "EducationalOccupationalCredential",
      "name": cert
    })),
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": siteMetadata.baseUrl
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

export function generatePortfolioStructuredData() {
  const siteMetadata = getSiteMetadata();
  const personalInfo = getPersonalInfo();
  
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "name": `${personalInfo.name} - Portfolio`,
    "description": `Professional portfolio showcasing ${personalInfo.title} projects and expertise`,
    "url": `${siteMetadata.baseUrl}/projects`,
    "author": {
      "@type": "Person",
      "name": personalInfo.name,
      "jobTitle": personalInfo.title
    },
    "creator": {
      "@type": "Person",
      "name": personalInfo.name
    },
    "about": personalInfo.professional.specialties,
    "genre": "Professional Portfolio",
    "inLanguage": "en"
  };
  
  return JSON.stringify(structuredData);
}

export function generateProjectStructuredData(project) {
  const siteMetadata = getSiteMetadata();
  const personalInfo = getPersonalInfo();
  
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": project.title,
    "description": project.description,
    "applicationCategory": "DeveloperApplication",
    "operatingSystem": "Cross-platform",
    "programmingLanguage": project.technologies,
    "author": {
      "@type": "Person",
      "name": personalInfo.name,
      "jobTitle": personalInfo.title
    },
    "creator": {
      "@type": "Person",
      "name": personalInfo.name
    },
    "codeRepository": project.githubUrl,
    "url": project.liveUrl || project.githubUrl,
    "isAccessibleForFree": true,
    "license": "https://opensource.org/licenses/MIT"
  };

  if (project.liveUrl) {
    structuredData.sameAs = [project.githubUrl];
    structuredData.demo = project.liveUrl;
  }
  
  return JSON.stringify(structuredData);
}

export function generateServiceStructuredData() {
  const siteMetadata = getSiteMetadata();
  const personalInfo = getPersonalInfo();
  
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "name": `${personalInfo.name} - ${personalInfo.title} Services`,
    "description": personalInfo.tagline,
    "provider": {
      "@type": "Person",
      "name": personalInfo.name,
      "jobTitle": personalInfo.title,
      "email": personalInfo.email,
      "telephone": personalInfo.phone,
      "address": {
        "@type": "PostalAddress",
        "addressLocality": personalInfo.location.split(',')[0].trim(),
        "addressCountry": "SE"
      }
    },
    "areaServed": [
      {
        "@type": "Country",
        "name": "Sweden"
      },
      {
        "@type": "City",
        "name": "Stockholm",
        "containedInPlace": {
          "@type": "Country", 
          "name": "Sweden"
        }
      },
      {
        "@type": "City",
        "name": "Göteborg", 
        "containedInPlace": {
          "@type": "Country",
          "name": "Sweden"
        }
      },
      {
        "@type": "Place",
        "name": "Global (Remote)"
      }
    ],
    "serviceType": personalInfo.professional.specialties,
    "url": `${siteMetadata.baseUrl}/services`,
    "availableLanguage": ["English", "Swedish"],
    "priceRange": "Competitive consulting rates",
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Cloud & DevOps Services",
      "itemListElement": personalInfo.professional.specialties.map((specialty, index) => ({
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": specialty,
          "description": `Professional ${specialty} services`,
          "provider": {
            "@type": "Person",
            "name": personalInfo.name
          }
        },
        "priceSpecification": {
          "@type": "PriceSpecification",
          "priceCurrency": "SEK",
          "price": "Negotiable",
          "eligibleQuantity": {
            "@type": "QuantitativeValue",
            "unitText": "hour"
          }
        },
        "availability": {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
          "opens": "09:00",
          "closes": "17:00"
        }
      }))
    }
  };
  
  return JSON.stringify(structuredData);
}

export function generateContactPageStructuredData() {
  const siteMetadata = getSiteMetadata();
  const personalInfo = getPersonalInfo();
  
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "name": "Contact",
    "description": `Get in touch with ${personalInfo.name} for ${personalInfo.title} services`,
    "url": `${siteMetadata.baseUrl}/contact`,
    "mainEntity": {
      "@type": "Person",
      "name": personalInfo.name,
      "jobTitle": personalInfo.title,
      "email": personalInfo.email,
      "telephone": personalInfo.phone,
      "url": siteMetadata.baseUrl
    },
    "potentialAction": {
      "@type": "CommunicateAction",
      "name": "Contact Form",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${siteMetadata.baseUrl}/contact`,
        "actionPlatform": ["http://schema.org/DesktopWebPlatform", "http://schema.org/MobileWebPlatform"]
      }
    }
  };
  
  return JSON.stringify(structuredData);
}

export function generateOrganizationStructuredData() {
  const siteMetadata = getSiteMetadata();
  const personalInfo = getPersonalInfo();
  
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": personalInfo.name,
    "alternateName": `${personalInfo.name} - ${personalInfo.title}`,
    "description": personalInfo.tagline,
    "url": siteMetadata.baseUrl,
    "logo": `${siteMetadata.baseUrl}${siteMetadata.image}`,
    "image": `${siteMetadata.baseUrl}${siteMetadata.image}`,
    "email": personalInfo.email,
    "telephone": personalInfo.phone,
    "address": {
      "@type": "PostalAddress",
      "addressLocality": personalInfo.location.split(',')[0].trim(),
      "addressCountry": "SE",
      "addressRegion": "Västra Götaland"
    },
    "founder": {
      "@type": "Person",
      "name": personalInfo.name
    },
    "foundingDate": "2015",
    "sameAs": personalInfo.socialLinks?.map(link => link.url) || [],
    "knowsAbout": siteMetadata.seo.keywords,
    "areaServed": [
      {
        "@type": "Country",
        "name": "Sweden"
      },
      {
        "@type": "City",
        "name": "Stockholm",
        "containedInPlace": {
          "@type": "Country",
          "name": "Sweden"
        }
      },
      {
        "@type": "City", 
        "name": "Göteborg",
        "containedInPlace": {
          "@type": "Country",
          "name": "Sweden"
        }
      },
      {
        "@type": "Place",
        "name": "Global"
      }
    ],
    "serviceArea": {
      "@type": "GeoCircle",
      "geoMidpoint": {
        "@type": "GeoCoordinates",
        "latitude": "57.7089",
        "longitude": "11.9746"
      },
      "geoRadius": "50000"
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Professional Services",
      "itemListElement": personalInfo.professional.specialties.map(specialty => ({
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": specialty,
          "serviceType": "Consulting"
        },
        "eligibleRegion": {
          "@type": "Place",
          "name": "Global"
        }
      }))
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": personalInfo.phone,
      "email": personalInfo.email,
      "contactType": "customer service",
      "availableLanguage": ["English", "Swedish"],
      "hoursAvailable": {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        "opens": "09:00",
        "closes": "17:00"
      }
    }
  };
  
  return JSON.stringify(structuredData);
}

export function generateMultipleProjectsStructuredData(projects) {
  const siteMetadata = getSiteMetadata();
  const personalInfo = getPersonalInfo();
  
  const structuredDataArray = projects.map((project, index) => ({
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "@id": `${siteMetadata.baseUrl}/projects#project-${index}`,
    "name": project.title,
    "description": project.description,
    "applicationCategory": "DeveloperApplication",
    "operatingSystem": "Cross-platform",
    "programmingLanguage": project.technologies,
    "author": {
      "@type": "Person",
      "name": personalInfo.name,
      "jobTitle": personalInfo.title,
      "url": siteMetadata.baseUrl
    },
    "creator": {
      "@type": "Person",
      "name": personalInfo.name
    },
    "codeRepository": project.githubUrl,
    "url": project.liveUrl || project.githubUrl,
    "isAccessibleForFree": true,
    "license": "https://opensource.org/licenses/MIT",
    "keywords": project.technologies,
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    ...(project.liveUrl && {
      "sameAs": [project.githubUrl],
      "demo": project.liveUrl
    }),
    ...(project.featured && {
      "award": "Featured Project"
    })
  }));

  // Create an ItemList for all projects
  const itemListStructuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": `${personalInfo.name} - Projects Portfolio`,
    "description": `A collection of ${projects.length} projects by ${personalInfo.name}`,
    "numberOfItems": projects.length,
    "itemListElement": structuredDataArray.map((project, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": project
    }))
  };
  
  return JSON.stringify(itemListStructuredData);
}

export function generateAboutPageStructuredData() {
  const siteMetadata = getSiteMetadata();
  const personalInfo = getPersonalInfo();
  
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "name": "About",
    "description": `Learn more about ${personalInfo.name}, ${personalInfo.title}`,
    "url": `${siteMetadata.baseUrl}/about`,
    "mainEntity": {
      "@type": "Person",
      "name": personalInfo.name,
      "jobTitle": personalInfo.title,
      "description": personalInfo.tagline,
      "hasOccupation": {
        "@type": "Occupation",
        "name": personalInfo.title,
        "experienceRequirements": personalInfo.professional.experience
      },
      "hasCredential": personalInfo.professional.certifications.map(cert => ({
        "@type": "EducationalOccupationalCredential",
        "name": cert
      })),
      "alumniOf": {
        "@type": "EducationalOrganization",
        "name": personalInfo.professional.education.split(' - ')[1].split(' (')[0]
      }
    }
  };
  
  return JSON.stringify(structuredData);
}

export function generateJobPostingStructuredData() {
  const siteMetadata = getSiteMetadata();
  const personalInfo = getPersonalInfo();
  
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    "title": `${personalInfo.title} - Consulting Services Available`,
    "description": `${personalInfo.tagline}. Available for consulting projects in ${personalInfo.professional.specialties.join(', ')}.`,
    "identifier": {
      "@type": "PropertyValue",
      "name": "Consulting Services",
      "value": "consulting-2025"
    },
    "datePosted": "2025-01-01",
    "hiringOrganization": {
      "@type": "Organization",
      "name": personalInfo.name,
      "sameAs": siteMetadata.baseUrl,
      "logo": `${siteMetadata.baseUrl}${siteMetadata.image}`
    },
    "jobLocation": [
      {
        "@type": "Place",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": personalInfo.location.split(',')[0].trim(),
          "addressCountry": "SE"
        }
      },
      {
        "@type": "Place",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "Stockholm",
          "addressCountry": "SE"
        }
      },
      {
        "@type": "Place",
        "name": "Remote"
      }
    ],
    "employmentType": ["CONTRACTOR", "PART_TIME", "FULL_TIME"],
    "workHours": "Flexible",
    "baseSalary": {
      "@type": "MonetaryAmount",
      "currency": "SEK",
      "value": {
        "@type": "QuantitativeValue",
        "value": "1200",  // ~1200 SEK/hour for senior Cloud/DevOps consulting (aligns with 1.2M SEK annually at ~1000 billable hours)
        "unitText": "HOUR"
      }
    },
    "qualifications": personalInfo.professional.experience,
    "skills": personalInfo.professional.specialties.join(', '),
    "educationRequirements": {
      "@type": "EducationalOccupationalCredential",
      "credentialCategory": "degree"
    },
    "experienceRequirements": {
      "@type": "OccupationalExperienceRequirements",
      "monthsOfExperience": "96"
    },
    "occupationalCategory": ["15-1252.00", "15-1199.02"], // SOC codes for Computer Network Architects and DevOps Engineers
    "responsibilities": [
      "Cloud infrastructure design and implementation",
      "DevOps pipeline development and optimization",
      "Automation and infrastructure as code",
      "System monitoring and performance optimization",
      "Team collaboration and technical leadership"
    ],
    "applicantLocationRequirements": {
      "@type": "Country",
      "name": "Global"
    },
    "jobBenefits": [
      "Remote work flexibility",
      "Competitive consulting rates",
      "Professional development opportunities",
      "Flexible scheduling"
    ]
  };
  
  return JSON.stringify(structuredData);
}

export function generateOpenSourceStructuredData() {
  const siteMetadata = getSiteMetadata();
  const personalInfo = getPersonalInfo();
  
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Open Source Contributions",
    "description": `Open source projects and contributions by ${personalInfo.name}`,
    "url": `${siteMetadata.baseUrl}/open-source`,
    "mainEntity": {
      "@type": "Person",
      "name": personalInfo.name,
      "jobTitle": personalInfo.title,
      "description": personalInfo.tagline,
      "url": siteMetadata.baseUrl,
      "sameAs": personalInfo.socialLinks?.map(link => link.url) || []
    },
    "about": [
      "Open Source Software",
      "Software Development",
      "GitHub Contributions",
      "Community Projects"
    ],
    "keywords": [...siteMetadata.seo.keywords, "open source", "github", "contributions", "community"]
  };
  
  return JSON.stringify(structuredData);
}

export function generateSiteMapStructuredData() {
  const siteMetadata = getSiteMetadata();
  const personalInfo = getPersonalInfo();
  
  const pages = [
    { name: "Home", url: siteMetadata.baseUrl },
    { name: "About", url: `${siteMetadata.baseUrl}/about` },
    { name: "Projects", url: `${siteMetadata.baseUrl}/projects` },
    { name: "Services", url: `${siteMetadata.baseUrl}/services` },
    { name: "Contact", url: `${siteMetadata.baseUrl}/contact` },
    { name: "Open Source", url: `${siteMetadata.baseUrl}/open-source` }
  ];
  
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SiteNavigationElement",
    "name": `${personalInfo.name} Website Navigation`,
    "url": siteMetadata.baseUrl,
    "hasPart": pages.map((page, index) => ({
      "@type": "WebPage",
      "name": page.name,
      "url": page.url,
      "position": index + 1
    }))
  };
  
  return JSON.stringify(structuredData);
}

export function generateSEOValidationStructuredData() {
  const siteMetadata = getSiteMetadata();
  const personalInfo = getPersonalInfo();
  
  // This generates a comprehensive validation structure for testing
  const validationData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": `${siteMetadata.baseUrl}#person`,
        "name": personalInfo.name,
        "jobTitle": personalInfo.title,
        "url": siteMetadata.baseUrl,
        "sameAs": personalInfo.socialLinks?.map(link => link.url) || []
      },
      {
        "@type": "Organization",
        "@id": `${siteMetadata.baseUrl}#organization`,
        "name": personalInfo.name,
        "url": siteMetadata.baseUrl,
        "founder": { "@id": `${siteMetadata.baseUrl}#person` }
      },
      {
        "@type": "WebSite",
        "@id": `${siteMetadata.baseUrl}#website`,
        "name": siteMetadata.title,
        "url": siteMetadata.baseUrl,
        "publisher": { "@id": `${siteMetadata.baseUrl}#person` }
      }
    ]
  };
  
  return JSON.stringify(validationData);
}
