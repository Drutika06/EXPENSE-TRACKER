import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  CategoryScale,
  LinearScale,
} from 'chart.js';
import './ExpenseTracker.css';

// Register Chart.js components
ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale);

function ExpenseTracker({ loggedInUser, setLoggedInUser }) {
  const [expenseTitle, setExpenseTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [quantity, setQuantity] = useState('');
  const [editExpenseId, setEditExpenseId] = useState(null);
  const [newBalance, setNewBalance] = useState(loggedInUser.balance);
  const [totalExpense, setTotalExpense] = useState(0);

  useEffect(() => {
    const total = loggedInUser.expenses.reduce(
      (sum, expense) => sum + expense.amount * expense.quantity,
      0
    );
    setTotalExpense(total);
  }, [loggedInUser.expenses]);

  const handleBalanceUpdate = () => {
    axios
      .put(`http://localhost:5000/users/${loggedInUser.id}`, {
        ...loggedInUser,
        balance: newBalance,
      })
      .then((response) => {
        setLoggedInUser(response.data);
        alert('Balance updated successfully');
      })
      .catch((error) => console.error('Error updating balance:', error));
  };

  const handleExpenseSubmit = (e) => {
    e.preventDefault();
    if (!expenseTitle || !amount || !quantity) {
      alert('Please fill in all expense fields');
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
          resetExpenseForm();
        })
        .catch((error) => console.error('Error updating expense:', error));
    } else {
      axios
        .post('http://localhost:5000/expenses', expenseData)
        .then((response) => {
          setLoggedInUser({
            ...loggedInUser,
            expenses: [...loggedInUser.expenses, response.data],
          });
          resetExpenseForm();
        })
        .catch((error) => console.error('Error adding expense:', error));
    }
  };

  const handleDeleteExpense = (expenseId) => {
    axios
      .delete(`http://localhost:5000/expenses/${expenseId}`)
      .then(() => {
        const updatedExpenses = loggedInUser.expenses.filter(
          (expense) => expense.id !== expenseId
        );
        setLoggedInUser({ ...loggedInUser, expenses: updatedExpenses });
      })
      .catch((error) => console.error('Error deleting expense:', error));
  };

  const handleEditExpense = (expense) => {
    setExpenseTitle(expense.name);
    setAmount(expense.amount);
    setQuantity(expense.quantity);
    setEditExpenseId(expense.id);
  };

  const resetExpenseForm = () => {
    setExpenseTitle('');
    setAmount('');
    setQuantity('');
    setEditExpenseId(null);
  };

  const pieChartData = {
    labels: ['Total Expenses', 'Remaining Balance'],
    datasets: [
      {
        data: [totalExpense, loggedInUser.balance - totalExpense],
        backgroundColor: ['rgb(36, 124, 158)', 'rgb(8, 54, 71)'],
        borderColor: '#ffffff',
        borderWidth: 2,
      },
    ],
  };

  const pieChartOptions = {
    plugins: {
      legend: {
        labels: {
          color: '#ffffff', // Set legend text color to white
          font: {
            size: 14,
            weight: 'bold',
          },
        },
      },
    },
  };

  return (
    <div className="expense-tracker">
      <h2>Manage Your Expenses</h2>
      <div className="balance-section">
        <h3>Balance: Rs {loggedInUser.balance}</h3>
        <input
          type="number"
          placeholder="Update Balance"
          value={newBalance}
          onChange={(e) => setNewBalance(Number(e.target.value))}
        />
        <button onClick={handleBalanceUpdate}>Update Balance</button>
      </div>

      <form onSubmit={handleExpenseSubmit} className="expense-form">
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
          onChange={(e) => setAmount(e.target.value)}
        />
        <input
          type="number"
          placeholder="Quantity"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
        />
        <button type="submit">
          {editExpenseId ? 'Update Expense' : 'Add Expense'}
        </button>
      </form>

      <div className="expense-summary">
        <h3>Total Expenses: Rs {totalExpense}</h3>
        <h3>Remaining Balance: Rs {loggedInUser.balance - totalExpense}</h3>
      </div>

      <div className="expense-pie-chart">
        <h3>Balance Analysis</h3>
        <Pie data={pieChartData} options={pieChartOptions} />
      </div>

      <ul className="expense-list">
        {loggedInUser.expenses.map((expense) => (
          <li key={expense.id} className="expense-item">
            {expense.name} - Rs {expense.amount} x {expense.quantity}
            <div className="expense-actions">
              <button onClick={() => handleEditExpense(expense)}>Edit</button>
              <button onClick={() => handleDeleteExpense(expense.id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ExpenseTracker;

