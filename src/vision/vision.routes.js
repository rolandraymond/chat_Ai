import { analyzeImage } from './vision.controller.js';

export function registerVisionRoutes(app) {
  app.post('/vision', analyzeImage);
}
