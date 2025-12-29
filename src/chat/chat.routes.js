import { chat } from './chat.controller.js';

export function registerChatRoutes(app) {
  app.post('/chat', chat);
}
