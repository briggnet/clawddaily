#!/usr/bin/env node
/**
 * Generate sitemap.xml for ClawdDaily
 */

const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const ARTICLES_DIR = path.join(__dirname, '../articles');
const SITEMAP_PATH = path.join(__dirname, '../sitemap.xml');
const BASE_URL = 'https://clawddaily.com';

// Read all markdown files
const articles = fs.readdirSync(ARTICLES_DIR)
  .filter(f => f.endsWith('.md'))
  .map(filename => {
    const filepath = path.join(ARTICLES_DIR, filename);
    const content = fs.readFileSync(filepath, 'utf8');
    const { data } = matter(content);
    
    return {
      filename,
      date: data.date || new Date().toISOString(),
      slug: filename.replace('.md', '')
    };
  })
  .sort((a, b) => new Date(b.date) - new Date(a.date)); // Newest first

// Generate sitemap XML
let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Homepage -->
  <url>
    <loc>${BASE_URL}/</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  
`;

// Add each article
articles.forEach(article => {
  const lastmod = new Date(article.date).toISOString().split('T')[0];
  
  sitemap += `  <!-- ${article.filename} -->
  <url>
    <loc>${BASE_URL}/articles/${article.slug}.html</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  
`;
});

sitemap += '</urlset>';

// Write sitemap
fs.writeFileSync(SITEMAP_PATH, sitemap);

console.log(`✅ Generated sitemap with ${articles.length + 1} URLs`);
console.log(`📁 Output: ${SITEMAP_PATH}`);
console.log(`\n📊 Most recent articles:`);
articles.slice(0, 5).forEach((a, i) => {
  console.log(`  ${i + 1}. ${a.slug} (${a.date.split('T')[0]})`);
});
