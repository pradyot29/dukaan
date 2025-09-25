import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { itemService } from '../../services/itemService';

const ItemsList = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const response = await itemService.getAllItems();
      setItems(response.data);
    } catch (error) {
      console.error('Error fetching items:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await itemService.deleteItem(id);
        setItems(items.filter(item => item._id !== id));
      } catch (error) {
        console.error('Error deleting item:', error);
      }
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount || 0);
  };

  if (loading) {
    return (
      <div className="page-container">
        <div className="loading">Loading items...</div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Items</h1>
        <Link to="/items/new" className="btn btn-primary">
          <Plus size={20} />
          Add New Item
        </Link>
      </div>

      <div className="table-container">
        {items.length === 0 ? (
          <div className="empty-state">
            <h3>No items found</h3>
            <p>Add your first item to get started</p>
            <Link to="/items/new" className="btn btn-primary">
              <Plus size={20} />
              Add New Item
            </Link>
          </div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Description</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Quality</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item._id}>
                  <td>{item.name}</td>
                  <td>{item.description || 'N/A'}</td>
                  <td>{item.quantity || 0}</td>
                  <td>{formatCurrency(item.price)}</td>
                  <td>{item.quality || 'N/A'}</td>
                  <td>
                    <div className="table-actions">
                      <Link to={`/items/edit/${item._id}`} className="btn btn-sm btn-primary">
                        <Edit size={16} />
                      </Link>
                      <button
                        onClick={() => handleDelete(item._id)}
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

export default ItemsList;