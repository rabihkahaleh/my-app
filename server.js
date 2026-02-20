import express from 'express';
import nodemailer from 'nodemailer';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));

let transporter = null;

// Configure SMTP transporter
app.post('/api/configure', (req, res) => {
  const { host, port, secure } = req.body;
  transporter = nodemailer.createTransport({
    host,
    port: Number(port),
    secure: secure ?? false,
    tls: { rejectUnauthorized: false }
  });

  console.log(`[SMTP] Connecting to ${host}:${port} (secure: ${secure ?? false})`);
  transporter.verify((error) => {
    if (error) {
      console.error(`[SMTP FAIL] ${error.message}`);
      transporter = null;
      res.json({ success: false, error: error.message });
    } else {
      console.log(`[SMTP OK] Connected to ${host}:${port}`);
      res.json({ success: true });
    }
  });
});

// Generate personalized intro using Gemini AI
app.post('/api/generate-intro', async (req, res) => {
  const { apiKey, name, jobTitle } = req.body;

  if (!apiKey) {
    return res.json({ success: false, error: 'Gemini API key is required' });
  }

  const prompt = `You are writing a professional email invitation on behalf of Rabih Kahaleh from the University of Balamand, inviting someone to join the "AI in Education Certificate Program".

Write ONLY a single personalized introductory paragraph (2-3 sentences max) for the following person:
- Name: ${name}
- Job Title/Role: ${jobTitle}

The paragraph should:
- Acknowledge their specific role/profession naturally
- Explain why AI literacy is relevant to their specific field
- Transition into inviting them to the AI in Education Certificate Program by the University of Balamand
- Be warm, professional, and concise
- NOT include any greeting (no "Dear..."), NOT include any sign-off
- NOT mention the information session details, dates, or registration links

Return ONLY the paragraph text, nothing else.`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 1024,
            thinkingConfig: { thinkingBudget: 0 }
          }
        }),
      }
    );

    const data = await response.json();

    if (data.error) {
      return res.json({ success: false, error: data.error.message });
    }

    const text = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
    if (text) {
      res.json({ success: true, intro: text });
    } else {
      res.json({ success: false, error: 'No response from Gemini' });
    }
  } catch (error) {
    res.json({ success: false, error: error.message });
  }
});

// Send a single email
app.post('/api/send', async (req, res) => {
  if (!transporter) {
    return res.json({ success: false, error: 'SMTP not configured' });
  }

  const { to, subject, html, from, cc, bcc } = req.body;
  const ccList = cc ? cc.split(/[;,]\s*/).filter(Boolean) : undefined;
  const bccList = bcc ? bcc.split(/[;,]\s*/).filter(Boolean) : undefined;

  console.log(`[SEND] To: ${to} | From: ${from} | CC: ${ccList || 'none'} | BCC: ${bccList || 'none'} | Subject: ${subject}`);

  try {
    const info = await transporter.sendMail({
      from,
      to,
      cc: ccList,
      bcc: bccList,
      subject,
      html,
    });
    console.log(`[SEND OK] To: ${to} | MessageId: ${info.messageId}`);
    res.json({ success: true, messageId: info.messageId });
  } catch (error) {
    console.error(`[SEND FAIL] To: ${to} | Error: ${error.message}`);
    res.json({ success: false, error: error.message });
  }
});

// Send batch emails with delay
app.post('/api/send-batch', async (req, res) => {
  if (!transporter) {
    return res.json({ success: false, error: 'SMTP not configured' });
  }

  const { emails, from, subject, cc, bcc, delayMs = 2000 } = req.body;
  const ccList = cc ? cc.split(/[;,]\s*/).filter(Boolean) : undefined;
  const bccList = bcc ? bcc.split(/[;,]\s*/).filter(Boolean) : undefined;
  const results = [];

  console.log(`[BATCH] Sending ${emails.length} emails | From: ${from} | CC: ${ccList || 'none'}`);

  for (let i = 0; i < emails.length; i++) {
    const { to, html } = emails[i];
    console.log(`[BATCH ${i + 1}/${emails.length}] Sending to: ${to}`);
    try {
      const info = await transporter.sendMail({ from, to, cc: ccList, bcc: bccList, subject, html });
      console.log(`[BATCH OK] To: ${to} | MessageId: ${info.messageId}`);
      results.push({ to, success: true, messageId: info.messageId });
    } catch (error) {
      console.error(`[BATCH FAIL] To: ${to} | Error: ${error.message}`);
      results.push({ to, success: false, error: error.message });
    }
    // Delay between emails to avoid rate limiting
    if (i < emails.length - 1) {
      await new Promise(resolve => setTimeout(resolve, delayMs));
    }
  }

  res.json({ success: true, results });
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Email server running on http://localhost:${PORT}`);
});
