import express from 'express';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import KerliixOAuth from 'kerliix-oauth'; // <- Use the SDK

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CLIENT_ID = 'df0a1e8ad5b5a3f6c9ebfa97a234be86';
const CLIENT_SECRET = '987f7a96a9b0c68e69d1685866f929b348bf1fecc39b1b8488ab867eaf6727fb';
const REDIRECT_URI = 'http://localhost:5175/callback';
const AUTH_PAGE = 'http://localhost:5174';
const AUTH_SERVER = 'http://localhost:4000'; // Kerliix OAuth server

const app = express();

// Setup
app.use(cookieParser());
app.use(session({ secret: 'dev-secret', resave: false, saveUninitialized: true }));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Initialize KerliixOAuth SDK
const oauthClient = new KerliixOAuth({
  clientId: CLIENT_ID,
  clientSecret: CLIENT_SECRET,
  redirectUri: REDIRECT_URI,
  baseUrl: AUTH_SERVER
});

// Landing page
app.get('/', (req, res) => {
  const authUrl = oauthClient.getAuthUrl(['openid', 'profile', 'email']);
  res.render('login', { authUrl });
});

// OAuth2 callback
app.get('/callback', async (req, res) => {
  const { code } = req.query;
  if (!code) return res.send('No code provided');

  try {
    // Use SDK to exchange code for tokens (caching handled internally)
    const tokens = await oauthClient.exchangeCodeForToken(code);
    req.session.tokens = tokens;

    // Optional: fetch user info directly using SDK
    const user = await oauthClient.getUserInfo(tokens.access_token);
    req.session.user = user;

    res.redirect('/dashboard');
  } catch (err) {
    console.error(err.message);
    res.send('Error exchanging code or fetching user info');
  }
});

// Dashboard
app.get('/dashboard', (req, res) => {
  if (!req.session.tokens) return res.redirect('/');
  res.render('dashboard', { user: req.session.user });
});

// Logout
app.get('/logout', (req, res) => {
  req.session.destroy(() => res.redirect('/'));
});

// Start
app.listen(5175, () => console.log('NodeJS client running on http://localhost:5175'));
