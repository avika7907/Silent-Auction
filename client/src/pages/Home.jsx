import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { initSocket, connectSocket, getSocket } from '../utils/socket';

const Home = () => {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('active');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchItems();
    
    // Initialize socket for real-time updates
    const socket = initSocket();
    connectSocket();

    // Listen for new bids across all items
    socket.on('new-bid', (data) => {
      setItems(prevItems =>
        prevItems.map(item =>
          item._id === data.itemId
            ? { ...item, currentBid: data.currentBid }
            : item
        )
      );
    });

    return () => {
      if (socket) {
        socket.off('new-bid');
      }
    };
  }, []);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const params = {};
      if (search) params.search = search;
      if (filter) params.status = filter;
      
      const response = await api.get('/items', { params });
      setItems(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch items');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchItems();
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [search, filter]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading items...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Auction Items</h1>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            placeholder="Search items..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="">All Items</option>
            <option value="active">Active</option>
            <option value="closed">Closed</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {items.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No items found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <Link
              key={item._id}
              to={`/item/${item._id}`}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
                  <span
                    className={`px-2 py-1 text-xs rounded ${
                      item.status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {item.status}
                  </span>
                </div>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {item.description}
                </p>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-xs text-gray-500">Current Bid</p>
                    <p className="text-xl font-bold text-primary-600">
                      ${item.currentBid || item.startingBid}
                    </p>
                  </div>
                  {item.status === 'closed' && item.winner && (
                    <div className="text-right">
                      <p className="text-xs text-gray-500">Winner</p>
                      <p className="text-sm font-semibold text-green-600">
                        {item.winner.username}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
