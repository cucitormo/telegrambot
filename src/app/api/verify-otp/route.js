import { NextResponse } from 'next/server';
import { TelegramClient } from 'telegram';
import { StringSession } from 'telegram/sessions';
import * as Telegram from 'telegram';
import 'dotenv/config';

const { Api } = Telegram;
const apiId = parseInt(process.env.API_ID);
const apiHash = process.env.API_HASH;

export async function POST(req) {
  const { phone, code, codeHash, session } = await req.json();

  const stringSession = new StringSession(session);
  const client = new TelegramClient(stringSession, apiId, apiHash, {
    connectionRetries: 5,
  });

  try {
    await client.connect();

    const result = await client.invoke(
      new Api.auth.SignIn({
        phoneNumber: phone,
        phoneCodeHash: codeHash,
        phoneCode: code,
      })
    );

    // 💾 Simpan session setelah login berhasil
    const newSession = client.session.save();

    return NextResponse.json({
      status: 'success',
      data: {
        session: newSession,
        user: result?.user,
      },
      error: null,
    });

  } catch (err) {
    // 🛡️ Jika butuh password (2FA)
    if (err.message.includes('SESSION_PASSWORD_NEEDED')) {
      const fallbackSession = client.session.save();
      return NextResponse.json({
        status: 'need_password',
        data: {
          session: fallbackSession,
        },
        error: null,
      });
    }

    console.error('❌ OTP Verify Error:', err);
    return NextResponse.json({
      status: 'error',
      data: null,
      error: err.message,
    });
  } finally {
    await client.disconnect();
  }
}
