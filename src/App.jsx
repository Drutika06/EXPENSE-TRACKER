import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [users, setUsers] = useState([]);
  const [loggedInUser, setLoggedInUser] = useState(null); // Track the logged-in user
  const [expenseTitle, setExpenseTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [quantity, setQuantity] = useState('');
  const [balance, setBalance] = useState(0); // Balance entered during signup or update
  const [totalExpense, setTotalExpense] = useState(0);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(true); // Toggle between SignUp and Login forms
  const [editExpenseId, setEditExpenseId] = useState(null); // Track the expense to be edited
  const [errorMessage, setErrorMessage] = useState(''); // To hold error messages

  // Fetch users from the server
  const fetchUsers = () => {
    axios
      .get('http://localhost:5000/users')
      .then((response) => {
        setUsers(response.data);
      })
      .catch((error) => {
        console.error('Error fetching users:', error);
      });
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // User Signup
  const handleSignUp = (e) => {
    e.preventDefault();
    if (!username || !password || !balance) {
      setErrorMessage('Please fill in all fields');
      return;
    }

    const newUser = { username, password, balance: Number(balance), expenses: [] };

    axios
      .post('http://localhost:5000/users', newUser)
      .then((response) => {
        setUsers([...users, response.data]);
        alert('User created successfully');
        setErrorMessage('');
      })
      .catch((error) => {
        console.error('Error signing up:', error);
      });
  };

  // User Login
  const handleLogin = (e) => {
    e.preventDefault();
    if (!username || !password) {
      setErrorMessage('Please enter username and password');
      return;
    }

    const user = users.find(
      (user) => user.username === username && user.password === password
    );

    if (user) {
      setLoggedInUser(user);
      setBalance(user.balance);
      alert('Logged in successfully');
      setErrorMessage('');
    } else {
      setErrorMessage('Invalid username or password');
    }
  };

  // User Logout
  const handleLogout = () => {
    setLoggedInUser(null);
    setUsername('');
    setPassword('');
    setBalance(0);
    setExpenseTitle('');
    setAmount('');
    setQuantity('');
    setErrorMessage('');
  };

  // Update User Balance
  const handleBalanceUpdate = () => {
    if (loggedInUser) {
      const updatedUser = { ...loggedInUser, balance: Number(balance) };
      axios
        .put(`http://localhost:5000/users/${loggedInUser.id}`, updatedUser)
        .then((response) => {
          setLoggedInUser(response.data);
          alert('Balance updated successfully');
        })
        .catch((error) => {
          console.error('Error updating balance:', error);
        });
    }
  };

  // Add/Edit Expense
  const handleExpenseSubmit = (e) => {
    e.preventDefault();
    if (!loggedInUser) {
      alert('You must be logged in to add an expense');
      return;
    }

    if (!expenseTitle || !amount || !quantity || amount <= 0 || quantity <= 0) {
      setErrorMessage('Please fill in valid expense details');
      return;
    }

    const expenseData = {
      name: expenseTitle,
      amount: Number(amount),
      quantity: Number(quantity),
      userId: loggedInUser.id,
    };

    if (editExpenseId) {
      axios
        .put(`http://localhost:5000/expenses/${editExpenseId}`, expenseData)
        .then((response) => {
          const updatedExpenses = loggedInUser.expenses.map((expense) =>
            expense.id === editExpenseId ? response.data : expense
          );
          setLoggedInUser({ ...loggedInUser, expenses: updatedExpenses });
          calculateTotalExpense(updatedExpenses);
          resetExpenseForm();
        })
        .catch((error) => {
          console.error('Error updating expense:', error);
        });
    } else {
      axios
        .post('http://localhost:5000/expenses', expenseData)
        .then((response) => {
          setLoggedInUser({
            ...loggedInUser,
            expenses: [...loggedInUser.expenses, response.data],
          });
          calculateTotalExpense([...loggedInUser.expenses, response.data]);
          resetExpenseForm();
        })
        .catch((error) => {
          console.error('Error adding expense:', error);
        });
    }
  };

  // Calculate Total Expense
  const calculateTotalExpense = (expensesList) => {
    const total = expensesList.reduce(
      (total, expense) => total + expense.amount * expense.quantity,
      0
    );
    setTotalExpense(total);
  };

  // Reset Expense Form
  const resetExpenseForm = () => {
    setExpenseTitle('');
    setAmount('');
    setQuantity('');
    setEditExpenseId(null);
  };

  // Edit Expense
  const handleEditExpense = (expense) => {
    setExpenseTitle(expense.name);
    setAmount(expense.amount);
    setQuantity(expense.quantity);
    setEditExpenseId(expense.id);
  };

  // Delete Expense
  const handleDeleteExpense = (expenseId) => {
    if (!loggedInUser) {
      alert('You must be logged in to delete an expense');
      return;
    }

    axios
      .delete(`http://localhost:5000/expenses/${expenseId}`)
      .then(() => {
        const updatedExpenses = loggedInUser.expenses.filter(
          (expense) => expense.id !== expenseId
        );
        setLoggedInUser({ ...loggedInUser, expenses: updatedExpenses });
        calculateTotalExpense(updatedExpenses);
      })
      .catch((error) => {
        console.error('Error deleting expense:', error);
      });
  };

  return (
    <div>
      <h1>Expense Tracker</h1>

      {!loggedInUser && (
        <div>
          {isSignUp ? (
            <form onSubmit={handleSignUp}>
              <h2>Sign Up</h2>
              {errorMessage && <p>{errorMessage}</p>}
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <input
                type="number"
                placeholder="Initial Balance"
                value={balance}
                onChange={(e) => setBalance(e.target.value)}
              />
              <button type="submit">Create Account</button>
            </form>
          ) : (
            <form onSubmit={handleLogin}>
              <h2>Login</h2>
              {errorMessage && <p>{errorMessage}</p>}
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button type="submit">Login</button>
            </form>
          )}
          <button onClick={() => setIsSignUp(!isSignUp)}>
            {isSignUp ? 'Already have an account? Login' : 'New here? Sign Up'}
          </button>
        </div>
      )}

      {loggedInUser && (
        <div>
          <h2>Welcome, {loggedInUser.username}</h2>
          <h3>Balance: Rs {balance}</h3>

          <div>
            <input
              type="number"
              value={balance}
              onChange={(e) => setBalance(Number(e.target.value) || '')}
              placeholder="Update Balance"
            />
            <button onClick={handleBalanceUpdate}>Update Balance</button>
          </div>

          <form onSubmit={handleExpenseSubmit}>
            <input
              type="text"
              placeholder="Expense Title"
              value={expenseTitle}
              onChange={(e) => setExpenseTitle(e.target.value)}
            />
            <input
              type="number"
              placeholder="Amount"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value) || '')}
            />
            <input
              type="number"
              placeholder="Quantity"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value) || '')}
            />
            <button type="submit">
              {editExpenseId ? 'Update Expense' : 'Add Expense'}
            </button>
          </form>

          <h3>Total Expense: Rs {totalExpense}</h3>
          <h3>Remaining Balance: Rs {balance - totalExpense}</h3>

          <ul>
            {loggedInUser.expenses.map((expense) => (
              <li key={expense.id}>
                {expense.name} - Rs {expense.amount} x {expense.quantity} = Rs{' '}
                {expense.amount * expense.quantity}
                <button onClick={() => handleEditExpense(expense)}>Edit</button>
                <button onClick={() => handleDeleteExpense(expense.id)}>
                  Delete
                </button>
              </li>
            ))}
          </ul>

          <button onClick={handleLogout}>Logout</button>
        </div>
      )}
    </div>
  );
}

export default App;

 