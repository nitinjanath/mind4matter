import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { GoogleLogin } from '@react-oauth/google';
import { useEffect } from 'react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  // 🔥 Redirect if user is already logged in
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/dashboard');
    }
  }, []);
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:8000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        handleTokenLogin(data.access_token);
      } else {
        alert(data.detail || 'Login failed');
      }
    } catch (err) {
      console.error('Login error:', err);
      alert('An error occurred during login.');
    }
  };

  // const handleGoogleSuccess = async (credentialResponse) => {
  //   try {
  //     const response = await fetch('http://localhost:8000/api/auth/google', {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify({ token: credentialResponse.credential }),
  //     });

  //     const data = await response.json();

  //     if (response.ok) {
  //       handleTokenLogin(data.access_token);
  //     } else {
  //       alert(data.detail || 'Google login failed');
  //     }
  //   } catch (error) {
  //     console.error('Google login error:', error);
  //     alert('An error occurred during Google login.');
  //   }
  // };

  const handleTokenLogin = (token) => {
    
    if (!token) {
      alert('Login succeeded, but no token was returned.');
      return;
    }

    localStorage.setItem('token', token);

    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      const decoded = JSON.parse(jsonPayload);
      localStorage.setItem('user', JSON.stringify({ email: decoded.sub }));
    } catch (err) {
      console.error('JWT decoding failed:', err);
      alert('Login succeeded, but user decoding failed.');
    }

    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4 text-[#001F54]">
      <h1 style={{ color: '#001F54' }} className="text-2xl font-bold mb-4 mt-4 text-center">
        Sign in to your Account
      </h1>

      <div className="w-[400px] min-h-[230px] bg-white p-10 rounded-[10px] shadow-lg border border-gray-200">
        <form className="space-y-6 flex flex-col items-center" onSubmit={handleSubmit}>
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
    </div>
  );
}
