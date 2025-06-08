// src/pages/Home.jsx
import React from 'react';
import Navbar from "../components/Navbar";

export default function Home() {
  return (
    <div className="pt-24">
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="bg-black text-white py-16 w-screen">
        <div className="max-w-5xl mx-auto text-center px-6">
          <h2 className="text-4xl font-bold mb-4">Support Mental Health, Empower Families</h2>
          <p className="text-lg mb-6">
            Mind4Matter is dedicated to raising awareness and providing support for families affected by mental health challenges.
          </p>
          <a href="/donate" className="bg-white text-black font-semibold px-6 py-3 rounded-full hover:bg-gray-100 transition">
            Join the Movement
          </a>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-white text-[#001F54] text-center w-screen">
        <div className="max-w-4xl mx-auto px-6">
          <br />
          <br />
          <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
          <p className="text-lg">
            We are a nonprofit committed to spreading hope, breaking stigma, and creating real change through community programs,
            education, and outreach.
          </p>
        </div>
      </section>

      {/* Programs/Features Grid */}
      <section className="bg-gray-100 py-16 text-[#001F54] text-center w-screen">
        <div className="max-w-6xl mx-auto px-6">
          <h3 className="text-2xl font-bold mb-10">What We Do</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition">
              <h4 className="font-bold text-lg mb-2">Community Outreach</h4>
              <p>Organizing local programs to support mental health awareness.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition">
              <h4 className="font-bold text-lg mb-2">Education & Resources</h4>
              <p>Providing mental health education and coping resources to families.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition">
              <h4 className="font-bold text-lg mb-2">Youth Engagement</h4>
              <p>Empowering youth volunteers through our leadership and support programs.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#001F54] text-white text-center py-8 w-screen mt-auto">
  <div className="max-w-5xl mx-auto px-6">
    <p style={{ color: 'white' }}>© 2025 Mind4Matter | All Rights Reserved</p>
    <p style={{ color: 'white' }}>
      Contact us at <a href="mailto:mind4matter@gmail.com" style={{ color: 'white', textDecoration: 'underline' }}>mind4matter@gmail.com</a>
    </p>
  </div>
</footer>


    </div>
    </div>
  );
}
