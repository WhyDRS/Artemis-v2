// @ts-check is better
const { config } = require('seyfert');

module.exports = config.bot({
   token: process.env.BOT_TOKEN ?? "",
   intents: ["Guilds"],
   locations: {
       base: "bot",
       output: "bot"
   }
});