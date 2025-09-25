import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Edit, Printer } from 'lucide-react';
import { billService } from '../../services/billService';

const BillDetails = () => {
  const { id } = useParams();
  const [bill, setBill] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBill();
  }, [id]);

  const fetchBill = async () => {
    try {
      setLoading(true);
      const response = await billService.getBillById(id);
      setBill(response.data);
    } catch (error) {
      console.error('Error fetching bill:', error);
    } finally {
      setLoading(false);
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

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="page-container">
        <div className="loading">Loading bill...</div>
      </div>
    );
  }

  if (!bill) {
    return (
      <div className="page-container">
        <div className="empty-state">
          <h3>Bill not found</h3>
          <Link to="/bills" className="btn btn-primary">
            Back to Bills
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Bill Details</h1>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={handlePrint} className="btn btn-secondary">
            <Printer size={20} />
            Print
          </button>
          <Link to={`/bills/edit/${bill._id}`} className="btn btn-primary">
            <Edit size={20} />
            Edit
          </Link>
          <Link to="/bills" className="btn btn-secondary">
            <ArrowLeft size={20} />
            Back
          </Link>
        </div>
      </div>

      <div className="card">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '32px' }}>
          <div>
            <h3 style={{ marginBottom: '16px', color: '#374151' }}>Bill Information</h3>
            <div style={{ display: 'grid', gap: '12px' }}>
              <div>
                <strong>Serial No:</strong> {bill.serialNo}
              </div>
              <div>
                <strong>Date:</strong> {formatDate(bill.date)}
              </div>
              <div>
                <strong>Transaction Type:</strong>
                <span className={`badge ${bill.transactionType === 'Cash' ? 'badge-success' : 'badge-primary'}`} style={{ marginLeft: '8px' }}>
                  {bill.transactionType}
                </span>
              </div>
            </div>
          </div>

          <div>
            <h3 style={{ marginBottom: '16px', color: '#374151' }}>Customer Information</h3>
            {bill.customer ? (
              <div style={{ display: 'grid', gap: '12px' }}>
                <div>
                  <strong>Name:</strong> {bill.customer.name}
                </div>
                <div>
                  <strong>Phone:</strong> {bill.customer.phone || 'N/A'}
                </div>
                <div>
                  <strong>Address:</strong> {bill.customer.address || 'N/A'}
                </div>
              </div>
            ) : (
              <p>No customer assigned</p>
            )}
          </div>
        </div>

        <div style={{ marginBottom: '32px' }}>
          <h3 style={{ marginBottom: '16px', color: '#374151' }}>Items</h3>
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Item Name</th>
                  <th>Quantity</th>
                  <th>Price</th>
                  <th>Quality</th>
                  <th>Description</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {bill.items?.map((item, index) => (
                  <tr key={index}>
                    <td>{item.itemName}</td>
                    <td>{item.quantity}</td>
                    <td>{formatCurrency(item.price)}</td>
                    <td>{item.quality || 'N/A'}</td>
                    <td>{item.description || 'N/A'}</td>
                    <td>{formatCurrency(item.quantity * item.price)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '24px', alignItems: 'start' }}>
          <div>
            <h3 style={{ marginBottom: '16px', color: '#374151' }}>Signature</h3>
            <div style={{ 
              minHeight: '100px', 
              border: '1px solid #d1d5db', 
              borderRadius: '8px', 
              padding: '16px',
              backgroundColor: '#f9fafb'
            }}>
              {bill.signature || 'No signature provided'}
            </div>
          </div>

          <div style={{ 
            background: '#f8f9fa', 
            padding: '24px', 
            borderRadius: '8px',
            minWidth: '300px'
          }}>
            <h3 style={{ marginBottom: '16px', color: '#374151' }}>Bill Summary</h3>
            <div style={{ display: 'grid', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Subtotal:</span>
                <span>{formatCurrency(bill.totalAmountWithoutTax)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Tax (18%):</span>
                <span>{formatCurrency(bill.taxAmount)}</span>
              </div>
              <hr />
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                fontWeight: 'bold', 
                fontSize: '18px' 
              }}>
                <span>Total:</span>
                <span>{formatCurrency(bill.totalAmount)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BillDetails;