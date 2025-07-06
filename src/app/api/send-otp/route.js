import { NextResponse } from 'next/server';
import { TelegramClient, Api } from 'telegram';
import { StringSession } from 'telegram/sessions';
import fs from 'fs/promises';
import 'dotenv/config';

const apiId = parseInt(process.env.API_ID);
const apiHash = process.env.API_HASH;
const stringSession = new StringSession('');


export async function POST(req) {
  try {
    const { phone } = await req.json();

    if (!phone) {
      return NextResponse.json({
        status: 'error',
        data: null,
        error: 'Phone number is required'
      }, { status: 400 });
    }

    const client = new TelegramClient(stringSession, apiId, apiHash, {
      connectionRetries: 5,
    });

    await client.connect();

    const result = await client.invoke(
      new Api.auth.SendCode({
        phoneNumber: phone,
        apiId,
        apiHash,
        settings: new Api.CodeSettings({}),
      })
    );

    const session = client.session.save(); // 🆕 ambil session sebelum disconnect

    await client.disconnect();

    return NextResponse.json({
      status: 'success',
      data: {
        message: 'OTP sent!',
        phoneCodeHash: result.phoneCodeHash, // kirim hash-nya langsung ke frontend 💌 
        session,                              // 🆕 kirim ke frontend
      },
      error: null,
    });
  } catch (err) {
    console.error('❌ Error sending OTP:', err);
    return NextResponse.json({
      status: 'error',
      data: null,
      error: err.message || 'Failed to send OTP'
    }, { status: 500 });
  }
}
