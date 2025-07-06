import { TelegramClient } from 'telegram';
import { StringSession } from 'telegram/sessions';
import { Api } from 'telegram';
import fs from 'fs';

export async function POST(request) {
  try {
    const { session } = await request.json();

    const client = new TelegramClient(
      new StringSession(session),
      parseInt(process.env.API_ID),
      process.env.API_HASH,
      { connectionRetries: 5 }
    );

    await client.connect();

    const dialogs = await client.getDialogs({});

    const channels = [];

    for (const dialog of dialogs) {
      if (dialog.isChannel || dialog.isGroup) {
        let topics = [];

        // Cek forum (topics support)
        // console.log(dialog.entity.forum)
        if (dialog.entity.forum) {
          try {
            // Ambil forum topics
            const fullChannel = await client.getEntity(dialog.id);

            const forumTopics = await client.invoke(
              new Api.channels.GetForumTopics({
                channel: fullChannel,
              })
            );

            topics = forumTopics.topics.map(topic => ({
              id: topic.id.toString(),
              title: topic.title,
            }));

            console.log("ini topics",topics)
          } catch (err) {

            // Kalau gagal ambil topics, ignore aja
            topics = [];
          }
        }

        channels.push({
          id: dialog.id.toString(),
          title: dialog.title,
          topics,
        });
      }
    }

    await client.disconnect();

    return new Response(
      JSON.stringify({ status: 'success', data: channels, error: null }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ status: 'error', data: null, error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
