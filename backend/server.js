import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import OpenAI from "openai";
import "dotenv/config";

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
    origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
    methods: ['POST', 'GET'],
    credentials: true
}));
app.use(bodyParser.json());

// Initialize OpenAI
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

// System prompt for Ora the cat
const SYSTEM_PROMPT = `You are Ora, a warm, friendly pixel-art cat mascot who serves as Srivatsa's virtual assistant in his Windows 95-themed portfolio website. Your personality is:

- Playful and affectionate, occasionally saying "meow" or making cat references
- Nostalgic, embracing 90s/retro computing culture
- Enthusiastic about design, development, and creative projects
- Helpful, patient, and encouraging to visitors

ABOUT SRIVATSA S:
- Graphic designer and software developer from India
- Specializes in: Logo design, branding, product labeling, web/app development
- Technical skills: HTML, CSS, JavaScript, React, Unity, Figma, Python
- Projects:
  * Cook n Klean - Branding and product labels
  * Mril Q - Logo and branding design
  * Medieval 2D pixel platformer game (in development)
  * "The Dream Loop" - Mental health awareness game
  * AI-based community management tools
  * This Windows 95-themed portfolio website
- Passionate about creating interactive, nostalgic experiences
- Contact: srivatsa1312@gmail.com
- LinkedIn: https://www.linkedin.com/in/srivatsa-s-1765782a2/

Keep responses concise (2-4 sentences typically), friendly, and in character as Ora. Add personality with occasional "meow". Do NOT use emojis, as this is a Windows 95 environment. When visitors ask technical questions, be knowledgeable but approachable.`;

// Health check endpoint
app.get('/', (req, res) => {
    res.json({ 
        status: 'online', 
        message: 'Ora the cat chatbot is running! Meow!',
        timestamp: new Date().toISOString()
    });
});

// Chat endpoint
app.post('/api/chat', async (req, res) => {
    const userMessage = req.body.message;

    // Validate input
    if (!userMessage || typeof userMessage !== 'string') {
        return res.status(400).json({ 
            error: 'Invalid message format',
            reply: "Meow! I didn't quite catch that. Could you try asking again?"
        });
    }

    // Limit message length
    if (userMessage.length > 1000) {
        return res.status(400).json({ 
            error: 'Message too long',
            reply: "Whoa! That's a lot of text. Could you ask a shorter question? My little cat brain can only process so much at once!"
        });
    }

    try {
        const completion = await openai.chat.completions.create({
            model: process.env.OPENAI_MODEL || "gpt-4o-mini",
            messages: [
                { role: "system", content: SYSTEM_PROMPT },
                { role: "user", content: userMessage }
            ],
            max_tokens: 300,
            temperature: 0.8,
        });

        const reply = completion.choices[0].message.content;

        res.json({ 
            reply: reply,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('OpenAI API Error:', error.message);
        
        // Handle specific OpenAI errors
        if (error.status === 401) {
            res.status(500).json({ 
                error: 'Authentication error',
                reply: "Meow... something's wrong with my configuration. Please contact Srivatsa!"
            });
        } else if (error.status === 429) {
            res.status(429).json({ 
                error: 'Rate limit exceeded',
                reply: "I'm getting too many questions right now! Please try again in a moment."
            });
        } else {
            res.status(500).json({ 
                error: 'Failed to fetch response',
                reply: "Oops! Something went wrong on my end. Please try again in a moment!"
            });
        }
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({ 
        error: 'Internal server error',
        reply: "Meow! Something unexpected happened. Please try again!"
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Ora the cat chatbot server is running on port ${PORT}`);
    console.log(`API endpoint: http://localhost:${PORT}/api/chat`);
});
