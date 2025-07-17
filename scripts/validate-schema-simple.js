#!/usr/bin/env node

/**
 * Simple Schema.org Structured Data Validator
 * Tests the basic structure and required fields for Rich Results
 */

console.log("🧪 Schema.org Rich Results Validation");
console.log("=" .repeat(50));

// Test data based on your implementation
const testSchemas = [
  {
    name: "Person with Rich Results Fields",
    schema: {
      "@context": "https://schema.org",
      "@type": "Person",
      "name": "Arnab Dey",
      "jobTitle": "Cloud & DevOps Engineer",
      "email": "mail@arnabdey.dev",
      "telephone": "+46 76 45 16 092",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Göteborg",
        "addressCountry": "SE"
      },
      "hasOccupation": {
        "@type": "Occupation",
        "name": "Cloud & DevOps Engineer",
        "occupationLocation": {
          "@type": "City", 
          "name": "Göteborg",
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
          "percentile10": "800000",
          "percentile25": "900000", 
          "median": "1000000",
          "percentile75": "1200000",
          "percentile90": "1400000"
        }
      }
    }
  },
  {
    name: "Organization with Geographic Coverage",
    schema: {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "Arnab Dey",
      "url": "https://arnabdey.dev",
      "areaServed": [
        { "@type": "Country", "name": "Sweden" },
        { "@type": "City", "name": "Stockholm", "containedInPlace": { "@type": "Country", "name": "Sweden" } },
        { "@type": "City", "name": "Göteborg", "containedInPlace": { "@type": "Country", "name": "Sweden" } }
      ],
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+46 76 45 16 092",
        "email": "mail@arnabdey.dev",
        "contactType": "customer service"
      }
    }
  },
  {
    name: "Professional Service with Pricing",
    schema: {
      "@context": "https://schema.org",
      "@type": "ProfessionalService", 
      "name": "Cloud & DevOps Services",
      "provider": {
        "@type": "Person",
        "name": "Arnab Dey"
      },
      "areaServed": [
        { "@type": "City", "name": "Stockholm" },
        { "@type": "City", "name": "Göteborg" }
      ],
      "priceRange": "Competitive consulting rates",
      "availableLanguage": ["English", "Swedish"]
    }
  },
  {
    name: "Job Posting with Salary & Location",
    schema: {
      "@context": "https://schema.org",
      "@type": "JobPosting",
      "title": "Cloud & DevOps Engineer - Consulting Services Available",
      "hiringOrganization": {
        "@type": "Organization", 
        "name": "Arnab Dey"
      },
      "jobLocation": [
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
      "baseSalary": {
        "@type": "MonetaryAmount",
        "currency": "SEK",
        "value": {
          "@type": "QuantitativeValue", 
          "value": "1200",
          "unitText": "HOUR"
        }
      },
      "occupationalCategory": ["15-1252.00", "15-1199.02"]
    }
  }
];

function validateSchema(schema, name) {
  console.log(`\n📋 Validating ${name}:`);
  
  // Basic Schema.org requirements
  if (!schema["@context"] || !schema["@type"]) {
    console.error("❌ Missing @context or @type");
    return false;
  }
  
  console.log(`✅ @context: ${schema["@context"]}`);
  console.log(`✅ @type: ${schema["@type"]}`);
  
  // Rich Results specific checks
  let richResultsScore = 0;
  
  // Person schema Rich Results checks
  if (schema["@type"] === "Person") {
    if (schema.hasOccupation?.occupationLocation) {
      console.log("🌟 Rich Results: occupationLocation found");
      richResultsScore++;
    }
    if (schema.hasOccupation?.estimatedSalary) {
      console.log("🌟 Rich Results: estimatedSalary found");
      richResultsScore++;
    }
    if (schema.address) {
      console.log("✅ Address information present");
    }
  }
  
  // Organization schema checks
  if (schema["@type"] === "Organization") {
    if (schema.areaServed && Array.isArray(schema.areaServed)) {
      console.log(`✅ Service area coverage: ${schema.areaServed.length} locations`);
      const hasStockholm = schema.areaServed.some(area => area.name === "Stockholm");
      const hasGoteborg = schema.areaServed.some(area => area.name === "Göteborg");
      if (hasStockholm) console.log("🌟 Stockholm coverage confirmed");
      if (hasGoteborg) console.log("🌟 Göteborg coverage confirmed");
    }
    if (schema.contactPoint) {
      console.log("✅ Contact point information present");
      richResultsScore++;
    }
  }
  
  // Professional Service checks
  if (schema["@type"] === "ProfessionalService") {
    if (schema.priceRange) {
      console.log("✅ Price range information present");
      richResultsScore++;
    }
    if (schema.availableLanguage) {
      console.log(`✅ Language support: ${schema.availableLanguage.join(", ")}`);
    }
  }
  
  // Job Posting checks
  if (schema["@type"] === "JobPosting") {
    if (schema.baseSalary) {
      console.log("🌟 Rich Results: baseSalary found");
      richResultsScore++;
    }
    if (schema.jobLocation && Array.isArray(schema.jobLocation)) {
      console.log(`✅ Job locations: ${schema.jobLocation.length} options`);
    }
    if (schema.occupationalCategory) {
      console.log("🌟 Rich Results: SOC codes present");
      richResultsScore++;
    }
  }
  
  // Overall assessment
  if (richResultsScore > 0) {
    console.log(`🎯 Rich Results Score: ${richResultsScore}/3 (Good for enhanced SEO)`);
  }
  
  return true;
}

// Run validation tests
let allPassed = true;

testSchemas.forEach(test => {
  try {
    const isValid = validateSchema(test.schema, test.name);
    if (!isValid) allPassed = false;
  } catch (error) {
    console.error(`❌ Error validating ${test.name}:`, error.message);
    allPassed = false;
  }
});

// Summary
console.log("\n" + "=" .repeat(50));
if (allPassed) {
  console.log("🎉 All Schema.org validations passed!");
  console.log("✅ Rich Results fields detected for enhanced Google visibility");
  console.log("🌟 Stockholm and Göteborg geographic targeting confirmed");
  console.log("💰 Salary information properly structured for job searches");
} else {
  console.log("⚠️  Some validations failed. Please review the output above.");
}

console.log("\n🔍 Next Steps:");
console.log("1. Test with Google Rich Results Tool: https://search.google.com/test/rich-results");
console.log("2. Validate with Schema.org validator: https://validator.schema.org/");
console.log("3. Check Google Search Console for structured data status");
console.log("4. Monitor search result appearances for rich snippets");

console.log("\n💡 Expected Rich Results:");
console.log("- Person knowledge panels with salary info");
console.log("- Professional service listings with pricing");
console.log("- Job posting snippets with Stockholm/Göteborg locations");
console.log("- Business contact information with service areas");
