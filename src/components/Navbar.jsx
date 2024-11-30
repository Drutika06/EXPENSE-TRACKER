import React from 'react';
import './Navbar.css';

function Navbar({ loggedInUser, handleLogout, setIsSignUp }) {
  return (
    <nav className="navbar">
      <h2>Expense Tracker</h2>
      <div className="nav-links">
        {loggedInUser ? (
          <div>
            <span>Welcome, {loggedInUser.username}</span>
            <button onClick={handleLogout}>Logout</button>
          </div>
        ) : (
          <div>
            <button onClick={() => setIsSignUp(true)}>Sign Up</button>
            <button onClick={() => setIsSignUp(false)}>Login</button>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
