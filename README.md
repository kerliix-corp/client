# Multi-Client OAuth2/OIDC Demo Repository

This repository contains multiple sample clients demonstrating **Kerliix OAuth2 / OIDC provider** integration across different languages and frameworks. The clients showcase Authorization Code Flow, PKCE (where applicable), and token usage.

---

## Clients

### 1. Node.js Backend (Express)

* Directory: `nodejs-client/`
* Full server-side implementation
* Pages:

  * Landing Page
  * Login Page
  * Dashboard
  * Logout
* Uses Authorization Code Flow
* Exchange code for access token + ID token

**Run:**

```bash
cd nodejs-client
npm install
npm run dev
```

---

### 2. React Frontend (Vite)

* Directory: `react-client/`
* SPA example without a backend
* Demonstrates PKCE Authorization Code Flow
* Pages:

  * Home
  * Login
  * Dashboard
  * Logout

**Run:**

```bash
cd react-client
npm install
npm run dev
```

---

### 3. Python Backend (Flask)

* Directory: `python-client/`
* Simple server-side OAuth2 integration
* Pages:

  * Login
  * Dashboard
  * Logout
* Exchanges code for access + ID token

**Run:**

```bash
cd python-client
pip install -r requirements.txt
python app.py
```

---

### 4. HTML / Vanilla JS

* Directory: `html-client/`
* Frontend-only demonstration
* Pages:

  * Login
  * Dashboard
* Shows code received in URL; no backend

---

### 5. Additional Clients (Optional)

* PHP (Laravel)
* Java (Spring Boot)
* .NET Core
* Ruby (Rails)

> These can be added under respective folders.

---

## Environment Variables

Create `.env` files in each client if needed, for example:

```env
CLIENT_ID=...
CLIENT_SECRET=...
REDIRECT_URI=...
AUTH_SERVER=http://localhost:4000
AUTHORIZE_URL=http://localhost:5174
```

---

## Notes

* Frontend-only clients **cannot securely store client secrets**.
* Always use HTTPS in production.
* Tokens issued by the Kerliix server are signed with **RS256** and include `kid` headers.
* JWKS endpoint: `http://localhost:4000/oauth/.well-known/jwks.json`

---

## License

MIT
