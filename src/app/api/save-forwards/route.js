import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request) {
    try {
        const { fromGroup, toGroup, fromTopic, toTopic, session,enabled } = await request.json();

        if (!fromGroup || !toGroup || !session) {
            return NextResponse.json({
                status: 'error',
                data: null,
                error: '❌ Ihh ada yang kurang lengkap nih, cek lagi dong sayang~',
            }, { status: 400 });
        }

        const forwardConfig = {
            fromGroup, toGroup, fromTopic, toTopic, session,
            enabled: typeof enabled === 'boolean' ? enabled : true
        };

        const filePath = path.join(process.cwd(), 'forward-config.json');
        fs.writeFileSync(filePath, JSON.stringify(forwardConfig, null, 2));

        return NextResponse.json({
            status: 'success',
            data: forwardConfig,
            error: null,
        });
    } catch (err) {
        return NextResponse.json({
            status: 'error',
            data: null,
            error: `❌ Duhh gagal nyimpen nih, coba lagi ya: ${err.message}`,
        }, { status: 500 });
    }
}
