const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  BOT_TOKEN: process.env.BOT_TOKEN,
  CHANNEL_ID: process.env.CHANNEL_ID,
  GROUP_ID: process.env.GROUP_ID,
};