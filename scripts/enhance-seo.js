#!/usr/bin/env node
/**
 * ClawdDaily SEO Enhancement Pipeline
 * 
 * Processes all markdown articles and adds:
 * - Meta descriptions
 * - OpenGraph tags
 * - Twitter cards
 * - JSON-LD structured data
 * - Internal cross-links
 * - External authoritative links
 * - Keyword optimization
 */

const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const ARTICLES_DIR = path.join(__dirname, '../articles');
const OUTPUT_DIR = path.join(__dirname, '../articles-enhanced');

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Read all markdown files
const articles = fs.readdirSync(ARTICLES_DIR)
  .filter(f => f.endsWith('.md'))
  .map(filename => {
    const filepath = path.join(ARTICLES_DIR, filename);
    const content = fs.readFileSync(filepath, 'utf8');
    const { data, content: body } = matter(content);
    
    return {
      filename,
      filepath,
      frontmatter: data,
      body,
      slug: filename.replace('.md', '')
    };
  });

console.log(`📊 Found ${articles.length} articles`);

// Extract keywords from content
function extractKeywords(text, count = 10) {
  const stopWords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'from', 'as', 'is', 'was', 'are', 'were', 'been', 'be', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'should', 'could', 'may', 'might', 'can', 'this', 'that', 'these', 'those', 'i', 'you', 'he', 'she', 'it', 'we', 'they']);
  
  const words = text.toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 3 && !stopWords.has(w));
  
  const freq = {};
  words.forEach(w => freq[w] = (freq[w] || 0) + 1);
  
  return Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, count)
    .map(([word]) => word);
}

// Find related articles based on tags
function findRelatedArticles(article, allArticles, limit = 3) {
  const tags = new Set(article.frontmatter.tags || []);
  
  return allArticles
    .filter(a => a.filename !== article.filename)
    .map(a => ({
      article: a,
      score: (a.frontmatter.tags || []).filter(t => tags.has(t)).length
    }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ article: a }) => ({
      title: a.frontmatter.title,
      url: `/articles/${a.slug}.html`
    }));
}

// Add external authoritative links
function addAuthoritativeLinks(body) {
  // Extract Moltbook links
  const moltbookLinks = (body.match(/https:\/\/moltbook\.com\/[^\s\)]+/g) || []);
  
  // Add authoritative sources based on content keywords
  const links = [];
  
  if (body.includes('Clawdbot') || body.includes('OpenClaw')) {
    links.push({
      text: 'Clawdbot Documentation',
      url: 'https://docs.clawd.bot'
    });
  }
  
  if (body.includes('Anthropic') || body.includes('Claude')) {
    links.push({
      text: 'Anthropic',
      url: 'https://www.anthropic.com'
    });
  }
  
  if (body.includes('GitHub') || body.includes('repository')) {
    links.push({
      text: 'GitHub',
      url: 'https://github.com'
    });
  }
  
  return links;
}

// Generate JSON-LD structured data
function generateJSONLD(article, keywords) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": article.frontmatter.title,
    "description": article.frontmatter.summary,
    "author": {
      "@type": "Person",
      "name": article.frontmatter.author || "Threadripper"
    },
    "datePublished": article.frontmatter.date,
    "publisher": {
      "@type": "Organization",
      "name": "Clawd Daily",
      "logo": {
        "@type": "ImageObject",
        "url": "https://clawddaily.com/logo.png"
      }
    },
    "keywords": keywords.join(', '),
    "articleSection": (article.frontmatter.tags || [])[0] || "News"
  };
}

// Process each article
articles.forEach((article, index) => {
  console.log(`\n[${index + 1}/${articles.length}] Processing: ${article.filename}`);
  
  // Extract keywords
  const keywords = extractKeywords(article.body);
  console.log(`  📝 Keywords: ${keywords.slice(0, 5).join(', ')}...`);
  
  // Find related articles
  const related = findRelatedArticles(article, articles);
  console.log(`  🔗 Related: ${related.length} articles`);
  
  // Add authoritative links
  const authLinks = addAuthoritativeLinks(article.body);
  console.log(`  🌐 External links: ${authLinks.length}`);
  
  // Generate JSON-LD
  const jsonld = generateJSONLD(article, keywords);
  
  // Update frontmatter with SEO metadata
  const enhancedFrontmatter = {
    ...article.frontmatter,
    keywords: keywords.join(', '),
    description: article.frontmatter.summary, // For meta tag
    og_title: article.frontmatter.title,
    og_description: article.frontmatter.summary,
    og_type: 'article',
    twitter_card: 'summary_large_image',
    twitter_title: article.frontmatter.title,
    twitter_description: article.frontmatter.summary,
    jsonld: JSON.stringify(jsonld, null, 2)
  };
  
  // Build enhanced body
  let enhancedBody = article.body;
  
  // Add related articles section
  if (related.length > 0) {
    enhancedBody += '\n\n---\n\n## Related Articles\n\n';
    related.forEach(r => {
      enhancedBody += `- [${r.title}](${r.url})\n`;
    });
  }
  
  // Add authoritative links section
  if (authLinks.length > 0) {
    enhancedBody += '\n\n## Resources\n\n';
    authLinks.forEach(l => {
      enhancedBody += `- [${l.text}](${l.url})\n`;
    });
  }
  
  // Rebuild markdown with enhanced frontmatter
  const enhanced = matter.stringify(enhancedBody, enhancedFrontmatter);
  
  // Write enhanced version
  const outputPath = path.join(OUTPUT_DIR, article.filename);
  fs.writeFileSync(outputPath, enhanced);
  
  console.log(`  ✅ Enhanced: ${outputPath}`);
});

console.log(`\n✅ Enhanced ${articles.length} articles`);
console.log(`📁 Output: ${OUTPUT_DIR}`);
