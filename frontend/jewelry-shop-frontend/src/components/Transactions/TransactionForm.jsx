import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { transactionService } from '../../services/transactionService';
import { customerService } from '../../services/customerService';
import { itemService } from '../../services/itemService';

const TransactionForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    transactionType: 'Cash',
    totalAmount: 0,
    totalAmountWithoutTax: 0,
    taxAmount: 0,
    date: new Date().toISOString().split('T')[0],
    customer: '',
    item: ''
  });

  const [customers, setCustomers] = useState([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchCustomers();
    fetchItems();
    if (isEdit) {
      fetchTransaction();
    }
  }, [id]);

  const fetchCustomers = async () => {
    try {
      const response = await customerService.getAllCustomers();
      setCustomers(response.data);
    } catch (error) {
      console.error('Error fetching customers:', error);
    }
  };

  const fetchItems = async () => {
    try {
      const response = await itemService.getAllItems();
      setItems(response.data);
    } catch (error) {
      console.error('Error fetching items:', error);
    }
  };

  const fetchTransaction = async () => {
    try {
      setLoading(true);
      const response = await transactionService.getTransactionById(id);
      const transaction = response.data;
      setFormData({
        ...transaction,
        date: new Date(transaction.date).toISOString().split('T')[0],
        customer: transaction.customer?._id || '',
        item: transaction.item?._id || ''
      });
    } catch (error) {
      console.error('Error fetching transaction:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    const newValue = type === 'number' ? parseFloat(value) || 0 : value;
    
    setFormData(prev => {
      const updated = {
        ...prev,
        [name]: newValue
      };

      // Auto-calculate tax and total when totalAmountWithoutTax changes
      if (name === 'totalAmountWithoutTax') {
        updated.taxAmount = newValue * 0.18; // 18% tax
        updated.totalAmount = newValue + updated.taxAmount;
      }

      return updated;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (isEdit) {
        await transactionService.updateTransaction(id, formData);
      } else {
        await transactionService.createTransaction(formData);
      }
      navigate('/transactions');
    } catch (error) {
      console.error('Error saving transaction:', error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="page-container">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">{isEdit ? 'Edit Transaction' : 'Create New Transaction'}</h1>
        <Link to="/transactions" className="btn btn-secondary">
          <ArrowLeft size={20} />
          Back to Transactions
        </Link>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Date *</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Customer</label>
              <select
                name="customer"
                value={formData.customer}
                onChange={handleChange}
                className="form-control"
              >
                <option value="">Select Customer</option>
                {customers.map(customer => (
                  <option key={customer._id} value={customer._id}>
                    {customer.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Item</label>
              <select
                name="item"
                value={formData.item}
                onChange={handleChange}
                className="form-control"
              >
                <option value="">Select Item</option>
                {items.map(item => (
                  <option key={item._id} value={item._id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Total Amount Without Tax</label>
            <input
              type="number"
              name="totalAmountWithoutTax"
              value={formData.totalAmountWithoutTax}
              onChange={handleChange}
              className="form-control"
              step="0.01"
              min="0"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Tax Amount (Auto-calculated)</label>
              <input
                type="number"
                name="taxAmount"
                value={formData.taxAmount}
                onChange={handleChange}
                className="form-control"
                step="0.01"
                min="0"
                readOnly
              />
            </div>
            <div className="form-group">
              <label className="form-label">Total Amount (Auto-calculated)</label>
              <input
                type="number"
                name="totalAmount"
                value={formData.totalAmount}
                onChange={handleChange}
                className="form-control"
                step="0.01"
                min="0"
                readOnly
              />
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Transaction Type *</label>
              <select
                name="transactionType"
                value={formData.transactionType}
                onChange={handleChange}
                className="form-control"
                required
              >
                <option value="Cash">Cash</option>
                <option value="Banking">Banking</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Total Amount</label>
              <input
                type="number"
                name="totalAmount"
                value={formData.totalAmount}
                onChange={handleChange}
                className="form-control"
                step="0.01"
                min="0"
                readOnly
              />
            </div>
          </div>

          <div className="form-actions">
            <button
              type="submit"
              className="btn btn-success"
              disabled={submitting}
            >
              {submitting ? 'Saving...' : (isEdit ? 'Update Transaction' : 'Create Transaction')}
            </button>
            <Link to="/transactions" className="btn btn-secondary">
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TransactionForm;
