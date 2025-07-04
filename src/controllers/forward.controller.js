const TelegramService = require('../services/telegram.service');

const forwardMessage = (msg) => {
  if (msg.chat.id.toString() === process.env.CHANNEL_ID) {
    TelegramService.forwardToGroup(msg);
  }
};

module.exports = { forwardMessage };