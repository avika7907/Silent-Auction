import React, { useState, useEffect } from 'react';
import api from '../utils/api';

const AdminPanel = () => {
  const [items, setItems] = useState([]);
  const [winners, setWinners] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    imageUrl: '',
    startingBid: ''
  });

  useEffect(() => {
    fetchItems();
    fetchWinners();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await api.get('/items');
      setItems(response.data);
    } catch (err) {
      console.error('Failed to fetch items:', err);
    }
  };

  const fetchWinners = async () => {
    try {
      const response = await api.get('/admin/winners');
      setWinners(response.data);
    } catch (err) {
      console.error('Failed to fetch winners:', err);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleAddItem = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await api.post('/items', {
        ...formData,
        startingBid: parseFloat(formData.startingBid)
      });
      
      setSuccess('Item added successfully!');
      setFormData({ title: '', description: '', imageUrl: '', startingBid: '' });
      setShowAddForm(false);
      fetchItems();
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add item');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteItem = async (itemId) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;

    try {
      await api.delete(`/items/${itemId}`);
      setSuccess('Item deleted successfully!');
      fetchItems();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete item');
    }
  };

  const handleCloseAuction = async (itemId) => {
    if (!window.confirm('Are you sure you want to close this auction?')) return;

    try {
      const response = await api.put(`/items/${itemId}/close`);
      setSuccess(response.data.message);
      fetchItems();
      fetchWinners();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to close auction');
    }
  };

  const handleCloseAllAuctions = async () => {
    if (!window.confirm('Are you sure you want to close ALL active auctions?')) return;

    setLoading(true);
    try {
      const response = await api.post('/admin/close-all');
      setSuccess(response.data.message);
      fetchItems();
      fetchWinners();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to close auctions');
    } finally {
      setLoading(false);
    }
  };

  const handleNotifyWinners = async () => {
    if (!window.confirm('Send email notifications to all winners?')) return;

    setLoading(true);
    try {
      const response = await api.post('/admin/notify-winners');
      setSuccess(`Emails sent! Check results in console.`);
      console.log('Email Results:', response.data);
      setTimeout(() => setSuccess(''), 5000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send notifications');
    } finally {
      setLoading(false);
    }
  };

  const activeItems = items.filter(item => item.status === 'active');
  const closedItems = items.filter(item => item.status === 'closed');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Admin Panel</h1>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {success}
          </div>
        )}

        <div className="flex gap-4 flex-wrap">
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
          >
            {showAddForm ? 'Cancel' : 'Add New Item'}
          </button>
          <button
            onClick={handleCloseAllAuctions}
            disabled={loading || activeItems.length === 0}
            className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 disabled:opacity-50"
          >
            Close All Auctions
          </button>
          <button
            onClick={handleNotifyWinners}
            disabled={loading || winners.length === 0}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
          >
            Notify Winners
          </button>
        </div>
      </div>

      {/* Add Item Form */}
      {showAddForm && (
        <div className="bg-white shadow-md rounded-lg p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">Add New Auction Item</h2>
          <form onSubmit={handleAddItem} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input
                type="text"
                name="title"
                required
                value={formData.title}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                name="description"
                required
                rows="3"
                value={formData.description}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
              <input
                type="url"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="https://example.com/image.jpg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Starting Bid ($)</label>
              <input
                type="number"
                name="startingBid"
                required
                min="1"
                step="1"
                value={formData.startingBid}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 px-4 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50"
            >
              {loading ? 'Adding...' : 'Add Item'}
            </button>
          </form>
        </div>
      )}

      {/* Active Items */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Active Items ({activeItems.length})
        </h2>
        {activeItems.length === 0 ? (
          <p className="text-gray-500">No active items</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeItems.map((item) => (
              <div key={item._id} className="bg-white shadow-md rounded-lg p-4">
                <img src={item.imageUrl} alt={item.title} className="w-full h-32 object-cover rounded mb-2" />
                <h3 className="font-bold text-lg mb-1">{item.title}</h3>
                <p className="text-sm text-gray-600 mb-2 line-clamp-2">{item.description}</p>
                <p className="text-lg font-bold text-primary-600 mb-3">
                  Current: ${item.currentBid || item.startingBid}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleCloseAuction(item._id)}
                    className="flex-1 px-3 py-1 text-sm bg-yellow-600 text-white rounded hover:bg-yellow-700"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => handleDeleteItem(item._id)}
                    className="flex-1 px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Winners List */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Winners ({winners.length})
        </h2>
        {winners.length === 0 ? (
          <p className="text-gray-500">No winners yet</p>
        ) : (
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Item</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Winner</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {winners.map((winner) => (
                  <tr key={winner.itemId}>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{winner.itemTitle}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{winner.winnerUsername}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{winner.winnerEmail}</td>
                    <td className="px-6 py-4 text-sm font-bold text-green-600">${winner.winningAmount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Closed Items */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Closed Items ({closedItems.length})
        </h2>
        {closedItems.length === 0 ? (
          <p className="text-gray-500">No closed items</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {closedItems.map((item) => (
              <div key={item._id} className="bg-gray-50 shadow rounded-lg p-4">
                <h3 className="font-bold text-lg mb-1">{item.title}</h3>
                <p className="text-sm text-gray-600 mb-2">Final: ${item.winningAmount || 'No bids'}</p>
                <p className="text-sm text-green-600">
                  Winner: {item.winner ? item.winner.username : 'None'}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
