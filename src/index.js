import 'dotenv/config';
import express from 'express';
import { registerChatRoutes } from './chat/chat.routes.js';
import { registerVisionRoutes } from './vision/vision.routes.js';
import { registerRagRoutes } from './rag/rag.routes.js';
import { registerReminderRoutes } from './agents/reminder.routes.js';
import { registerFileRoutes } from './files/files.routes.js';

const app = express();
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});
registerRagRoutes(app);

registerChatRoutes(app);
registerChatRoutes(app);
registerVisionRoutes(app);
registerFileRoutes(app);


registerChatRoutes(app);
registerVisionRoutes(app);
registerFileRoutes(app);
registerRagRoutes(app);
registerReminderRoutes(app);

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
