# Schema.org Quick Reference Guide

## 🚀 Quick Start

Your portfolio now includes comprehensive Schema.org structured data for better SEO and rich search results.

## 🔍 What's Implemented

### Global (All Pages)
- ✅ **Person Schema** - Your professional identity
- ✅ **Website Schema** - Site structure and search
- ✅ **Organization Schema** - Your personal brand

### Page-Specific
- ✅ **Portfolio** (Projects page) - Creative work showcase
- ✅ **Software Applications** (Projects page) - Individual projects
- ✅ **Professional Service** (Services page) - Service offerings  
- ✅ **Contact Page** (Contact page) - Contact optimization
- ✅ **About Page** (About page) - Professional background
- ✅ **Open Source** (Open Source page) - Contributions

## 🧪 Testing

### Quick Test
```bash
npm run validate-schema
```

### Manual Testing
1. **Google Rich Results Test**: https://search.google.com/test/rich-results
2. **Schema Validator**: https://validator.schema.org/
3. **Browser Console**: 
   ```javascript
   Array.from(document.querySelectorAll('script[type="application/ld+json"]'))
     .map(s => JSON.parse(s.textContent))
   ```

## 📝 How to Update

### Personal Information
Update `src/data/personal.json` - changes automatically reflect in structured data.

### Projects
Add to `src/data/projects.json` - new projects get structured data automatically.

### Site Settings
Modify `src/data/site.json` for site-wide structured data changes.

## 🎯 SEO Benefits

- **Rich Snippets** in search results
- **Knowledge Panels** for your professional profile
- **Enhanced Business Listings** for services
- **Project Showcases** with technical details
- **Contact Information** optimization

## 🔧 Customization

### Adding New Schema Types
1. Create function in `src/utils/structured-data.js`
2. Import in relevant page component
3. Pass to Layout via `structuredData` prop

### Example:
```astro
---
import { generateCustomStructuredData } from '../utils/structured-data.js';
const customData = generateCustomStructuredData();
---

<Layout structuredData={customData}>
  <!-- Your content -->
</Layout>
```

## 🏷️ Schema Types Reference

| Type | Purpose | Key Benefits |
|------|---------|--------------|
| Person | Professional identity | Knowledge panels, contact info |
| Organization | Business entity | Local search, credibility |
| Website | Site structure | Site links, search features |
| SoftwareApplication | Projects | Technical showcases, rich snippets |
| ProfessionalService | Services | Business listings, service details |
| CreativeWork | Portfolio | Creative showcases, authorship |
| ContactPage | Contact optimization | Enhanced contact displays |
| AboutPage | Professional background | Biography optimization |

## 🔍 Monitoring

### Google Search Console
- Monitor **"Enhancements"** section for structured data status
- Check for **errors** or **valid items**
- Review **rich results** performance

### Regular Checks
- Run validation script monthly
- Test new pages before deployment
- Monitor search result appearances
- Check for schema.org vocabulary updates

## 🚨 Troubleshooting

### Common Issues
```bash
# Invalid JSON syntax
npm run validate-schema

# Missing required properties
# Check data files for completeness

# Broken URLs in structured data
# Verify all URLs are accessible
```

### Debug Steps
1. Check validation script output
2. Test with Google's Rich Results tool
3. Review browser console for errors
4. Verify data source files

## 📚 Resources

- **Documentation**: `docs/SCHEMA_ORG_IMPLEMENTATION.md`
- **Validation Script**: `scripts/validate-structured-data.js`
- **Utility Functions**: `src/utils/structured-data.js`
- **Data Sources**: `src/data/`

## ✅ Quick Checklist

- [ ] Personal info is current in `src/data/personal.json`
- [ ] Project list is up-to-date in `src/data/projects.json`
- [ ] Contact details are accurate
- [ ] All URLs in structured data work
- [ ] Validation script passes: `npm run validate-schema`
- [ ] Rich Results Test shows valid data
- [ ] Google Search Console shows no errors

---

💡 **Tip**: Run `npm run validate-schema` after any data changes to ensure structured data integrity!
