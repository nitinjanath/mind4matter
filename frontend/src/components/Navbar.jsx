import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    document.body.style.backgroundColor = '#FFFFFF';
    return () => {
      document.body.style.backgroundColor = '';
    };
  }, []);

  useEffect(() => {
    const handleStorageChange = () => {
      setToken(localStorage.getItem('token'));
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    window.location.href = '/login';
  };

  return (
    <nav className="bg-[#001F54] text-white px-6 py-4 flex flex-col w-screen fixed top-0 left-0 z-50 shadow-md items-center">
      {/* Top right: Auth links */}
      <div className="w-full flex mb-2 text-sm font-medium justify-end">
        <div className="flex gap-5 mr-10">
          {!token ? (
            <>
              <Link to="/login" className="hover:underline">Login</Link>
              <Link to="/register" className="hover:underline">Register</Link>
            </>
          ) : (
            <button onClick={handleLogout} className="hover:underline">Logout</button>
          )}
        </div>
      </div>

      {/* Title */}
      <h1 className="text-2xl font-bold text-center text-white mb-2">Mind4Matter</h1>

      {/* Navigation with dropdowns */}
      <div className="flex flex-wrap justify-center gap-[200px] text-lg font-medium relative z-50">
  <Link to="/" className="hover:underline text-white">Home</Link>
  <Link to="/donate" className="hover:underline text-white">Donate</Link>

  {/* About Us Dropdown */}
  <div className="relative group text-white">
    <span
      className="hover:underline cursor-pointer text-center block !text-white"
      style={{ color: '#ffffff' }}
    >
      About Us
    </span>          
    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 hidden group-hover:flex flex-col bg-[#001F54] text-white shadow-md rounded-md py-2 min-w-[160px] z-50 text-center">
      <Link to="/mission" className="px-4 py-2 hover:bg-[#003366]">Mission</Link>
      <Link to="/contact" className="px-4 py-2 hover:bg-[#003366]">Contact</Link>
      <Link to="/partners" className="px-4 py-2 hover:bg-[#003366]">Partners</Link>
      <Link to="/timeline" className="px-4 py-2 hover:bg-[#003366]">Timeline</Link>
    </div>
  </div>

  {/* Get Involved Dropdown */}
  <div className="relative group text-white">
    <span
      className="hover:underline cursor-pointer text-center block !text-white"
      style={{ color: '#ffffff' }}
    >
      Get Involved!
    </span>          
    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 hidden group-hover:flex flex-col bg-[#001F54] text-white shadow-md rounded-md py-2 min-w-[160px] z-50 text-center">
      <Link to="/events" className="px-4 py-2 hover:bg-[#003366]">Events</Link>
      <Link to="/initiatives" className="px-4 py-2 hover:bg-[#003366]">Initiatives</Link>
      <Link to="/team" className="px-4 py-2 hover:bg-[#003366]">Team</Link>
      <Link to="/chapters" className="px-4 py-2 hover:bg-[#003366]">Chapters</Link>
    </div>
  </div>
</div>

    </nav>
  );
}

export default Navbar;
