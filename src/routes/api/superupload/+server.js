import { google } from 'googleapis';
import { SPREADSHEET_ID, GOOGLE_PRIVATE_KEY, GOOGLE_CLIENT_EMAIL } from '$env/static/private';

const auth = new google.auth.GoogleAuth({
    credentials: {
        private_key: GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        client_email: GOOGLE_CLIENT_EMAIL,
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const sheets = google.sheets({ version: 'v4', auth });

export async function POST({ request }) {
    try {
        const { username, matchKey, teamKey, defended, defenseQuality, climbTime, penalties, superScoutingNotes } = await request.json();

        const data = [
            username, 
            matchKey, 
            teamKey, 
            defended, 
            defenseQuality, 
            climbTime, 
            penalties, 
            superScoutingNotes 
        ];

        const range = 'Superscouting!A2';
        const response = await sheets.spreadsheets.values.append({
            spreadsheetId: SPREADSHEET_ID,
            range,
            valueInputOption: 'RAW',
            insertDataOption: 'INSERT_ROWS',
            resource: {
                values: [data],
            },
        });

        return new Response(JSON.stringify({ message: 'Data submitted successfully' }), { status: 200 });
    } catch (error) {
        console.error('Error submitting data:', error);
        return new Response(JSON.stringify({ error: 'Error submitting data' }), { status: 500 });
    }
}