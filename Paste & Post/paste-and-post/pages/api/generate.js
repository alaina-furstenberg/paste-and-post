import Groq from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { title, description, goal } = req.body;

    if (!title && !description) {
      return res.status(400).json({ error: 'Title or description is required' });
    }

    const goalPrompts = {
      sell: "Focus on the value proposition and benefits. Create urgency and desire.",
      consistency: "Keep it engaging but professional. Maintain brand voice.",
      event: "Highlight key details like date, time, and what makes it special.",
      educate: "Make it informative but accessible. Share useful insights."
    };

    const prompt = `Write a natural, human-sounding social media caption for this content:

Title: ${title}
Description: ${description}
Goal: ${goalPrompts[goal] || goalPrompts.consistency}

Style guidelines:
- Write like a busy business owner, not AI
- Keep it conversational and slightly imperfect
- Avoid clichés like "stunning", "amazing", "beautiful"
- Use short, varied sentences
- Maximum 1 emoji, placed naturally
- Be specific, not generic
- Keep under 150 words
- Don't mention the website URL

Caption:`;

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      model: "llama-3.1-8b-instant",
      temperature: 0.7,
      max_tokens: 200,
    });

    const caption = completion.choices[0]?.message?.content?.trim() || '';

    return res.json({ caption });

  } catch (error) {
    console.error('AI generation error:', error);
    return res.status(500).json({ error: 'Failed to generate caption' });
  }
}