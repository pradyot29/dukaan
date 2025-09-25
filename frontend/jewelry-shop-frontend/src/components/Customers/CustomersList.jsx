import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { customerService } from '../../services/customerService';

const CustomersList = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const response = await customerService.getAllCustomers();
      setCustomers(response.data);
    } catch (error) {
      console.error('Error fetching customers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      try {
        await customerService.deleteCustomer(id);
        setCustomers(customers.filter(customer => customer._id !== id));
      } catch (error) {
        console.error('Error deleting customer:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="page-container">
        <div className="loading">Loading customers...</div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Customers</h1>
        <Link to="/customers/new" className="btn btn-primary">
          <Plus size={20} />
          Add New Customer
        </Link>
      </div>

      <div className="table-container">
        {customers.length === 0 ? (
          <div className="empty-state">
            <h3>No customers found</h3>
            <p>Add your first customer to get started</p>
            <Link to="/customers/new" className="btn btn-primary">
              <Plus size={20} />
              Add New Customer
            </Link>
          </div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Phone</th>
                <th>Address</th>
                <th>Shop</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer) => (
                <tr key={customer._id}>
                  <td>{customer.name}</td>
                  <td>{customer.phone || 'N/A'}</td>
                  <td>{customer.address || 'N/A'}</td>
                  <td>{customer.shop?.name || 'N/A'}</td>
                  <td>
                    <div className="table-actions">
                      <Link to={`/customers/edit/${customer._id}`} className="btn btn-sm btn-primary">
                        <Edit size={16} />
                      </Link>
                      <button
                        onClick={() => handleDelete(customer._id)}
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

export default CustomersList;