import React from 'react';
import './SignUp.css';


function SignUp({ handleSignUp, setUsername, setPassword, setBalance, errorMessage, toggleLogin }) {
  return (
    <div className="auth-form">
      <h2>Sign Up</h2>
      {errorMessage && <p className="error">{errorMessage}</p>}
      <form onSubmit={handleSignUp}>
        <input
          type="text"
          placeholder="Username"
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type="number"
          placeholder="Initial Balance"
          onChange={(e) => setBalance(e.target.value)}
        />
        <button type="submit">Sign Up</button>
      </form>
      <button onClick={toggleLogin}>Already have an account? Login</button>
    </div>
  );
}

export default SignUp;
