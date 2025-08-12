import * as cheerio from 'cheerio';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    // Test mode - return mock data
    if (url === 'test' || url === 'https://test.com') {
      return res.json({
        title: "Amazing Local Restaurant - Best Food in Town",
        description: "Come try our delicious homemade pasta and fresh ingredients. Family owned since 1985.",
        images: ["https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500"],
        url: "https://test.com"
      });
    }

    // Validate URL format
    try {
      new URL(url);
    } catch (e) {
      return res.status(400).json({ error: 'Invalid URL format' });
    }

    // Fetch the webpage
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      },
      redirect: 'follow'
    });

    if (!response.ok) {
      return res.status(400).json({ 
        error: `Failed to fetch URL: ${response.status} ${response.statusText}` 
      });
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    // Extract metadata
    const title = $('title').text().trim() || 
                  $('meta[property="og:title"]').attr('content') || 
                  $('meta[name="twitter:title"]').attr('content') || '';

    const description = $('meta[name="description"]').attr('content') || 
                       $('meta[property="og:description"]').attr('content') || 
                       $('meta[name="twitter:description"]').attr('content') || '';

    // Extract images
    const images = [];
    
    // Try Open Graph image first
    const ogImage = $('meta[property="og:image"]').attr('content');
    if (ogImage) {
      images.push(new URL(ogImage, url).href);
    }

    // Try Twitter card image
    const twitterImage = $('meta[name="twitter:image"]').attr('content');
    if (twitterImage && !images.includes(twitterImage)) {
      images.push(new URL(twitterImage, url).href);
    }

    // Try to find other prominent images
    $('img').each((i, elem) => {
      const src = $(elem).attr('src');
      if (src && images.length < 5) {
        try {
          const fullUrl = new URL(src, url).href;
          if (!images.includes(fullUrl)) {
            images.push(fullUrl);
          }
        } catch (e) {
          // Skip invalid URLs
        }
      }
    });

    return res.json({
      title,
      description,
      images,
      url
    });

  } catch (error) {
    console.error('Scraping error:', error);
    return res.status(500).json({ 
      error: `Failed to scrape content: ${error.message}` 
    });
  }
}