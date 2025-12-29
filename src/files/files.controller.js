import { createRequire } from 'module';
import fs from 'fs';

const require = createRequire(import.meta.url);
const pdfParse = require('pdf-parse');

export async function readPdf(req, res) {
  if (!req.file) {
    return res.status(400).json({
      error: 'PDF file is required',
    });
  }

  const buffer = fs.readFileSync(req.file.path);
  const data = await pdfParse(buffer);

  res.json({
    textPreview: data.text.slice(0, 500),
  });
}
