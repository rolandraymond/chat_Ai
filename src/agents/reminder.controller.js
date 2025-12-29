import OpenAI from 'openai';
import cron from 'node-cron';
import nodemailer from 'nodemailer';

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// in-memory storage (كفاية للّاب)
const reminders = [];

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

function sendEmail(task) {
  return transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_USER,
    subject: 'AI Reminder',
    text: `Reminder: ${task}`,
  });
}

export async function createReminder(req, res) {
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({
      error: 'text is required',
    });
  }

  // نخلّي الموديل يرجّع JSON واضح
  const extraction = await client.responses.create({
    model: 'gpt-4.1-mini',
    input: `Extract task and datetime from this reminder.
Return JSON only.

Text: "${text}"

Format:
{
  "task": "...",
  "datetime": "YYYY-MM-DD HH:mm"
}`,
  });

  let data;
  try {
    data = JSON.parse(extraction.output_text);
  } catch {
    return res.status(400).json({
      error: 'Failed to parse reminder',
    });
  }

  reminders.push(data);

  // جدولة التنفيذ
  const [date, time] = data.datetime.split(' ');
  const [year, month, day] = date.split('-');
  const [hour, minute] = time.split(':');

  const cronExp = `${minute} ${hour} ${day} ${month} *`;

  cron.schedule(cronExp, async () => {
    await sendEmail(data.task);
  });

  res.json({
    message: 'Reminder scheduled',
    reminder: data,
  });
}
