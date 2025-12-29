import { createReminder } from './reminder.controller.js';

export function registerReminderRoutes(app) {
  app.post('/agent/reminder', createReminder);
}
