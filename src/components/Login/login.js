// components/Login.js
import React from 'react';
import './login.css';

function Login() {
  return (
    <div className="login-page">
      <h2>ReLease</h2>
      <p>Find your perfect sublease today!</p>
      <form className="login-form">
        <input type="text" placeholder="Username" />
        <input type="password" placeholder="Password" />
        <button>Login</button>
      </form>
    </div>
  );
}

export default Login;
