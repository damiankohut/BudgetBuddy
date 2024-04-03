import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import "./home.css"
function Home() {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleSignupClick = () => {
    navigate('/signup');
  };

  return (
    <div className="container">
      <h1 className="heading">Welcome to Expense Tracker</h1>
      <p className="paragraph">
        Expense Tracker is a simple tool designed to help you manage your finances. 
        Whether you're tracking daily expenses, monitoring your income, or planning 
        for the future, Expense Tracker provides an easy-to-use interface to keep 
        your finances organized.
      </p>
      <p className="paragraph">
        I created this expense tracker because I wanted to gain better insight into 
        my spending habits and take control of my finances. By tracking my expenses 
        and income in one place, I can make more informed financial decisions and 
        work towards my financial goals.
      </p>
      <p className="paragraph">
        I hope you find Expense Tracker helpful in managing your finances and achieving 
        your financial objectives. Enjoy tracking!
      </p>

      <div>
        <div className="blue-button" onClick={handleLoginClick}>Login</div>
        <div className="blue-button" onClick={handleSignupClick}>Sign Up</div>
      </div>
    </div>
  );
}

export default Home;
