import express from 'express';
import { google } from 'googleapis';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;

const oauth2Client = new google.auth.OAuth2(
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    REDIRECT_URI
);

const scopes = [
    'https://www.googleapis.com/auth/spreadsheets',
    'https://www.googleapis.com/auth/drive'
];

const authorizationUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes,
    redirect_uri: process.env.REDIRECT_URI // Ensure redirect_uri is explicitly set
});

console.log('Authorize this app by visiting this url:', authorizationUrl);

app.get('/', async (req, res) => {
    const code = req.query.code;
    if (!code) {
        res.redirect(authorizationUrl);
        return;
    }
    try {
        const { tokens } = await oauth2Client.getToken(code);
        oauth2Client.setCredentials(tokens);
        res.send(`Refresh token: ${tokens.refresh_token}`);
        console.log('Tokens:', tokens);
    } catch (error) {
        console.error('Error retrieving tokens:', error);
        res.status(500).send('Error retrieving tokens');
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});