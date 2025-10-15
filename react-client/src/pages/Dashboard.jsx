import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function Dashboard() {
  const [userinfo, setUserinfo] = useState(null);

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await axios.get('http://localhost:4000/oauth/userinfo', { withCredentials: true });
        setUserinfo(res.data);
      } catch (err) {
        console.error(err);
      }
    }
    fetchUser();
  }, []);

  return (
    <div>
      <h1>Dashboard</h1>
      <pre>{JSON.stringify(userinfo, null, 2)}</pre>
      <a href="/">Logout</a>
    </div>
  );
}
