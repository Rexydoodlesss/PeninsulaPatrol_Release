import dotenv from 'dotenv';
dotenv.config();

export async function GET() {
  return new Response(JSON.stringify({
    PASSWORD: process.env.PASSWORD
  }), {
    headers: {
      'Content-Type': 'application/json'
    }
  });
}