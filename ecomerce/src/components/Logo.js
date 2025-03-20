import React from 'react';
import { Link } from 'react-router-dom';

const Logo = () => {
  return (
    <Link to="/" className="flex flex-col items-center justify-center">
      <img
        className="h-12 w-auto"
        src="https://cdn-icons-png.flaticon.com/512/3081/3081559.png"
        alt="E-Commerce Logo"
      />
      <span className="mt-2 text-xl font-bold text-gray-800">E-Commerce</span>
    </Link>
  );
};

export default Logo; 