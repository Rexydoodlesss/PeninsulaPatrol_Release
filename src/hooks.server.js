import dotenv from 'dotenv';
dotenv.config();
import { redirect } from '@sveltejs/kit';

export async function handle({ event, resolve }) {
    const { cookies, url } = event;
    const pwd = process.env.PASSWORD;
    const password = cookies.get('password');
    if (password == "hijack")
        {
            throw redirect(302, 'https://www.youtube.com/watch?v=xvFZjo5PgG0');
        }
    if (url.pathname !== '/' && (password != pwd)) {
        console.log('Redirecting to homepage');
        throw redirect(302, '/');
    }

    return await resolve(event);
}