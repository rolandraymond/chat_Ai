import { upload } from './upload.middleware.js';
import { readPdf } from './files.controller.js';

export function registerFileRoutes(app) {
  app.post('/files/pdf', upload.single('file'), readPdf);
}
