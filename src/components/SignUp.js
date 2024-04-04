import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import bcrypt from 'bcryptjs'; // Import bcryptjs for password hashing
import supabase from '../components/config/supabaseClient'; // Import Supabase client
import './Dashboard.css';

const saltRounds = parseInt(process.env.REACT_APP_PASS);
// Number of salt rounds for bcrypt hashing
const securityQuestionsList = [
  "What is your mother's maiden name?",
  "What city were you born in?",
  "What is the name of your first pet?",
  "What is the model of your first car?",
  "What is your favorite book/movie/TV show?",
  "What is the name of your childhood best friend?",
  "What is the name of the street you grew up on?",
  "What is the name of your favorite teacher?",
  "What is the make of your first computer?",
  "What is your favorite food?",
  "What is the name of the company where you had your first job?",
  "What is your favorite vacation destination?",
  "What is the name of your favorite sports team?",
  "What was your high school mascot?",
  "What is your favorite color?",
];
const SignUp = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState(''); // Changed from 'email' to 'username'
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [selectedQuestion, setSelectedQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if passwords match
    if (password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    try {
      // Hash the password and answer using bcrypt
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      const hashedAnswer = await bcrypt.hash(answer, saltRounds);

      // Insert user data including security questions into the 'users' table
      const { data, error } = await supabase
        .from('user')
        .insert([{ username, password: hashedPassword, security_question: selectedQuestion, answer: hashedAnswer }]); // Changed 'email' to 'username'

      if (error) {
        throw error;
      }

      // Redirect to the login page after successful sign-up
      navigate('/login');
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="container">
      <h1>Sign Up</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="username">Username</label> {/* Changed 'email' to 'username' */}
        <input
          type="text" // Changed 'email' type to 'text'
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

        <label htmlFor="confirmPassword">Confirm Password</label>
        <input
          type="password"
          id="confirmPassword"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />

        {/* Render dropdown menu for selecting security question */}
        <label htmlFor="securityQuestion">Security Question</label>
        <select
          id="securityQuestion"
          value={selectedQuestion}
          onChange={(e) => setSelectedQuestion(e.target.value)}
          required
        >
          <option value="" disabled>Select a security question</option>
          {securityQuestionsList.map((question, index) => (
            <option key={index} value={question}>{question}</option>
          ))}
        </select>

        {/* Input field for entering the answer */}
        <label htmlFor="answer">Answer</label>
        <input
          type="text"
          id="answer"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          required
        />

        <button type="submit">Sign Up</button>
      </form>
      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default SignUp;
