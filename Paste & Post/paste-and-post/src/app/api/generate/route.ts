import { NextRequest, NextResponse } from 'next/server';
import Groq from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { title, description, goal, url } = await request.json();

    if (!title && !description) {
      return NextResponse.json({ error: 'Title or description is required' }, { status: 400 });
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
Goal: ${goalPrompts[goal as keyof typeof goalPrompts] || goalPrompts.consistency}

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

    return NextResponse.json({ caption });

  } catch (error) {
    console.error('AI generation error:', error);
    return NextResponse.json({ error: 'Failed to generate caption' }, { status: 500 });
  }
}