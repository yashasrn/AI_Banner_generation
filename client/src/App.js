import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Footer from './components/Footer';
import Login from './components/Login';
import Signup from './components/Signup';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import HeroSection from './components/HeroSection'; // Import HeroSection
import FeaturesSection from './components/FeaturesSection'; // Import FeaturesSection
import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <Router>
      <div className="App">
        <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
        <main className="bg-gray-200 p-4 h-screen overflow-y-scroll">
          <Routes>
            <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
            <Route path="/signup" element={<Signup />} />
            
            {/* Landing Page Route */}
            <Route 
              path="/" 
              element={
                <>
                  <HeroSection />
                  <FeaturesSection />
                </>
              } 
            />
            
            {/* Dashboard Page Route */}
            <Route 
              path="/dashboard" 
              element={isLoggedIn ? <Dashboard /> : <Navigate to="/login" />} 
            />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
