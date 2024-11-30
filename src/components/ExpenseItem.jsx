import React from "react";

const ExpenseItem = ({ expense, deleteExpense }) => {
  return (
    <li>
      <span>{expense.name}: ${expense.amount}</span>
      <button onClick={() => deleteExpense(expense.id)}>Delete</button>
    </li>
  );
};

export default ExpenseItem;
