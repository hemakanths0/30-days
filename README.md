# My 30-Day Reset

This is an HTML, CSS, and JavaScript dashboard served by a small Express backend. Dashboard data and chat history remain in browser localStorage. Chat requests are sent server-side to OpenAI through its official Node SDK.

## Enable AI replies

The assistant sends `POST /api/chat` with JSON shaped like this:

```json
{
  "messages": [
    { "role": "user", "content": "Plan my day." }
  ],
  "context": {
    "date": "2026-10-16",
    "challengeDay": 1,
    "tasksCompleted": 0,
    "tasksTotal": 6,
    "learningMinutes": 0,
    "collegeStudyCheckedIn": false,
    "gymStatus": "Planned",
    "mood": "not checked in",
    "energy": "not checked in",
    "schedule": []
  }
}
```

Return a JSON response containing a string `reply` (or `message`):

```json
{ "reply": "Let's choose one realistic priority first." }
```

The included `server.mjs` implements this endpoint. It validates input, caps request size and history length, rate-limits requests, and returns clear setup/provider errors. The key is read from the server-side `.env` file only. Do not put secrets in `app.js`, HTML, or public environment variables.

## Voice support

Voice input uses the browser's Web Speech Recognition API when available and may require microphone permission and a secure context. Spoken replies use browser speech synthesis via each assistant message's **Read aloud** button. Browser and operating-system support varies.

## Run in VS Code

1. Install Node.js LTS from https://nodejs.org/ (this provides both `node` and `npm`).
2. Open this project folder in VS Code, then open **Terminal → New Terminal**.
3. Install the server dependencies:

  ```powershell
  npm install
  ```

4. Create your local environment file and add your OpenAI API key. In PowerShell:

  ```powershell
  Copy-Item .env.example .env
  notepad .env
  ```

  Replace `your_api_key_here` with your key, save, and close Notepad. Keep `.env` private; it is ignored by Git. The default model is `gpt-4o-mini`; change `OPENAI_MODEL` in `.env` only to a model available to your OpenAI account.

5. Start the combined frontend and backend:

  ```powershell
  npm run dev
  ```

6. Visit **http://localhost:3000**. Do not use Live Server for this run; the included Express server serves the existing static site and `/api/chat` on the same origin.
7. Open the assistant, send a prompt, and check that an actual provider response appears. To verify backend validation without a key, try:

  ```powershell
  Invoke-RestMethod -Method Post -Uri http://localhost:3000/api/chat -ContentType 'application/json' -Body '{"messages":[]}'
  ```

  The invalid request should return HTTP 400. With an unset key, a valid request returns HTTP 503 with setup instructions. Only a valid key and successful provider call confirm live AI operation.

8. Stop the server with **Ctrl+C**. For a normal non-watch start, use `npm start` instead of `npm run dev`.