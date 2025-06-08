import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Donate from './pages/Donate';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Mission from './pages/Mission';
import Chapters from './pages/Chapters';
import Contact from './pages/Contact';
import Events from './pages/Events';
import Initiatives from './pages/Initiatives';
import Partners from './pages/Partners';
import Timeline from './pages/Timeline';
import Team from './pages/Team';
import Volunteering from './pages/Volunteering';
import './index.css';
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import ProtectedRoute from './components/ProtectedRoute';
import ScrollToTop from './components/ScrolltoTop';

const initialPayPalOptions = {
  "client-id": "AZpScH1lcTS7gE56GO1AbNqBu_D0Ef9CVoiQUDhaIHgDNZIOcYKjAK7eyPfXyEcaM4p5EpVAwXlDT84W",
  "enable-funding": "venmo",
  "disable-funding": "",
  "buyer-country": "US",
  currency: "USD",
  components: "buttons",
};

function App() {
  return (
    <PayPalScriptProvider options={initialPayPalOptions}>
      <Router>
        <Navbar />
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/donate" element={<Donate />} />
          <Route path="/mission" element={<Mission />} />
          <Route path="/chapters" element={<Chapters />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/events" element={<Events />} />
          <Route path="/initiatives" element={<Initiatives />} />
          <Route path="/partners" element={<Partners />} />
          <Route path="/timeline" element={<Timeline />} />
          <Route path="/team" element={<Team />} />
          <Route path="/volunteering" element={<Volunteering />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
        </Routes>
      </Router>
    </PayPalScriptProvider>
  );
}

export default App;
