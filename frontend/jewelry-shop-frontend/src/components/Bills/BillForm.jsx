import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Plus, Minus, ArrowLeft } from 'lucide-react';
import { billService } from '../../services/billService';
import { customerService } from '../../services/customerService';

const BillForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    serialNo: '',
    date: new Date().toISOString().split('T')[0],
    customer: '',
    items: [{
      itemName: '',
      quantity: 1,
      price: 0,
      quality: '',
      description: ''
    }],
    transactionType: 'Cash',
    signature: ''
  });

  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchCustomers();
    if (isEdit) {
      fetchBill();
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

  const fetchBill = async () => {
    try {
      setLoading(true);
      const response = await billService.getBillById(id);
      const bill = response.data;
      setFormData({
        ...bill,
        date: new Date(bill.date).toISOString().split('T')[0],
        customer: bill.customer?._id || ''
      });
    } catch (error) {
      console.error('Error fetching bill:', error);
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

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...formData.items];
    updatedItems[index] = {
      ...updatedItems[index],
      [field]: value
    };
    setFormData(prev => ({
      ...prev,
      items: updatedItems
    }));
  };

  const addItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, {
        itemName: '',
        quantity: 1,
        price: 0,
        quality: '',
        description: ''
      }]
    }));
  };

  const removeItem = (index) => {
    if (formData.items.length > 1) {
      setFormData(prev => ({
        ...prev,
        items: prev.items.filter((_, i) => i !== index)
      }));
    }
  };

  const calculateTotals = () => {
    const totalAmountWithoutTax = formData.items.reduce((sum, item) => {
      return sum + (item.quantity * item.price);
    }, 0);
    
    const taxAmount = totalAmountWithoutTax * 0.18; // 18% tax
    const totalAmount = totalAmountWithoutTax + taxAmount;
    
    return {
      totalAmountWithoutTax,
      taxAmount,
      totalAmount
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const { totalAmountWithoutTax, taxAmount, totalAmount } = calculateTotals();
      
      const billData = {
        ...formData,
        totalAmountWithoutTax,
        taxAmount,
        totalAmount
      };

      if (isEdit) {
        await billService.updateBill(id, billData);
      } else {
        await billService.createBill(billData);
      }

      navigate('/bills');
    } catch (error) {
      console.error('Error saving bill:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const { totalAmountWithoutTax, taxAmount, totalAmount } = calculateTotals();

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
        <h1 className="page-title">{isEdit ? 'Edit Bill' : 'Create New Bill'}</h1>
        <Link to="/bills" className="btn btn-secondary">
          <ArrowLeft size={20} />
          Back to Bills
        </Link>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Serial No *</label>
              <input
                type="text"
                name="serialNo"
                value={formData.serialNo}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>
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
          </div>

          <div className="form-group">
            <label className="form-label">Items</label>
            {formData.items.map((item, index) => (
              <div key={index} className="item-row">
                <div className="form-group">
                  <input
                    type="text"
                    placeholder="Item Name"
                    value={item.itemName}
                    onChange={(e) => handleItemChange(index, 'itemName', e.target.value)}
                    className="form-control"
                  />
                </div>
                <div className="form-group">
                  <input
                    type="number"
                    placeholder="Quantity"
                    value={item.quantity}
                    onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value) || 0)}
                    className="form-control"
                    min="1"
                  />
                </div>
                <div className="form-group">
                  <input
                    type="number"
                    placeholder="Price"
                    value={item.price}
                    onChange={(e) => handleItemChange(index, 'price', parseFloat(e.target.value) || 0)}
                    className="form-control"
                    step="0.01"
                    min="0"
                  />
                </div>
                <div className="form-group">
                  <input
                    type="text"
                    placeholder="Quality"
                    value={item.quality}
                    onChange={(e) => handleItemChange(index, 'quality', e.target.value)}
                    className="form-control"
                  />
                </div>
                <div className="form-group">
                  <input
                    type="text"
                    placeholder="Description"
                    value={item.description}
                    onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                    className="form-control"
                  />
                </div>
                <div className="item-actions">
                  <button
                    type="button"
                    onClick={() => removeItem(index)}
                    className="btn btn-sm btn-danger"
                    disabled={formData.items.length === 1}
                  >
                    <Minus size={16} />
                  </button>
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={addItem}
              className="btn btn-secondary add-item-btn"
            >
              <Plus size={16} />
              Add Item
            </button>
          </div>

          <div className="form-group">
            <label className="form-label">Signature</label>
            <textarea
              name="signature"
              value={formData.signature}
              onChange={handleChange}
              className="form-control"
              rows="3"
            />
          </div>

          {/* Totals Summary */}
          <div className="form-group">
            <div style={{ background: '#f8f9fa', padding: '16px', borderRadius: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span>Amount Without Tax:</span>
                <span>₹ {totalAmountWithoutTax.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span>Tax Amount (18%):</span>
                <span>₹ {taxAmount.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '18px' }}>
                <span>Total Amount:</span>
                <span>₹ {totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button
              type="submit"
              className="btn btn-success"
              disabled={submitting}
            >
              {submitting ? 'Saving...' : (isEdit ? 'Update Bill' : 'Create Bill')}
            </button>
            <Link to="/bills" className="btn btn-secondary">
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BillForm;