import React from 'react';

const styles = {
  loginPage: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#f5f0e1',
    fontFamily: 'Arial, sans-serif',
  },
  loginContainer: {
    backgroundColor: '#ffffff',
    padding: '40px',
    borderRadius: '10px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    width: '300px',
    textAlign: 'center',
  },
  title: {
    fontSize: '48px',
    color: '#8e9aaf',
    marginBottom: '10px',
    fontWeight: '300',
  },
  subtitle: {
    fontSize: '16px',
    color: '#6c757d',
    marginBottom: '30px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  input: {
    padding: '12px',
    borderRadius: '5px',
    border: '1px solid #e0e0e0',
    fontSize: '14px',
  },
  button: {
    backgroundColor: '#8e9aaf',
    color: 'white',
    border: 'none',
    padding: '12px',
    borderRadius: '5px',
    fontSize: '16px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  },
  forgotPassword: {
    marginTop: '20px',
    color: '#8e9aaf',
    textDecoration: 'none',
    fontSize: '14px',
  },
};

function Login() {
  return (
    <div style={styles.loginPage}>
      <div style={styles.loginContainer}>
        <h1 style={styles.title}>ReLease</h1>
        <p style={styles.subtitle}>Find your perfect sub lease today!</p>
        <form style={styles.form}>
          <input 
            style={styles.input} 
            type="email" 
            placeholder="anaygupta@my.unt.edu" 
          />
          <input 
            style={styles.input} 
            type="password" 
            placeholder="••••••••" 
          />
          <button style={styles.button} type="submit">
            LOGIN
          </button>
        </form>
        <a href="#" style={styles.forgotPassword}>
          Forgot password?
        </a>
      </div>
    </div>
  );
}

export default Login;