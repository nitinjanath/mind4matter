import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const [donations, setDonations] = useState([]);
  const [userInfo, setUserInfo] = useState({ email: '', full_name: '' });
  const [welcomeMessage, setWelcomeMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    // ✅ Fetch user info
    fetch('http://localhost:8000/me', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => {
        if (!res.ok) throw new Error('Unauthorized');
        return res.json();
      })
      .then(data => {
        setUserInfo({ email: data.email, full_name: data.full_name });
        setWelcomeMessage(`Welcome, ${data.full_name}`);
      })
      .catch(err => {
        console.error('User fetch error:', err);
        navigate('/login');
      });

    // ✅ Fetch donations
    fetch('http://localhost:8000/donations', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async res => {
        if (!res.ok) {
          const error = await res.json().catch(() => ({}));
          const detail = error.detail || `Status ${res.status}`;
          throw new Error(detail);
        }
        return res.json();
      })
      .then(data => setDonations(data))
      .catch(err => {
        console.error('Donations fetch error:', err);
        alert(`Failed to fetch donation history. ${err.message}`);
        navigate('/login');
      });
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="pt-[120px] px-6 max-w-4xl mx-auto flex flex-col items-center text-center">
      <h1 className="text-3xl font-bold mb-4 text-[#001F54]">
        <br />
        <br />
        {welcomeMessage || `Welcome, ${userInfo.full_name}`}
      </h1>

      <h2 className="text-xl font-semibold text-gray-800 mb-3">Donation History</h2>

      {donations.length > 0 ? (
        <ul className="list-disc list-inside text-gray-700 mb-6">
          {donations.map((donation, index) => (
            <li key={index}>
              ${donation.amount} on{' '}
              {donation.timestamp
                ? new Date(donation.timestamp).toLocaleDateString()
                : 'Unknown date'}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-600 mb-6">No donations found.</p>
      )}

      <button
        onClick={handleLogout}
        className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded"
      >
        Logout
      </button>
    </div>
  );
}
