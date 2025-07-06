import { exec } from 'child_process';

export async function POST(req) {
  return new Promise((resolve) => {
    exec('pm2 stop telegram-forwarder', (error, stdout, stderr) => {
      if (error) {
        console.error('PM2 stop error:', error);
        resolve(
          new Response(
            JSON.stringify({ status: 'error', error: error.message }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
          )
        );
        return;
      }
      resolve(
        new Response(
          JSON.stringify({ status: 'success', output: stdout }),
          { status: 200, headers: { 'Content-Type': 'application/json' } }
        )
      );
    });
  });
}
