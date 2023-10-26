import bot from './modules/tgBot';
import mongoProvider from './modules/mongo';
import { listeners, messageListener, callbackQueryListener } from './listeners';

const start = async () => {
  await mongoProvider.connect().then(() => {
    console.log('Connected to MongoDB');
  });
  bot.addListeners({ listeners, callbackQueryListener, messageListener });

  console.log('Bot is running');
};

process.on('SIGTERM', async () => {
  console.log('SIGTERM received');
  await bot.destroy();
  await mongoProvider.disconnect();
  process.exit(0);
});

start();
