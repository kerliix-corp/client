import express from 'express';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import axios from 'axios';
import qs from 'qs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CLIENT_ID = 'df0a1e8ad5b5a3f6c9ebfa97a234be86';
const CLIENT_SECRET = '987f7a96a9b0c68e69d1685866f929b348bf1fecc39b1b8488ab867eaf6727fb';
const REDIRECT_URI = 'http://localhost:5175/callback';
const AUTH_SERVER = 'http://localhost:4000';
const AUTH_PAGE = 'http://localhost:5174';

const app = express();

// Setup
app.use(cookieParser());
app.use(session({ secret: 'dev-secret', resave: false, saveUninitialized: true }));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Landing page
app.get('/', (req, res) => {
  res.render('login', { authUrl: `${AUTH_PAGE}/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=openid profile email` });
});

// OAuth2 callback
app.get('/callback', async (req, res) => {
  const { code } = req.query;
  if (!code) return res.send('No code provided');

  try {
    const tokenResp = await axios.post(
      `${AUTH_SERVER}/oauth/token`,
      qs.stringify({ grant_type: 'authorization_code', code, redirect_uri: REDIRECT_URI }),
      { headers: { Authorization: 'Basic ' + Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64') } }
    );

    req.session.tokens = tokenResp.data;
    res.redirect('/dashboard');
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.send('Error exchanging code');
  }
});

// Dashboard
app.get('/dashboard', (req, res) => {
  if (!req.session.tokens) return res.redirect('/');
  res.render('dashboard', { user: req.session.tokens });
});

// Logout
app.get('/logout', (req, res) => {
  req.session.destroy(() => res.redirect('/'));
});

// Start
app.listen(5175, () => console.log('NodeJS client running on http://localhost:5175'));
