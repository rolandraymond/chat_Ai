import { upload } from '../files/upload.middleware.js';
import { ragFromPdf } from './rag.controller.js';

export function registerRagRoutes(app) {
  app.post('/rag/pdf', upload.single('file'), ragFromPdf);
}
