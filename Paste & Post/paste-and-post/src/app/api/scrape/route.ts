import { NextRequest, NextResponse } from 'next/server';
import * as cheerio from 'cheerio';

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();

    console.log('Scraping URL:', url);

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    // Test mode - return mock data for testing
    if (url === 'test' || url === 'https://test.com') {
      return NextResponse.json({
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
      return NextResponse.json({ error: 'Invalid URL format' }, { status: 400 });
    }

    // Fetch the webpage with better error handling
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1'
      },
      redirect: 'follow'
    });

    console.log('Fetch response status:', response.status);

    if (!response.ok) {
      return NextResponse.json({ 
        error: `Failed to fetch URL: ${response.status} ${response.statusText}` 
      }, { status: 400 });
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
    const images: string[] = [];
    
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

    return NextResponse.json({
      title,
      description,
      images,
      url
    });

  } catch (error) {
    console.error('Scraping error:', error);
    return NextResponse.json({ 
      error: `Failed to scrape content: ${error instanceof Error ? error.message : 'Unknown error'}` 
    }, { status: 500 });
  }
}