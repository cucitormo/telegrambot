import { NextResponse } from 'next/server';
import { TelegramClient } from 'telegram';
import { StringSession } from 'telegram/sessions';
import { signInWithPassword } from 'telegram/client/auth';
import 'dotenv/config';

const apiId = parseInt(process.env.API_ID);
const apiHash = process.env.API_HASH;

export async function POST(req) {
    
    const { session, password } = await req.json();
    const stringSession = new StringSession(session);
    const client = new TelegramClient(stringSession, apiId, apiHash, {
      connectionRetries: 5,
    });
  try {


    await client.connect();

    const user = await signInWithPassword(client, { apiId, apiHash }, {
      password: async (hint) => {
        // Kamu bisa kirim hint ke FE kalau perlu,
        // tapi sekarang langsung return password dari request aja ya
        return password;
      },
      onError: async (err) => {
        console.error('❌ Password check error:', err);
        // Return true kalau mau cancel login, false buat retry
        return true;
      },
    });

    const updatedSession = client.session.save();

    return NextResponse.json({
      status: 'success',
      data: {
        session: updatedSession,
        user,
      },
      error: null,
    });
  } catch (err) {
    console.error('❌ signInWithPassword error:', err);
    return NextResponse.json({
      status: 'error',
      data: null,
      error: err.message || 'Failed to verify password',
    });
  } finally {
    await client.disconnect();
  }
}
