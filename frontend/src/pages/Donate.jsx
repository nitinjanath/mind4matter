import React, { useEffect, useState } from 'react';
import DonateSection from '../components/DonateSection';

export default function Donate() {
  const [donations, setDonations] = useState([]);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loadingUser, setLoadingUser] = useState(false);

  // Fetch user info on page load or when token changes
  useEffect(() => {
    if (!token) {
      setUser(null);
      localStorage.removeItem('user');
      return;
    }

    setLoadingUser(true);
    fetch('http://localhost:8000/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch user info');
        return res.json();
      })
      .then((data) => {
        setUser(data);
        localStorage.setItem('user', JSON.stringify(data));
      })
      .catch((err) => {
        console.error(err);
        setUser(null);
        setToken(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      })
      .finally(() => setLoadingUser(false));
  }, [token]);

  // Fetch donations whenever token changes (user logs in/out)
  useEffect(() => {
    if (!token) {
      setDonations([]);
      return;
    }

    fetch('http://localhost:8000/donations', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setDonations(data))
      .catch((err) => console.error('Failed to fetch donation history', err));
  }, [token]);

  // Login handler
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('http://localhost:8000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) throw new Error('Login failed');

      const data = await res.json();
      localStorage.setItem('token', data.access_token);
      setToken(data.access_token);
      setEmail('');
      setPassword('');
    } catch (err) {
      alert(err.message);
    }
  };

  // Logout handler
  const handleLogout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4 text-[#001F54]">
      <h1 style={{ color: '#001F54' }}>
        <br />
        <br />
        <br />
        Support Our Cause
      </h1>

      <p className="text-center max-w-xl text-[#311151] mb-8">
        Your donations help us provide vital mental health resources and support to families in
        need.
      </p>

      {/* Leaderboard section */}
      <div style={{ width: '100%', maxWidth: '500px', marginBottom: '2rem' }}>
        <h2
          style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '0.5rem', color: '#111827' }}
        >
          Top Donations
        </h2>
        <ul
          style={{
            backgroundColor: '#f3f4f6',
            padding: '1rem',
            borderRadius: '8px',
            listStyle: 'none',
          }}
        >
          {donations.length > 0 ? (
            donations.map((donation, idx) => (
              <li key={idx} style={{ marginBottom: '0.5rem' }}>
                <strong>${donation.amount}</strong>{' '}
                <span style={{ color: '#6b7280' }}>
                  on {new Date(donation.timestamp).toLocaleDateString()}
                </span>
              </li>
            ))
          ) : (
            <li>No donations yet.</li>
          )}
        </ul>
      </div>

      {loadingUser ? (
        <p>Loading user info...</p>
      ) : token && user ? (
        <div className="mb-8 flex flex-col items-center gap-4">
          <h3 className="text-lg font-medium text-green-700 mb-4">
            Thank you, {user.full_name || user.email}! You can donate below:
          </h3>
          <DonateSection />
          <button
            onClick={handleLogout}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      ) : (
        // Login form
        <>
          <h3 className="text-lg font-medium text-gray-700 mb-4 text-center">Sign in to donate</h3>
          <div className="w-[400px] min-h-[230px] bg-white p-10 rounded-[10px] shadow-lg border border-gray-200">
            <form className="space-y-6 flex flex-col items-center" onSubmit={handleLogin}>
              <div className="w-full">
                <div className="w-2/3 mx-auto">
                  <label htmlFor="email" className="text-left font-medium mb-1 block">
                    <br />
                    Email address
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="w-full h-[24px] px-4 py-2 bg-white text-[#000000] border border-gray-300 rounded-[5px] shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="w-full">
                <div className="w-2/3 mx-auto">
                  <label htmlFor="password" className="text-left font-medium mb-1 block">
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    className="w-full h-[24px] px-4 py-2 bg-white text-[#000000] border border-gray-300 rounded-[5px] shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <br />
              <button
                type="submit"
                className="w-2/3 h-12 bg-blue-700 hover:bg-blue-800 text-white text-sm font-semibold rounded-lg transition"
              >
                Sign in
              </button>
            </form>
          </div>
        </>
      )}
    </div>
  );
}
