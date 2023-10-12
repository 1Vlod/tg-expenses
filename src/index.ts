import bot from './modules/tgBot';
import mongoProvider from './modules/mongo';
import { listeners } from './listeners';

const start = async () => {
  await mongoProvider.connect().then(() => {
    console.log('Connected to MongoDB');
  });

  for (const listener of listeners) {
    if (listener.type === 'text') {
      bot.onText(listener.event, listener.handler);
      continue;
    }
    bot.on(listener.type, listener.handler);
  }

  console.log('Bot is running');
};

process.on('SIGTERM', async () => {
  console.log('SIGTERM received');
  await mongoProvider.disconnect();
  process.exit(0);
});

start();
