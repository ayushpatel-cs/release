import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

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
  toggleText: {
    marginTop: '20px',
    color: '#8e9aaf',
    cursor: 'pointer',
    fontSize: '14px',
  },
};

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isRegister) {
        if (password !== confirmPassword) {
          setError('Passwords do not match');
          return;
        }
        await register(email, password, name, phone);
        setIsRegister(false); // Switch to login form after successful registration
        setError(''); // Clear any previous errors
        setSuccessMessage('Registration complete!');
        setEmail(''); // Clear email field
        setPassword(''); // Clear password field
        setConfirmPassword(''); // Clear confirm password field
        setName(''); // Clear name field
        setPhone(''); // Clear phone field
      } else {
        await login(email, password);
        navigate('/profile');
      }
    } catch (err) {
      setError(err.response?.data?.error || (isRegister ? 'Registration failed' : 'Login failed'));
    }
  };

  const toggleForm = () => {
    setIsRegister(!isRegister);
    setError(''); // Clear the error message when toggling the form
    setSuccessMessage(''); // Clear the success message when toggling the form
  };

  return (
    <div style={styles.loginPage}>
      <div style={styles.loginContainer}>
        <h1 style={styles.title}>ReLease</h1>
        <p style={styles.subtitle}>Find your perfect sub lease today!</p>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
        <form style={styles.form} onSubmit={handleSubmit}>
          {isRegister && (
            <>
              <input 
                style={styles.input} 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Name" 
                required
              />
              <input 
                style={styles.input} 
                type="text" 
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Phone" 
                required
              />
            </>
          )}
          <input 
            style={styles.input} 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email" 
            required
          />
          <input 
            style={styles.input} 
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password" 
            required
          />
          {isRegister && (
            <input 
              style={styles.input} 
              type="password" 
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm Password" 
              required
            />
          )}
          <button style={styles.button} type="submit">
            {isRegister ? 'REGISTER' : 'LOGIN'}
          </button>
        </form>
        <p style={styles.toggleText} onClick={toggleForm}>
          {isRegister ? 'Already have an account? Click here to login' : "Don't have an account? Click here to register"}
        </p>
      </div>
    </div>
  );
}

export default Login;