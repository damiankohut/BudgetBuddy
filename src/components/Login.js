import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from './config/supabaseClient'; // Import Supabase client
import bcrypt from 'bcryptjs'; // Import bcryptjs for password hashing

function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState(''); // Changed from email to username
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const saltRounds = parseInt(process.env.REACT_APP_PASS); // Number of salt rounds for bcrypt hashing

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Query the users table for the provided username
      const { data, error } = await supabase
        .from('user')
        .select('*')
        .eq('username', username) // Changed from email to username
        .single();

      if (error) {
        throw error;
      }

      // Check if user exists and the provided password matches
      if (data) {
        // Hash the provided password
        const hashedPasswordInput = await bcrypt.hash(password, saltRounds);

        // Compare hashed passwords
        const passwordMatch = await bcrypt.compare(password, data.password);

        if (passwordMatch) {
          // Redirect to the dashboard with user ID as state
          navigate('/dashboard', { state: { userId: data.id } });
        } else {
          setError('Invalid username or password'); // Changed from email to username
        }
      } else {
        setError('User not found');
      }
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="container">
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="username">Username</label> {/* Changed from email to username */}
        <input
          type="text" // Changed from email to text
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit">Login</button>
      </form>
      {error && <p className="error">{error}</p>}
    </div>
  );
}

export default Login;
