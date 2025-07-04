const TelegramBot = require('node-telegram-bot-api');
const { BOT_TOKEN } = require('../config/env');
const { forwardMessage } = require('../controllers/forward.controller');

const bot = new TelegramBot(BOT_TOKEN, { polling: true });

bot.on('message', forwardMessage);

module.exports = bot;