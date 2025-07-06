const { TelegramClient } = require('telegram');
const { StringSession } = require('telegram/sessions');
const { Api } = require('telegram');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

async function loadConfig() {
  const filePath = path.join(process.cwd(), 'forward-config.json');
  if (!fs.existsSync(filePath)) throw new Error('Config forwarder belum disetup, sayang!');
  const raw = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(raw);
}

function appendLog(message) {
  const logPath = path.join(process.cwd(), 'forwarder.log');
  const timestamp = new Date().toISOString();
  fs.appendFileSync(logPath, `[${timestamp}] ${message}\n`);
}

async function runForwarder() {
  try {
    const config = await loadConfig();

    const client = new TelegramClient(
      new StringSession(config.session),
      parseInt(process.env.API_ID),
      process.env.API_HASH,
      { connectionRetries: 5 }
    );

    await client.start();
    console.log('✨ Forwarder sudah aktif, siap kirim pesan baru nih sayang~');

    client.addEventHandler(async (update) => {
      if (update.className !== 'UpdateNewChannelMessage') return;

      const message = update.message;
      if (!message) return;
      if (!message.peerId || !message.peerId.channelId) return;

      const fromChannelId = message.peerId.channelId.toString();
      const fromTopicId = message.threadId || null;

      if (!config.enabled) {
        console.log('⏸️ Forwarder sedang dimatikan, skip message...');
        return;
      }

      const cleanFromGroup = config.fromGroup.toString().startsWith('-100')
        ? config.fromGroup.toString().slice(4)
        : config.fromGroup.toString();

      if (fromChannelId === cleanFromGroup) {
        // if (config.fromTopic && config.fromTopic !== fromTopicId) return;

        try {
          await client.sendMessage(config.toGroup, {
            message: message.message || '<media or no text>',
            ...(config.toTopic ? { topicId: config.toTopic } : {}),
          });

          const text = message.message || '<media or no text>';
          const logMsg = `➡️ Sent new message to ${config.toGroup} ${config.toTopic ? `(topic ${config.toTopic})` : ''}\nText: ${text}`;
          console.log(logMsg);
          appendLog(logMsg);
        } catch (e) {
          const errorMsg = `❌ Failed to send message: ${e.message}`;
          console.error(errorMsg);
          appendLog(errorMsg);
        }
      }
    });
  } catch (err) {
    console.error('Forwarder error:', err);
  }
}

runForwarder();
