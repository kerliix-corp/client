import React from 'react';

const CLIENT_ID = 'REACT_CLIENT';
const REDIRECT_URI = 'http://localhost:5174/dashboard';
const AUTH_URL = 'http://localhost:5174/authorize'; // Your provider login page

export default function Login() {
  const loginUrl = `${AUTH_URL}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=openid profile email`;

  return (
    <div>
      <h1>React Client Login</h1>
      <a href={loginUrl}>Login with Kerliix</a>
    </div>
  );
}
