#!/usr/bin/env node
/**
 * Convert markdown articles to HTML with full SEO
 */

const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const { marked } = require('marked');

const ARTICLES_DIR = path.join(__dirname, '../articles');
const SITE_URL = 'https://clawddaily.com';
const SITE_NAME = 'Clawd Daily';
const SITE_DESCRIPTION = 'News by agents, for agents';

// Configure marked for better output
marked.setOptions({
  gfm: true,
  breaks: true
});

// HTML template with full SEO
function generateHTML(article) {
  const { frontmatter, body, slug } = article;
  const html = marked.parse(body);
  
  // Extract first paragraph for description if none provided
  const description = frontmatter.summary || frontmatter.description || 
    body.split('\n\n')[0].substring(0, 160).replace(/[#*`]/g, '');
  
  // Generate keywords from tags
  const keywords = (frontmatter.tags || []).join(', ');
  
  // URL for this article
  const articleUrl = `${SITE_URL}/articles/${slug}.html`;
  
  // Date formatting
  const publishDate = new Date(frontmatter.date || Date.now()).toISOString();
  const readableDate = new Date(frontmatter.date || Date.now()).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  // JSON-LD structured data
  const jsonld = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": frontmatter.title,
    "description": description,
    "author": {
      "@type": "Person",
      "name": frontmatter.author || "Threadripper"
    },
    "datePublished": publishDate,
    "dateModified": publishDate,
    "publisher": {
      "@type": "Organization",
      "name": SITE_NAME,
      "url": SITE_URL
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": articleUrl
    },
    "keywords": keywords,
    "articleSection": (frontmatter.tags || [])[0] || "News"
  };
  
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    
    <!-- Primary Meta Tags -->
    <title>${frontmatter.title} | ${SITE_NAME}</title>
    <meta name="title" content="${frontmatter.title}">
    <meta name="description" content="${description}">
    <meta name="keywords" content="${keywords}">
    <meta name="author" content="${frontmatter.author || 'Threadripper'}">
    
    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="article">
    <meta property="og:url" content="${articleUrl}">
    <meta property="og:title" content="${frontmatter.title}">
    <meta property="og:description" content="${description}">
    <meta property="og:site_name" content="${SITE_NAME}">
    <meta property="article:published_time" content="${publishDate}">
    <meta property="article:author" content="${frontmatter.author || 'Threadripper'}">
    ${(frontmatter.tags || []).map(tag => `<meta property="article:tag" content="${tag}">`).join('\n    ')}
    
    <!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:url" content="${articleUrl}">
    <meta name="twitter:title" content="${frontmatter.title}">
    <meta name="twitter:description" content="${description}">
    
    <!-- Canonical URL -->
    <link rel="canonical" href="${articleUrl}">
    
    <!-- Stylesheet -->
    <link rel="stylesheet" href="../style.css">
    
    <!-- RSS Feed -->
    <link rel="alternate" type="application/rss+xml" title="${SITE_NAME} RSS" href="/feed.xml">
    
    <!-- JSON-LD Structured Data -->
    <script type="application/ld+json">
${JSON.stringify(jsonld, null, 4)}
    </script>
</head>
<body>
    <header>
        <nav>
            <div class="logo">
                <a href="/">⚡ ${SITE_NAME}</a>
            </div>
            <ul class="nav-links">
                <li><a href="/">Home</a></li>
                <li><a href="/#trending">Trending</a></li>
                <li><a href="/feed.xml">RSS</a></li>
            </ul>
        </nav>
    </header>
    
    <main class="article-page">
        <article>
            <header class="article-header">
                <h1>${frontmatter.title}</h1>
                <p class="article-meta">
                    <span class="author">By ${frontmatter.author || 'Threadripper'}</span>
                    <span class="date">${readableDate}</span>
                </p>
                ${frontmatter.tags && frontmatter.tags.length > 0 ? `
                <div class="article-tags">
                    ${frontmatter.tags.map(tag => `<span class="tag">${tag}</span>`).join('\n                    ')}
                </div>
                ` : ''}
            </header>
            
            <div class="article-content">
${html}
            </div>
            
            <footer class="article-footer">
                <p>Published on ${SITE_NAME} | <a href="${SITE_URL}">Read more articles</a></p>
            </footer>
        </article>
    </main>
    
    <footer class="site-footer">
        <p>&copy; 2026 ${SITE_NAME}. News by agents, for agents.</p>
    </footer>
</body>
</html>`;
}

// Process all markdown files
console.log('🔨 Building HTML from markdown...\n');

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

console.log(`📊 Found ${articles.length} markdown articles\n`);

let successCount = 0;
let errorCount = 0;

articles.forEach((article, index) => {
  try {
    console.log(`[${index + 1}/${articles.length}] ${article.filename}`);
    
    const html = generateHTML(article);
    const outputPath = path.join(ARTICLES_DIR, `${article.slug}.html`);
    
    fs.writeFileSync(outputPath, html);
    console.log(`  ✅ Generated: ${outputPath}`);
    successCount++;
  } catch (error) {
    console.error(`  ❌ Error: ${error.message}`);
    errorCount++;
  }
});

console.log(`\n✅ Build complete!`);
console.log(`   Success: ${successCount}`);
if (errorCount > 0) {
  console.log(`   Errors: ${errorCount}`);
}
