import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { customerService } from '../../services/customerService';
import { shopService } from '../../services/shopService';

const CustomerForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    shop: ''
  });

  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchShops();
    if (isEdit) {
      fetchCustomer();
    }
  }, [id]);

  const fetchShops = async () => {
    try {
      const response = await shopService.getAllShops();
      setShops(response.data);
    } catch (error) {
      console.error('Error fetching shops:', error);
    }
  };

  const fetchCustomer = async () => {
    try {
      setLoading(true);
      const response = await customerService.getCustomerById(id);
      const customer = response.data;
      setFormData({
        name: customer.name,
        phone: customer.phone || '',
        address: customer.address || '',
        shop: customer.shop?._id || ''
      });
    } catch (error) {
      console.error('Error fetching customer:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (isEdit) {
        await customerService.updateCustomer(id, formData);
      } else {
        await customerService.createCustomer(formData);
      }
      navigate('/customers');
    } catch (error) {
      console.error('Error saving customer:', error);
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
        <h1 className="page-title">{isEdit ? 'Edit Customer' : 'Create New Customer'}</h1>
        <Link to="/customers" className="btn btn-secondary">
          <ArrowLeft size={20} />
          Back to Customers
        </Link>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Phone</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="form-control"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Address</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="form-control"
              rows="3"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Shop</label>
            <select
              name="shop"
              value={formData.shop}
              onChange={handleChange}
              className="form-control"
            >
              <option value="">Select Shop</option>
              {shops.map(shop => (
                <option key={shop._id} value={shop._id}>
                  {shop.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-actions">
            <button
              type="submit"
              className="btn btn-success"
              disabled={submitting}
            >
              {submitting ? 'Saving...' : (isEdit ? 'Update Customer' : 'Create Customer')}
            </button>
            <Link to="/customers" className="btn btn-secondary">
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CustomerForm;