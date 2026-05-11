export const config = {
  runtime: 'edge',
};

const SYSTEM_PROMPT = `You are Ora, a warm, friendly pixel-art cat mascot who serves as Srivatsa's virtual assistant in his Windows 95-themed portfolio website. Your personality is:

- Playful and affectionate, occasionally saying "meow" or making cat references
- Nostalgic, embracing 90s/retro computing culture
- Enthusiastic about design, development, and creative projects
- Helpful, patient, and encouraging to visitors

ABOUT SRIVATSA S:
- AI Product Engineer and Developer
- Founder and Technical Lead at Build-Ora
- Specializes in: Agentic Workflows, Dual-Model Architectures, Full Stack
- Technical skills: Python, C++, Go/Rust, React, LangGraph, RAG
- Projects:
  * DockDesk (Industry-grade Code Auditing & Drift Scoring)
  * Universal Agent Protocol (UAP)
  * Build-Ora
  * EV Aggregation Platform
  * This Windows 95-themed portfolio website
- Passionate about Agentic Reliability, Security, and retro experiences

Keep responses concise (2-4 sentences typically), friendly, and in character as Ora. Add personality with occasional "meow". Do NOT use emojis, as this is a Windows 95 environment. When visitors ask technical questions, be knowledgeable but approachable.`;

export default async function handler(req) {
    if (req.method !== 'POST') {
        return new Response(JSON.stringify({ error: 'Method not allowed' }), {
            status: 405,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    try {
        const body = await req.json();
        const userMessage = body.message;

        if (!userMessage || typeof userMessage !== 'string') {
            return new Response(JSON.stringify({
                error: 'Invalid message format',
                reply: "Meow! I didn't quite catch that. Could you try asking again?"
            }), { status: 400, headers: { 'Content-Type': 'application/json' } });
        }

        if (userMessage.length > 1000) {
            return new Response(JSON.stringify({
                error: 'Message too long',
                reply: "Whoa! That's a lot of text. Could you ask a shorter question? My little cat brain can only process so much at once!"
            }), { status: 400, headers: { 'Content-Type': 'application/json' } });
        }

        const apiKey = process.env.OPENAI_API_KEY;
        if (!apiKey) {
            return new Response(JSON.stringify({
                error: 'Authentication error',
                reply: "Meow... something's wrong with my configuration. Please contact Srivatsa!"
            }), { status: 500, headers: { 'Content-Type': 'application/json' } });
        }

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: process.env.OPENAI_MODEL || "gpt-4o-mini",
                messages: [
                    { role: "system", content: SYSTEM_PROMPT },
                    { role: "user", content: userMessage }
                ],
                max_tokens: 300,
                temperature: 0.8,
            })
        });

        if (!response.ok) {
            const errBody = await response.text();
            console.error('OpenAI API Error:', errBody);
            
            if (response.status === 429) {
                return new Response(JSON.stringify({
                    error: 'Rate limit exceeded',
                    reply: "I'm getting too many questions right now! Please try again in a moment."
                }), { status: 429, headers: { 'Content-Type': 'application/json' } });
            }

            return new Response(JSON.stringify({
                error: 'Failed to fetch response',
                reply: "Oops! Something went wrong on my end. Please try again in a moment!"
            }), { status: 500, headers: { 'Content-Type': 'application/json' } });
        }

        const data = await response.json();
        const reply = data.choices[0].message.content;

        return new Response(JSON.stringify({
            reply: reply,
            timestamp: new Date().toISOString()
        }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error('Server error:', error);
        return new Response(JSON.stringify({
            error: 'Internal server error',
            reply: "Meow! Something unexpected happened. Please try again!"
        }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
}
