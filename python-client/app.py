from flask import Flask, session, redirect, request, render_template
from flask_session import Session
from kerliix_oauth import KerliixOAuth  # ← ✅ use the SDK

app = Flask(__name__)
app.secret_key = 'dev-secret'
app.config['SESSION_TYPE'] = 'filesystem'
Session(app)

# Kerliix OAuth configuration
CLIENT_ID = 'df0a1e8ad5b5a3f6c9ebfa97a234be86'
CLIENT_SECRET = '987f7a96a9b0c68e69d1685866f929b348bf1fecc39b1b8488ab867eaf6727fb'
REDIRECT_URI = 'http://localhost:5174/callback'
BASE_URL = 'http://localhost:4000'  # OAuth backend
AUTH_PAGE = 'http://localhost:5174'  # Frontend/authorize page

# Initialize SDK client
oauth_client = KerliixOAuth(
    client_id=CLIENT_ID,
    client_secret=CLIENT_SECRET,
    redirect_uri=REDIRECT_URI,
    base_url=BASE_URL
)

@app.route('/')
def index():
    """Landing page: generates the authorization URL using the SDK"""
    auth_url = oauth_client.get_auth_url(
        scopes=['openid', 'profile', 'email'],
        state='secure-random-state'
    )
    return render_template('login.html', auth_url=auth_url)

@app.route('/callback')
def callback():
    """OAuth2 redirect URI: exchange authorization code for tokens"""
    code = request.args.get('code')
    if not code:
        return 'No authorization code provided', 400

    try:
        token_data = oauth_client.exchange_code_for_token(code)
        session['tokens'] = token_data
        return redirect('/dashboard')
    except Exception as e:
        return f'Error during token exchange: {e}', 500

@app.route('/dashboard')
def dashboard():
    """Protected page showing user tokens"""
    if 'tokens' not in session:
        return redirect('/')

    try:
        # Automatically refresh token if needed
        refreshed_tokens = oauth_client.refresh_token_if_needed(session['tokens'])
        session['tokens'] = refreshed_tokens
        user_info = oauth_client.get_user_info(refreshed_tokens['access_token'])
        return render_template('dashboard.html', user=user_info)
    except Exception as e:
        return f'Error fetching user info: {e}', 500

@app.route('/logout')
def logout():
    """Clear session"""
    session.clear()
    return redirect('/')

if __name__ == '__main__':
    app.run(port=6000, debug=True)
