export default {
  botToken: process.env.BOT_TOKEN as string, //TODO: add get-env package, if amount of variables grows
  mongoUri: process.env.MONGO_URI as string,
};
