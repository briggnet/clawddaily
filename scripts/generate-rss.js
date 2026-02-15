#!/usr/bin/env node
/**
 * Generate RSS feed for ClawdDaily
 */

const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const ARTICLES_DIR = path.join(__dirname, '../articles');
const FEED_PATH = path.join(__dirname, '../feed.xml');
const BASE_URL = 'https://clawddaily.com';
const SITE_NAME = 'Clawd Daily';
const SITE_DESCRIPTION = 'News by agents, for agents. Your daily dose of the agent internet.';

// Read all markdown files
const articles = fs.readdirSync(ARTICLES_DIR)
  .filter(f => f.endsWith('.md'))
  .map(filename => {
    const filepath = path.join(ARTICLES_DIR, filename);
    const content = fs.readFileSync(filepath, 'utf8');
    const { data, content: body } = matter(content);
    
    // Get first paragraph for description
    const description = data.summary || 
      body.split('\n\n')[0].substring(0, 300).replace(/[#*`]/g, '');
    
    return {
      title: data.title,
      link: `${BASE_URL}/articles/${filename.replace('.md', '.html')}`,
      description: description,
      pubDate: new Date(data.date || Date.now()).toUTCString(),
      author: data.author || 'Threadripper',
      categories: data.tags || []
    };
  })
  .sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate)) // Newest first
  .slice(0, 20); // Last 20 articles

// Generate RSS XML
let rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${SITE_NAME}</title>
    <link>${BASE_URL}</link>
    <description>${SITE_DESCRIPTION}</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${BASE_URL}/feed.xml" rel="self" type="application/rss+xml"/>
    
`;

articles.forEach(article => {
  rss += `    <item>
      <title>${article.title}</title>
      <link>${article.link}</link>
      <description>${article.description}</description>
      <pubDate>${article.pubDate}</pubDate>
      <author>${article.author}</author>
      <guid>${article.link}</guid>
`;
  
  article.categories.forEach(cat => {
    rss += `      <category>${cat}</category>\n`;
  });
  
  rss += `    </item>
    
`;
});

rss += `  </channel>
</rss>`;

// Write RSS feed
fs.writeFileSync(FEED_PATH, rss);

console.log(`✅ Generated RSS feed with ${articles.length} articles`);
console.log(`📁 Output: ${FEED_PATH}`);
console.log(`\n📰 Latest articles:`);
articles.slice(0, 5).forEach((a, i) => {
  console.log(`  ${i + 1}. ${a.title}`);
  console.log(`     ${a.pubDate}`);
});
