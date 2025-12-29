import fs from 'fs';
import OpenAI from 'openai';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const pdfParse = require('pdf-parse');

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

function cosineSimilarity(a, b) {
  const dot = a.reduce((sum, v, i) => sum + v * b[i], 0);
  const magA = Math.sqrt(a.reduce((s, v) => s + v * v, 0));
  const magB = Math.sqrt(b.reduce((s, v) => s + v * v, 0));
  return dot / (magA * magB);
}

export async function ragFromPdf(req, res) {
  const { question } = req.body;

  if (!req.file || !question) {
    return res.status(400).json({
      error: 'PDF file and question are required',
    });
  }

  const buffer = fs.readFileSync(req.file.path);
  const pdf = await pdfParse(buffer);

  const chunks = pdf.text.match(/(.|[\r\n]){1,500}/g);

  if (!chunks || chunks.length === 0) {
    return res.status(400).json({
      error: 'No readable text found in PDF',
    });
  }

  const embeddings = await Promise.all(
    chunks.map((chunk) =>
      client.embeddings.create({
        model: 'text-embedding-3-small',
        input: chunk,
      }),
    ),
  );

  const questionEmbedding = await client.embeddings.create({
    model: 'text-embedding-3-small',
    input: question,
  });

  const scored = embeddings.map((e, i) => ({
    text: chunks[i],
    score: cosineSimilarity(questionEmbedding.data[0].embedding, e.data[0].embedding),
  }));

  scored.sort((a, b) => b.score - a.score);

  const context = scored
    .slice(0, 3)
    .map((s) => s.text)
    .join('\n');

  const answer = await client.responses.create({
    model: 'gpt-4.1-mini',
    input: `Answer based on context:\n${context}\n\nQuestion: ${question}`,
  });

  res.json({
    answer: answer.output_text,
  });
}
