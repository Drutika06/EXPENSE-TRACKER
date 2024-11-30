import React from 'react';
import './Login.css';


function Login({ handleLogin, setUsername, setPassword, errorMessage, toggleSignUp }) {
  return (
    <div className="auth-form">
      <h2>Login</h2>
      {errorMessage && <p className="error">{errorMessage}</p>}
      <form onSubmit={handleLogin}>
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
        <button type="submit">Login</button>
      </form>
      <button onClick={toggleSignUp}>New here? Sign Up</button>
    </div>
  );
}

export default Login;
