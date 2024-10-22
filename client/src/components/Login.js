import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ApiService from '../services/ApiService';
import { motion } from 'framer-motion';


const Login = ({ setIsLoggedIn }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await ApiService.loginUser({ email, password });
      setIsLoggedIn(true); // Update login status on successful login
      // Redirect to the dashboard
      navigate('/dashboard');
    } catch (err) {
      setError('Invalid email or password');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-r from-[#1E3A8A] to-[#0D9488]">
      <motion.h2
        className="text-3xl font-bold text-white mb-4"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        Login
      </motion.h2>
      {error && <p className="text-red-500">{error}</p>}
      <motion.form
        onSubmit={handleSubmit}
        className="bg-black p-6 rounded shadow-md w-80"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="border border-gray-300 p-2 mb-4 w-full rounded bg-gray-800 text-white"
          whileFocus={{ borderColor: '#0D9488' }}
        />
        <motion.input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="border border-gray-300 p-2 mb-4 w-full rounded bg-gray-800 text-white"
          whileFocus={{ borderColor: '#0D9488' }}
        />
        <motion.button
          type="submit"
          className="bg-[#1E3A8A] text-white py-2 px-4 rounded hover:bg-[#0D9488] w-full"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Login
        </motion.button>
      </motion.form>
    </div>
  );
};

export default Login;
