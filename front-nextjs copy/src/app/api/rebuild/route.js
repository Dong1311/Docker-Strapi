import { NextResponse } from 'next/server';
import { exec } from 'child_process';

export async function POST(req) {
  try {
    const body = await req.json();
    console.log("Webhook received from Strapi:", body);
    console.log("Building..........")
    // Chạy lệnh build lại khi có webhook từ Strapi
    exec('npm run build', (error, stdout, stderr) => {
      if (error) {
        console.error(`Build error: ${error.message}`);
        return NextResponse.json({ message: 'Build failed' }, { status: 500 });
      }

      if (stderr) {
        console.error(`stderr: ${stderr}`);
      }

      console.log(`stdout: ${stdout}`);
    });

    return NextResponse.json({ message: 'Build triggered successfully' });
  } catch (error) {
    console.error("Failed to process webhook:", error);
    return NextResponse.json({ message: 'Webhook processing failed' }, { status: 500 });
  }
}
