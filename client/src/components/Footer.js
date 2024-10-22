import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-black text-white text-center p-4">
      <p>&copy; {new Date().getFullYear()} AI Dynamic Banner Generator. All rights reserved.</p>
    </footer>
  );
};

export default Footer;
