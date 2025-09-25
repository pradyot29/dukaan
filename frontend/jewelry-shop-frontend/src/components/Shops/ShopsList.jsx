import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { shopService } from '../../services/shopService';

const ShopsList = () => {
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchShops();
  }, []);

  const fetchShops = async () => {
    try {
      setLoading(true);
      const response = await shopService.getAllShops();
      setShops(response.data);
    } catch (error) {
      console.error('Error fetching shops:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this shop?')) {
      try {
        await shopService.deleteShop(id);
        setShops(shops.filter(shop => shop._id !== id));
      } catch (error) {
        console.error('Error deleting shop:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="page-container">
        <div className="loading">Loading shops...</div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Shops</h1>
        <Link to="/shops/new" className="btn btn-primary">
          <Plus size={20} />
          Add New Shop
        </Link>
      </div>

      <div className="table-container">
        {shops.length === 0 ? (
          <div className="empty-state">
            <h3>No shops found</h3>
            <p>Add your first shop to get started</p>
            <Link to="/shops/new" className="btn btn-primary">
              <Plus size={20} />
              Add New Shop
            </Link>
          </div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Phone</th>
                <th>Address</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {shops.map((shop) => (
                <tr key={shop._id}>
                  <td>{shop.name}</td>
                  <td>{shop.phone || 'N/A'}</td>
                  <td>{shop.address || 'N/A'}</td>
                  <td>
                    <div className="table-actions">
                      <Link to={`/shops/edit/${shop._id}`} className="btn btn-sm btn-primary">
                        <Edit size={16} />
                      </Link>
                      <button
                        onClick={() => handleDelete(shop._id)}
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

export default ShopsList;