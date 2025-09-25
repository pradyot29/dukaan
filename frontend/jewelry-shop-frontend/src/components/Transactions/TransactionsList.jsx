import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { transactionService } from '../../services/transactionService';

const TransactionsList = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const response = await transactionService.getAllTransactions();
      setTransactions(response.data);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      try {
        await transactionService.deleteTransaction(id);
        setTransactions(transactions.filter(transaction => transaction._id !== id));
      } catch (error) {
        console.error('Error deleting transaction:', error);
      }
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount || 0);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN');
  };

  if (loading) {
    return (
      <div className="page-container">
        <div className="loading">Loading transactions...</div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Transactions</h1>
        <Link to="/transactions/new" className="btn btn-primary">
          <Plus size={20} />
          Add New Transaction
        </Link>
      </div>

      <div className="table-container">
        {transactions.length === 0 ? (
          <div className="empty-state">
            <h3>No transactions found</h3>
            <p>Add your first transaction to get started</p>
            <Link to="/transactions/new" className="btn btn-primary">
              <Plus size={20} />
              Add New Transaction
            </Link>
          </div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Type</th>
                <th>Customer</th>
                <th>Item</th>
                <th>Total Amount</th>
                <th>Tax Amount</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => (
                <tr key={transaction._id}>
                  <td>{formatDate(transaction.date)}</td>
                  <td>
                    <span className={`badge ${transaction.transactionType === 'Cash' ? 'badge-success' : 'badge-primary'}`}>
                      {transaction.transactionType}
                    </span>
                  </td>
                  <td>{transaction.customer?.name || 'N/A'}</td>
                  <td>{transaction.item?.name || 'N/A'}</td>
                  <td>{formatCurrency(transaction.totalAmount)}</td>
                  <td>{formatCurrency(transaction.taxAmount)}</td>
                  <td>
                    <div className="table-actions">
                      <Link to={`/transactions/edit/${transaction._id}`} className="btn btn-sm btn-primary">
                        <Edit size={16} />
                      </Link>
                      <button
                        onClick={() => handleDelete(transaction._id)}
                        className="btn btn-sm btn-danger"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default TransactionsList;