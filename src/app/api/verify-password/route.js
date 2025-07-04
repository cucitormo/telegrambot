import { NextResponse } from 'next/server';

import * as Telegram from 'telegram';

const { Api, TelegramClient } = Telegram;
import { StringSession } from 'telegram/sessions'
import 'dotenv/config'
import { computeCheck } from 'telegram/Password';

const apiId = parseInt(process.env.API_ID)
const apiHash = process.env.API_HASH
export async function POST(req) {
    try {

        const { session, password } = await req.json()

        if (!session || !password) {
            return NextResponse.json({
                status: 'error',
                data: null,
                error: 'Missing session or password',
            }, { status: 400 })
        }

        const stringSession = new StringSession(session)
        const client = new TelegramClient(stringSession, apiId, apiHash, {
            connectionRetries: 5,
        })

        await client.connect();

        // Ambil data password 2FA dengan benar 💋
        const pwd = await client.invoke(new Api.account.GetPassword());

        // Pastikan pwd itu hasil dari: await client.invoke(new Api.account.GetPassword())
        if (!pwd.currentAlgo || !pwd.srpId || !pwd.srp_B) {
            throw new Error("Missing SRP parameters from Telegram 😵‍💫");
        }

        // Bungkus currentAlgo jadi class instance
        const algo = new Api.PasswordKdfAlgoSHA256SHA256PBKDF2HMACSHA512iter100000SHA256ModPow({
            salt1: pwd.currentAlgo.salt1,
            salt2: pwd.currentAlgo.salt2,
            g: pwd.currentAlgo.g,
            p: pwd.currentAlgo.p,
        });

        // Hitung hasil SRP check passwordnya 💻🔐
        const check = await computeCheck({
            algorithm: algo,
            password: password, // ini dari input user ya sayang 😘
            srp_id: pwd.srpId.value, // harus pakai .value karena ini tipe Integer
            srp_B: pwd.srp_B,
        });

        // Kirim ke Telegram buat validasi
        const result = await client.call('auth.checkPassword', {
            password: check,
        });

        return NextResponse.json({ status: 'ok', data: result });

    } catch (error) {
        console.error('❌ Password Verify Error:', error);
        return NextResponse.json({ status: 'error', data: null, error: error.message });
    }
}
