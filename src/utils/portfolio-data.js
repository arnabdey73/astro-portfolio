// Utility functions for loading and processing portfolio data

import personal from '../data/personal.json';
import site from '../data/site.json';
import projects from '../data/projects.json';
import skills from '../data/skills.json';
import experience from '../data/experience.json';
import certifications from '../data/certifications.json';
import contact from '../data/contact.json';
import { readFileSync } from 'fs';
import { join } from 'path';
import { marked } from 'marked';
import { addThumbnailsToProjects, getProjectThumbnail } from './thumbnail-generator.js';

// Get Markdown content as HTML
export function getMarkdownContent(filename) {
  try {
    const filePath = join(process.cwd(), 'src/data', `${filename}.md`);
    const fileContent = readFileSync(filePath, 'utf-8');
    return marked.parse(fileContent);
  } catch (error) {
    console.error(`Error reading markdown file ${filename}.md:`, error);
    return '';
  }
}

// Get personal information
export function getPersonalInfo() {
  return personal;
}

// Get site metadata
export function getSiteMetadata() {
  return site;
}

// Get all projects or featured only
export function getProjects(featuredOnly = false) {
  let projectList;
  if (featuredOnly) {
    projectList = projects.filter(project => project.featured);
  } else {
    projectList = projects;
  }
  
  // Add thumbnails to all projects
  return addThumbnailsToProjects(projectList);
}

// Get project by title (slug)
export function getProjectBySlug(slug) {
  const titleSlug = slug.toLowerCase().replace(/\s+/g, '-');
  return projects.find(project => 
    project.title.toLowerCase().replace(/\s+/g, '-') === titleSlug
  );
}

// Get all skills by category or all
export function getSkills(category = null) {
  if (category) {
    return skills.categories.find(cat => cat.name === category);
  }
  return skills.categories;
}

// Get work experience
export function getExperience() {
  return experience;
}

// Get certifications
export function getCertifications() {
  return certifications;
}

// Get contact information
export function getContactInfo() {
  return contact;
}

// Get all social links
export function getSocialLinks() {
  return personal.socialLinks;
}

// Get support links for monetization
export function getSupportLinks() {
  return site.supportLinks;
}
