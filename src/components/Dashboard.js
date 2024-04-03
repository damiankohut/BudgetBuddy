import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import supabase from '../components/config/supabaseClient';
import './Dashboard.css';

function Dashboard() {
  const location = useLocation();
  const [transactions, setTransactions] = useState([]);
  const [formData, setFormData] = useState({ name: '', amount: '', date: '', type: 'expense' });
  const userId = location.state?.userId;
  const [scrollEnabled, setScrollEnabled] = useState(false);
  useEffect(() => {
    fetchTransactions();
  }, []);
  
  useEffect(() => {
    if (transactions.length > 5) {
      setScrollEnabled(true);
    } else {
      setScrollEnabled(false);
    }
  }, [transactions]);

  const fetchTransactions = async () => {
    try {
      const { data, error } = await supabase
        .from('expenses')
        .select('*')
        .eq('uuid', userId);

      if (error) {
        throw error;
      }

      // Add default balance transaction
      const balanceTransaction = {
        name: 'Initial Balance',
        amount: 0,
        date: new Date().toISOString(),
        type: 'expense',
        uuid: userId,
      };

      setTransactions([...data, balanceTransaction]);
    } catch (error) {
      console.error('Error fetching transactions:', error.message);
    }
  };

  const deleteTransaction = async (uuid, expenseId) => {
    try {
      await supabase.from('expenses').delete().eq('uuid', uuid).eq('expenseid', expenseId);
      fetchTransactions();
    } catch (error) {
      console.error('Error deleting transaction:', error.message);
    }
  };

  const addTransaction = async (e) => {
    e.preventDefault();

    try {
      await supabase.from('expenses').insert([
        {
          ...formData,
          uuid: userId,
        },
      ]);

      fetchTransactions();
      setFormData({ name: '', amount: '', date: '', type: 'expense' }); // Reset form data
    } catch (error) {
      console.error('Error adding transaction:', error.message);
    }
  };

  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    signDisplay: "always",
  });

  const updateTotal = () => {
    const incomeTotal = transactions
      .filter((trx) => trx.type === "income")
      .reduce((total, trx) => total + trx.amount, 0);

    const expenseTotal = transactions
      .filter((trx) => trx.type === "expense")
      .reduce((total, trx) => total + trx.amount, 0);

    const balanceTotal = incomeTotal - expenseTotal;

    return {
      balance: formatter.format(balanceTotal),
      income: formatter.format(incomeTotal),
      expense: formatter.format(-1 * expenseTotal)
    };
  };

  useEffect(() => {
    
    updateTotal();
  }, [transactions]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const renderList = () => {
    return transactions.map((transaction) => {
      // Filter out the initial balance transaction
      if (transaction.name === 'Initial Balance') {
        return null; // Skip rendering the initial balance transaction
      }

      const key = transaction.id || Math.random(); // Generate a key if 'id' doesn't exist
      const amount = transaction.type === 'expense' ? -Math.abs(transaction.amount) : transaction.amount;
      return (
        <li key={key}>
          <div className="name">
            <h4>{transaction.name}</h4>
            <p>{new Date(transaction.date).toLocaleDateString()}</p>
          </div>
          <div className={`amount ${transaction.type}`}>
            {/* Display the amount with a negative sign for expenses */}
            <span>{formatter.format(amount)}</span>
          </div>
          <div className="action">
            <button onClick={() => deleteTransaction(transaction.uuid, transaction.expenseid)}>Delete</button>
          </div>
        </li>
      );
    }).filter(Boolean); // Filter out null elements (initial balance transactions)
  };

  return (
    <div>
      <h1>Expense Tracker</h1>
      <main>
        <header>
          <div>
            <h5>Total Balance</h5>
            <span id="balance">{updateTotal().balance}</span>
          </div>
          <div>
            <h5>Income</h5>
            <span id="income">{updateTotal().income}</span>
          </div>
          <div>
            <h5>Expense</h5>
            <span id="expense">{updateTotal().expense}</span>
          </div>
        </header>

        <section>
          <h3>Transactions</h3>
          <ul className={scrollEnabled ? "scrollable" : ""}>
            {renderList()}
          </ul>
          <div id="status"></div>
        </section>

        <section>
          <h3>Add Transaction</h3>
          <form onSubmit={addTransaction}>
            <div>
              <label htmlFor="type">
                <input
                  type="checkbox"
                  name="type"
                  id="type"
                  checked={formData.type === 'income'}
                  onChange={(e) => setFormData({ ...formData, type: e.target.checked ? 'income' : 'expense' })}
                />
                <div className="option">
                  <span>Expense</span>
                  <span>Income</span>
                </div>
              </label>
            </div>
            <div>
              <label htmlFor="name">Name</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} required />
            </div>
            <div>
              <label htmlFor="amount">Amount</label>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                min="0.01"
                step="0.01"
                required
              />
            </div>
            <div>
              <label htmlFor="date">Date</label>
              <input type="date" name="date" value={formData.date} onChange={handleChange}
              required />
              </div>
              <button type="submit">Submit</button>
            </form>
          </section>
        </main>
      </div>
    );
  }
  
  export default Dashboard;
  