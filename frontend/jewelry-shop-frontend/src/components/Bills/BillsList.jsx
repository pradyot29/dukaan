import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit, Trash2, Eye } from 'lucide-react';
import { billService } from '../../services/billService';

const BillsList = () => {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBills();
  }, []);

  const fetchBills = async () => {
    try {
      setLoading(true);
      const response = await billService.getAllBills();
      setBills(response.data);
    } catch (error) {
      console.error('Error fetching bills:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this bill?')) {
      try {
        await billService.deleteBill(id);
        setBills(bills.filter(bill => bill._id !== id));
      } catch (error) {
        console.error('Error deleting bill:', error);
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
        <div className="loading">Loading bills...</div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Bills</h1>
        <Link to="/bills/new" className="btn btn-primary">
          <Plus size={20} />
          Add New Bill
        </Link>
      </div>

      <div className="table-container">
        {bills.length === 0 ? (
          <div className="empty-state">
            <h3>No bills found</h3>
            <p>Create your first bill to get started</p>
            <Link to="/bills/new" className="btn btn-primary">
              <Plus size={20} />
              Add New Bill
            </Link>
          </div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Serial No</th>
                <th>Date</th>
                <th>Customer</th>
                <th>Items Count</th>
                <th>Total Amount</th>
                <th>Tax Amount</th>
                <th>Transaction Type</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {bills.map((bill) => (
                <tr key={bill._id}>
                  <td>{bill.serialNo}</td>
                  <td>{formatDate(bill.date)}</td>
                  <td>{bill.customer?.name || 'N/A'}</td>
                  <td>{bill.items?.length || 0}</td>
                  <td>{formatCurrency(bill.totalAmount)}</td>
                  <td>{formatCurrency(bill.taxAmount)}</td>
                  <td>
                    <span className={`badge ${bill.transactionType === 'Cash' ? 'badge-success' : 'badge-primary'}`}>
                      {bill.transactionType}
                    </span>
                  </td>
                  <td>
                    <div className="table-actions">
                      <Link to={`/bills/view/${bill._id}`} className="btn btn-sm btn-secondary">
                        <Eye size={16} />
                      </Link>
                      <Link to={`/bills/edit/${bill._id}`} className="btn btn-sm btn-primary">
                        <Edit size={16} />
                      </Link>
                      <button
                        onClick={() => handleDelete(bill._id)}
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

export default BillsList;