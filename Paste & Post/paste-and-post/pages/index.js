import { useState } from 'react';

export default function Home() {
  const [url, setUrl] = useState('');
  const [goal, setGoal] = useState('');
  const [loading, setLoading] = useState(false);
  const [generatedPost, setGeneratedPost] = useState(null);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
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

      // Step 2: Generate caption
      const generateResponse = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: scraped.title,
          description: scraped.description,
          goal,
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
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setGeneratedPost(null);
    setError('');
    setUrl('');
    setGoal('');
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb', padding: '20px' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 'bold', textAlign: 'center', marginBottom: '10px' }}>Paste & Post</h1>
        <p style={{ color: '#6b7280', textAlign: 'center', marginBottom: '40px' }}>
          Generate professional social media posts from any link
        </p>

        {!generatedPost && (
          <div style={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', padding: '30px', marginBottom: '20px' }}>
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '5px' }}>
                  Website URL
                </label>
                <input
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://example.com or 'test' for demo"
                  style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '16px', color: '#1f2937' }}
                  required
                />
              </div>
              
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '5px' }}>
                  Post Goal
                </label>
                <select
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '16px', color: '#1f2937' }}
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
                style={{ 
                  width: '100%', 
                  backgroundColor: loading ? '#9ca3af' : '#2563eb', 
                  color: 'white', 
                  padding: '12px', 
                  border: 'none', 
                  borderRadius: '6px', 
                  fontSize: '16px',
                  cursor: loading ? 'not-allowed' : 'pointer'
                }}
              >
                {loading ? 'Generating...' : 'Generate Post'}
              </button>
            </form>

            {error && (
              <div style={{ marginTop: '20px', padding: '12px', backgroundColor: '#fee2e2', border: '1px solid #fca5a5', color: '#dc2626', borderRadius: '6px' }}>
                {error}
              </div>
            )}
          </div>
        )}

        {generatedPost && (
          <div style={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', padding: '30px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '20px' }}>Generated Post</h2>
            
            {generatedPost.selectedImage && (
              <div style={{ marginBottom: '20px', textAlign: 'center' }}>
                <img
                  src={generatedPost.selectedImage}
                  alt="Post image"
                  style={{ maxWidth: '300px', width: '100%', borderRadius: '8px' }}
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
            )}
            
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                Caption
              </label>
              <textarea
                value={generatedPost.caption}
                onChange={(e) => setGeneratedPost({
                  ...generatedPost,
                  caption: e.target.value
                })}
                style={{ width: '100%', height: '120px', padding: '12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '16px', color: '#1f2937', fontFamily: 'inherit' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={resetForm}
                style={{ flex: 1, backgroundColor: '#6b7280', color: 'white', padding: '12px', border: 'none', borderRadius: '6px', fontSize: '16px', cursor: 'pointer' }}
              >
                Start Over
              </button>
              <button style={{ flex: 1, backgroundColor: '#059669', color: 'white', padding: '12px', border: 'none', borderRadius: '6px', fontSize: '16px', cursor: 'pointer' }}>
                Post to Social Media
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}