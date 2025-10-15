from flask import Flask, session, redirect, request, render_template
from flask_session import Session
import requests
import base64

app = Flask(__name__)
app.secret_key = 'dev-secret'
app.config['SESSION_TYPE'] = 'filesystem'
Session(app)

CLIENT_ID = 'PYTHON_CLIENT'
CLIENT_SECRET = 'PYTHON_CLIENT_SECRET'
REDIRECT_URI = 'http://localhost:6000/callback'
AUTH_SERVER = 'http://localhost:4000'
AUTH_PAGE = 'http://localhost:5174'

@app.route('/')
def index():
    auth_url = f"{AUTH_PAGE}/authorize?client_id={CLIENT_ID}&redirect_uri={REDIRECT_URI}&response_type=code&scope=openid profile email"
    return render_template('login.html', auth_url=auth_url)

@app.route('/callback')
def callback():
    code = request.args.get('code')
    if not code:
        return 'No code received'
    token_resp = requests.post(
        f"{AUTH_SERVER}/oauth/token",
        data={
            'grant_type': 'authorization_code',
            'code': code,
            'redirect_uri': REDIRECT_URI
        },
        headers={
            'Authorization': 'Basic ' + base64.b64encode(f"{CLIENT_ID}:{CLIENT_SECRET}".encode()).decode()
        }
    )
    session['tokens'] = token_resp.json()
    return redirect('/dashboard')

@app.route('/dashboard')
def dashboard():
    if 'tokens' not in session:
        return redirect('/')
    return render_template('dashboard.html', user=session['tokens'])

@app.route('/logout')
def logout():
    session.clear()
    return redirect('/')

if __name__ == '__main__':
    app.run(port=6000, debug=True)
