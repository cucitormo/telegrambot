const TelegramBot = require('node-telegram-bot-api');
const { BOT_TOKEN, GROUP_ID } = require('../config/env');

const bot = new TelegramBot(BOT_TOKEN, { polling: false });

const forwardToGroup = (msg) => {
  bot.forwardMessage(GROUP_ID, msg.chat.id, msg.message_id);
};

module.exports = { forwardToGroup };