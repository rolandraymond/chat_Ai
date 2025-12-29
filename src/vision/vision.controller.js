import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function analyzeImage(req, res) {
  const { imageBase64, question } = req.body;

  if (!imageBase64 || !question) {
    return res.status(400).json({
      error: 'imageBase64 and question are required',
    });
  }

  const response = await client.responses.create({
    model: 'gpt-4.1-mini',
    input: [
      {
        role: 'user',
        content: [
          { type: 'input_text', text: question },
          {
            type: 'input_image',
            image_url: `data:image/png;base64,${imageBase64}`,
          },
        ],
      },
    ],
  });

  res.json({
    result: response.output_text,
  });
}
