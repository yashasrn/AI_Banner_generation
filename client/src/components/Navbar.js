import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = ({ isLoggedIn, setIsLoggedIn }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear user session (you can add actual logout logic here)
    setIsLoggedIn(false);
    navigate('/');
  };

  return (
    <nav className="bg-black text-white flex items-center justify-between p-4 shadow-lg">
      <div className="flex items-center">
        <img src="/logo.png" alt="Logo" className="h-8 mr-2" /> {/* Add your logo path here */}
        <h1 className="text-xl font-semibold">AI Banner Gen</h1>
      </div>
      <ul className="flex space-x-4">
        {!isLoggedIn && <li><Link to="/">Home</Link></li>}
        {!isLoggedIn ? (
          <>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/signup">Signup</Link></li>
          </>
        ) : (
          <li><button onClick={handleLogout}>Logout</button></li>   

        )}
      </ul>
    </nav>
  );
};

export default Navbar;