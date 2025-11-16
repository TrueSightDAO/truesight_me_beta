#!/usr/bin/env node
/**
 * Scrape blog posts from live truesight.me website using browser automation
 * This downloads the actual rendered HTML content from each blog post page
 * 
 * Usage:
 *   node scripts/scrapeBlogPosts.js
 * 
 * Requires:
 *   npm install playwright
 */

require("dotenv").config();
const fs = require("fs");
const path = require("path");
const { chromium } = require("playwright");

const BLOG_DIR = path.join(__dirname, "..", "blog");
const BLOG_POSTS_DIR = path.join(BLOG_DIR, "posts");
const DATA_DIR = path.join(__dirname, "..", "data");

/**
 * Generate slug from title
 */
function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Escape HTML special characters
 */
function escapeHTML(text) {
  if (typeof text !== "string") return text;
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/**
 * Format date
 */
function formatDate(dateStr) {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * Extract main content from scraped HTML
 */
function extractContent(html) {
  // Try to find the main blog post content area
  // Common selectors: article, .blog-post, .post-content, [data-testid="richTextElement"]
  const contentMatch = html.match(/<article[^>]*>([\s\S]*?)<\/article>/i) ||
                       html.match(/<div[^>]*class="[^"]*blog[^"]*post[^"]*content[^"]*"[^>]*>([\s\S]*?)<\/div>/i) ||
                       html.match(/<div[^>]*data-testid="richTextElement"[^>]*>([\s\S]*?)<\/div>/i) ||
                       html.match(/<main[^>]*>([\s\S]*?)<\/main>/i);
  
  if (contentMatch) {
    return contentMatch[1].trim();
  }
  
  // Fallback: try to extract content between specific markers
  return html;
}

/**
 * Generate HTML template for blog post
 */
function generatePostHTML(title, slug, publishDate, author, tags, coverImage, content, allPosts, postIndex) {
  // Find previous and next posts
  const prevPost = postIndex > 0 ? allPosts[postIndex - 1] : null;
  const nextPost = postIndex < allPosts.length - 1 ? allPosts[postIndex + 1] : null;

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapeHTML(title)} | TrueSight DAO Blog</title>
    <meta name="description" content="${escapeHTML(title)}" />
    <link
      rel="icon"
      href="https://static.wixstatic.com/ficons/0e2cde_dd65db118f8f499eb06c159d7262167d%7Emv2.ico"
      type="image/x-icon"
    />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@400;500;600&display=swap"
      rel="stylesheet"
    />
    <link rel="stylesheet" href="../../styles/main.css" />
  </head>
  <body>
    <nav class="site-header">
      <div class="header-container">
        <a href="../../index.html" class="header-logo">
          <img
            src="https://static.wixstatic.com/media/0e2cde_f81b16c82ebe4aaca4b5ce54b819a693~mv2.png/v1/fill/w_622,h_160,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/20240612_truesight_dao_logo_long.png"
            alt="TrueSight DAO"
            width="155"
            height="40"
            loading="eager"
          />
        </a>
        <button class="menu-toggle" aria-label="Toggle menu" aria-expanded="false">
          <span class="hamburger-line"></span>
          <span class="hamburger-line"></span>
          <span class="hamburger-line"></span>
        </button>
        <ul class="nav-menu" aria-hidden="true">
          <li><a href="../../index.html">Home</a></li>
          <li><a href="../../agroverse.html">Agroverse</a></li>
          <li><a href="../../sunmint.html">Sunmint</a></li>
          <li><a href="../../edgar.html">Edgar</a></li>
          <li><a href="../../about-us.html">About Us</a></li>
          <li><a href="../index.html">Blog</a></li>
          <li><a href="https://truesight.me/whitepaper" target="_blank" rel="noreferrer">Whitepaper</a></li>
          <li><a href="https://dapp.truesight.me" target="_blank" rel="noreferrer">DApp</a></li>
        </ul>
      </div>
    </nav>
    <div class="page blog-post-page">
      <article class="blog-post">
        <header class="blog-post-header">
          <a href="../index.html" class="text-link" style="margin-bottom: var(--space-md); display: inline-block;">← Back to Blog</a>
          <h1>${escapeHTML(title)}</h1>
          <div class="blog-post-meta">
            ${publishDate ? `<time datetime="${publishDate}">${publishDate}</time>` : ""}
            ${author ? `<span>by ${escapeHTML(author)}</span>` : ""}
            ${tags ? `<span class="blog-tags">${escapeHTML(tags)}</span>` : ""}
          </div>
          ${coverImage ? `<img src="${coverImage}" alt="${escapeHTML(title)}" class="blog-post-cover" loading="eager" />` : ""}
        </header>
        <div class="blog-post-content">
          ${content}
        </div>
        <footer class="blog-post-footer">
          ${prevPost ? `<a href="${prevPost.slug}.html" class="text-link">← ${escapeHTML(prevPost.title || "Previous Post")}</a>` : ""}
          ${nextPost ? `<a href="${nextPost.slug}.html" class="text-link" style="margin-left: auto;">${escapeHTML(nextPost.title || "Next Post")} →</a>` : ""}
        </footer>
      </article>
    </div>
    <footer class="footer">
      <div class="footer-content">
        <h2>JOIN OUR MOVEMENT</h2>
        <p>Co-Create with us</p>
        <div class="footer-social">
          <a href="https://t.me/TrueSightDAO" target="_blank" rel="noreferrer noopener" aria-label="Telegram">
            <img
              src="../../assets/telegram-icon.jpg"
              alt="Telegram"
              width="48"
              height="48"
              loading="lazy"
            />
          </a>
          <a href="https://github.com/TrueSightDAO" target="_blank" rel="noreferrer noopener" aria-label="GitHub">
            <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="currentColor">
              <title>GitHub</title>
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
          </a>
        </div>
      </div>
    </footer>
    <script>
      // Hamburger menu toggle
      (function() {
        const menuToggle = document.querySelector('.menu-toggle');
        const navMenu = document.querySelector('.nav-menu');
        const siteHeader = document.querySelector('.site-header');
        
        if (!menuToggle || !navMenu) return;
        
        menuToggle.addEventListener('click', function() {
          const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
          menuToggle.setAttribute('aria-expanded', !isExpanded);
          navMenu.setAttribute('aria-hidden', isExpanded);
          siteHeader.classList.toggle('menu-open', !isExpanded);
        });
        
        navMenu.addEventListener('click', function(e) {
          if (e.target.tagName === 'A') {
            menuToggle.setAttribute('aria-expanded', 'false');
            navMenu.setAttribute('aria-hidden', 'true');
            siteHeader.classList.remove('menu-open');
          }
        });
        
        siteHeader.addEventListener('click', function(e) {
          if (e.target === siteHeader || e.target.classList.contains('site-header')) {
            menuToggle.setAttribute('aria-expanded', 'false');
            navMenu.setAttribute('aria-hidden', 'true');
            siteHeader.classList.remove('menu-open');
          }
        });
      })();
    </script>
  </body>
</html>`;
}

/**
 * Scrape a single blog post page
 */
async function scrapeBlogPost(page, postUrl, title, slug) {
  console.log(`   📄 Scraping: ${title}`);
  console.log(`      URL: ${postUrl}`);
  
  try {
    await page.goto(postUrl, { waitUntil: 'networkidle', timeout: 30000 });
    
    // Wait for content to load
    await page.waitForTimeout(2000);
    
    // Extract the main content
    const content = await page.evaluate(() => {
      // Try multiple selectors to find the blog post content
      const selectors = [
        'article',
        '[data-testid="richTextElement"]',
        '.blog-post-content',
        '.post-content',
        '[class*="blog"] [class*="content"]',
        'main',
      ];
      
      for (const selector of selectors) {
        const element = document.querySelector(selector);
        if (element) {
          return element.innerHTML;
        }
      }
      
      // Fallback: get body content
      const body = document.body;
      // Remove header, footer, navigation
      const header = body.querySelector('header, nav, .site-header');
      const footer = body.querySelector('footer, .footer');
      if (header) header.remove();
      if (footer) footer.remove();
      
      return body.innerHTML;
    });
    
    return content || "";
  } catch (err) {
    console.error(`      ❌ Error scraping ${title}: ${err.message}`);
    return "";
  }
}

/**
 * Main scraping function
 */
async function main() {
  console.log("🌐 Scraping blog posts from truesight.me...\n");

  // Create directories
  await fs.promises.mkdir(BLOG_DIR, { recursive: true });
  await fs.promises.mkdir(BLOG_POSTS_DIR, { recursive: true });

  try {
    // Load existing blog posts data to get URLs
    let postsData = [];
    try {
      const dataFile = path.join(DATA_DIR, "blog-posts.json");
      if (fs.existsSync(dataFile)) {
        const data = JSON.parse(await fs.promises.readFile(dataFile, "utf8"));
        postsData = data.posts || [];
      }
    } catch (err) {
      console.warn("   ⚠️  Could not load blog-posts.json, will try to scrape from blog index page");
    }

    // Launch browser
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    
    // Set user agent
    await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

    // If we don't have post data, scrape the blog index page to get URLs
    if (postsData.length === 0) {
      console.log("📋 Scraping blog index to get post URLs...");
      await page.goto("https://truesight.me/blog", { waitUntil: 'networkidle' });
      await page.waitForTimeout(2000);
      
      postsData = await page.evaluate(() => {
        const posts = [];
        // Try to find blog post links
        const links = document.querySelectorAll('a[href*="/blog/"], a[href*="/post/"]');
        links.forEach(link => {
          const href = link.getAttribute('href');
          const title = link.textContent.trim();
          if (href && title && !posts.find(p => p.url === href)) {
            posts.push({
              title: title,
              url: href.startsWith('http') ? href : `https://truesight.me${href}`,
              slug: href.split('/').pop().replace(/\.html$/, ''),
            });
          }
        });
        return posts;
      });
    }

    if (postsData.length === 0) {
      console.error("❌ No blog posts found to scrape");
      await browser.close();
      return;
    }

    console.log(`\n✅ Found ${postsData.length} blog posts to scrape\n`);

    // Sort posts by date (newest first)
    postsData.sort((a, b) => {
      const dateA = new Date(a.publishDate || 0);
      const dateB = new Date(b.publishDate || 0);
      return dateB - dateA;
    });

    // Scrape each post
    const allPosts = [];
    for (let i = 0; i < postsData.length; i++) {
      const post = postsData[i];
      const postUrl = post.url || `https://truesight.me/blog/${post.slug || slugify(post.title)}`;
      
      const content = await scrapeBlogPost(page, postUrl, post.title, post.slug || slugify(post.title));
      
      if (content) {
        const fullPost = {
          ...post,
          content: content,
          slug: post.slug || slugify(post.title),
          publishDate: formatDate(post.publishDate),
        };
        allPosts.push(fullPost);
      }
      
      // Small delay between requests
      await page.waitForTimeout(1000);
    }

    await browser.close();

    // Generate HTML files
    console.log("\n📄 Generating HTML files...");
    for (let i = 0; i < allPosts.length; i++) {
      const post = allPosts[i];
      const slug = post.slug || slugify(post.title || "");
      const filename = `${slug}.html`;
      const filepath = path.join(BLOG_POSTS_DIR, filename);
      
      const html = generatePostHTML(
        post.title || "Untitled",
        slug,
        post.publishDate,
        post.author || "TrueSight DAO",
        post.tags ? (Array.isArray(post.tags) ? post.tags.join(", ") : post.tags) : "",
        post.coverImage || "",
        post.content || "",
        allPosts,
        i
      );
      
      await fs.promises.writeFile(filepath, html, "utf8");
      console.log(`   ✅ ${filename}`);
    }

    console.log(`\n✅ Blog scraping complete!`);
    console.log(`   Posts: ${allPosts.length}`);
    console.log(`   Output: ${BLOG_POSTS_DIR}`);
  } catch (err) {
    console.error("\n❌ Blog scraping failed:", err.message);
    console.error(err.stack);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error("\n❌ Fatal error:", err.message);
  console.error(err.stack);
  process.exit(1);
});

