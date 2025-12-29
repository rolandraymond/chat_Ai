import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function chat(req, res) {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({
      error: 'message is required',
    });
  }

  const response = await client.responses.create({
    model: 'gpt-4.1-mini',
    input: message,
  });

  res.json({
    reply: response.output_text,
  });
}
