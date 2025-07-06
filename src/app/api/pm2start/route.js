import { exec } from 'child_process';

export async function POST(request) {
  return new Promise((resolve) => {
    exec('pm2 start jobs/forwarder.js --name telegram-forwarder', (error, stdout, stderr) => {
      if (error) {
        console.error(`Error start pm2: ${error.message}`);
        resolve(new Response(JSON.stringify({ status: 'error', error: error.message }), { status: 500 }));
        return;
      }
      resolve(new Response(JSON.stringify({ status: 'success', output: stdout }), { status: 200 }));
    });
  });
}
