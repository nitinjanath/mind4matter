import { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:8000/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ full_name: fullName, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        alert('Registration successful!');
        console.log(data);
      } else {
        alert(data.detail || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      alert('An error occurred during registration.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4 text-[#001F54]">
      <h1 className="text-2xl font-bold mb-4 mt-4 text-center" style={{ color: '#001F54' }}>
        Create a New Account
      </h1>

      <div className="w-[400px] min-h-[300px] bg-white p-10 rounded-[10px] shadow-lg border border-gray-200">
        <form className="space-y-6 flex flex-col items-center" onSubmit={handleSubmit}>
          <div className="w-full">
            <div className="w-2/3 mx-auto">
              <label htmlFor="fullName" className="text-left font-medium mb-1 block">
                < br/>
                Full Name
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                className="w-full h-[24px] px-4 py-2 bg-white text-[#000000] border border-gray-300 rounded-[5px] shadow-sm focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 transition"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="w-full">
            <div className="w-2/3 mx-auto">
              <label htmlFor="email" className="text-left font-medium mb-1 block">
                Email address
              </label>
              <input
                type="email"
                id="email"
                className="w-full h-[24px] px-4 py-2 bg-white text-[#000000] border border-gray-300 rounded-[5px] shadow-sm focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 transition"
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
                className="w-full h-[24px] px-4 py-2 bg-white text-[#000000] border border-gray-300 rounded-[5px] shadow-sm focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 transition"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>
      < br/>
          <button
            type="submit"
            className="w-2/3 h-12 bg-green-700 hover:bg-green-800 text-white text-sm font-semibold rounded-lg transition"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
}
