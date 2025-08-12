'use client';

import { useState } from 'react';

interface ScrapedContent {
  title: string;
  description: string;
  images: string[];
  url: string;
}

interface GeneratedPost {
  caption: string;
  selectedImage?: string;
}

export default function Home() {
  const [url, setUrl] = useState('');
  const [goal, setGoal] = useState('');
  const [loading, setLoading] = useState(false);
  const [scrapedContent, setScrapedContent] = useState<ScrapedContent | null>(null);
  const [generatedPost, setGeneratedPost] = useState<GeneratedPost | null>(null);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      // Step 1: Scrape content
      const scrapeResponse = await fetch('/api/scrape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });

      if (!scrapeResponse.ok) {
        throw new Error('Failed to scrape content');
      }

      const scraped = await scrapeResponse.json();
      setScrapedContent(scraped);

      // Step 2: Generate caption
      const generateResponse = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: scraped.title,
          description: scraped.description,
          goal,
          url: scraped.url,
        }),
      });

      if (!generateResponse.ok) {
        throw new Error('Failed to generate caption');
      }

      const generated = await generateResponse.json();
      setGeneratedPost({
        caption: generated.caption,
        selectedImage: scraped.images[0] || '',
      });

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setScrapedContent(null);
    setGeneratedPost(null);
    setError('');
    setUrl('');
    setGoal('');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-2">Paste & Post</h1>
        <p className="text-gray-600 text-center mb-8">
          Generate professional social media posts from any link
        </p>

        {/* Input Form */}
        {!generatedPost && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-1">
                  Website URL
                </label>
                <input
                  type="text"
                  id="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://example.com or 'test' for demo"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                />
              </div>
              
              <div>
                <label htmlFor="goal" className="block text-sm font-medium text-gray-700 mb-1">
                  Post Goal
                </label>
                <select
                  id="goal"
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                  required
                >
                  <option value="">Select a goal</option>
                  <option value="sell">Sell something</option>
                  <option value="consistency">Maintain consistency</option>
                  <option value="event">Promote an event</option>
                  <option value="educate">Educate/inform</option>
                </select>
              </div>
              
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Generating...' : 'Generate Post'}
              </button>
            </form>

            {error && (
              <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {error}
              </div>
            )}
          </div>
        )}

        {/* Preview */}
        {generatedPost && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Generated Post</h2>
            
            {generatedPost.selectedImage && (
              <div className="mb-4">
                <img
                  src={generatedPost.selectedImage}
                  alt="Post image"
                  className="w-full max-w-sm mx-auto rounded-lg"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
            )}
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Caption
              </label>
              <textarea
                value={generatedPost.caption}
                onChange={(e) => setGeneratedPost({
                  ...generatedPost,
                  caption: e.target.value
                })}
                className="w-full h-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex space-x-3">
              <button
                onClick={resetForm}
                className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600"
              >
                Start Over
              </button>
              <button className="flex-1 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700">
                Post to Social Media
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
