import 'dotenv/config';
import express from 'express';
import { rateLimit } from 'express-rate-limit';
import OpenAI from 'openai';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const port = Number(process.env.PORT) || 3000;
const model = process.env.OPENAI_MODEL || 'gpt-4o-mini';
const maxMessageLength = 2000;
const maxHistoryItems = 30;

app.disable('x-powered-by');
app.use(express.json({ limit: '256kb', strict: true }));

const chatLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { error: 'You have sent several messages recently. Please wait a few minutes and try again.' }
});

function validMessages(messages) {
  return Array.isArray(messages)
    && messages.length > 0
    && messages.length <= maxHistoryItems
    && messages.every(message => message
      && typeof message === 'object'
      && ['user', 'assistant'].includes(message.role)
      && typeof message.content === 'string'
      && message.content.trim().length > 0
      && message.content.length <= maxMessageLength);
}

app.post('/api/chat', chatLimiter, async (request, response) => {
  if (!validMessages(request.body?.messages)) {
    return response.status(400).json({ error: `Send between 1 and ${maxHistoryItems} non-empty user or assistant messages, each no longer than ${maxMessageLength} characters.` });
  }

  if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'your_api_key_here') {
    return response.status(503).json({ error: 'The AI service is not configured. Copy .env.example to .env and set OPENAI_API_KEY, then restart the server.' });
  }

  try {
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const context = request.body.context && typeof request.body.context === 'object'
      ? JSON.stringify(request.body.context).slice(0, 5000)
      : '{}';
    const result = await client.chat.completions.create({
      model,
      messages: [
        { role: 'system', content: `You are the My 30-Day Reset study and wellbeing assistant for a B.Tech second-year student. Be encouraging without pressure. Prefer concise, practical steps. Support Python, beginner machine learning, college planning, reducing unhelpful scrolling, and sustainable exercise. Treat workout advice conservatively; encourage rest when unwell or in pain and do not give medical diagnoses. Use this dashboard context only when relevant: ${context}` },
        ...request.body.messages.map(message => ({ role: message.role, content: message.content.trim() }))
      ],
      max_tokens: 700,
      timeout: 30_000
    });
    const reply = result.choices[0]?.message?.content?.trim();
    if (!reply) return response.status(502).json({ error: 'The AI provider returned no text. Please retry.' });
    return response.json({ reply });
  } catch (error) {
    console.error('OpenAI request failed:', error?.status || error?.name || 'unknown provider error');
    if (error?.status === 401 || error?.status === 403) {
      return response.status(502).json({ error: 'The AI provider rejected the configured credentials. Check OPENAI_API_KEY in .env and restart the server.' });
    }
    if (error?.status === 429) {
      return response.status(429).json({ error: 'The AI provider is rate-limiting requests or the account has reached its usage limit. Wait, check billing, and retry.' });
    }
    return response.status(502).json({ error: 'The AI provider could not complete this request. Please retry in a moment.' });
  }
});

app.use('/api', (_request, response) => response.status(404).json({ error: 'API route not found.' }));
app.get('/', (_request, response) => response.sendFile(path.join(__dirname, 'index.html')));
app.get(['/index.html', '/app.js', '/styles.css'], (_request, response) => {
  response.sendFile(path.join(__dirname, _request.path.slice(1)));
});
app.use((_request, response) => response.status(404).type('text').send('Not found.'));

app.use((error, _request, response, _next) => {
  if (error?.type === 'entity.too.large') return response.status(413).json({ error: 'Request is too large. Keep each message under 2,000 characters.' });
  if (error instanceof SyntaxError && 'body' in error) return response.status(400).json({ error: 'Request body must be valid JSON.' });
  console.error('Request failed:', error?.name || 'unknown error');
  return response.status(500).json({ error: 'The server could not process this request.' });
});

app.listen(port, () => {
  console.log(`My 30-Day Reset is running at http://localhost:${port}`);
  if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'your_api_key_here') {
    console.warn('OPENAI_API_KEY is missing. Dashboard works; /api/chat will return a setup message.');
  }
});
