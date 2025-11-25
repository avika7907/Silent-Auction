import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { getSocket } from '../utils/socket';

const ItemDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [item, setItem] = useState(null);
  const [bids, setBids] = useState([]);
  const [bidAmount, setBidAmount] = useState('');
  const [loading, setLoading] = useState(true);
  const [bidding, setBidding] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchItemDetails();
    fetchBids();

    // Join socket room for this item
    const socket = getSocket();
    if (socket) {
      socket.emit('join-auction', id);

      socket.on('new-bid', (data) => {
        if (data.itemId === id) {
          setItem(prev => ({ ...prev, currentBid: data.currentBid }));
          setBids(prev => [data.bid, ...prev]);
        }
      });

      return () => {
        socket.emit('leave-auction', id);
        socket.off('new-bid');
      };
    }
  }, [id]);

  const fetchItemDetails = async () => {
    try {
      const response = await api.get(`/items/${id}`);
      setItem(response.data);
      setBidAmount(response.data.currentBid + 1);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch item');
    } finally {
      setLoading(false);
    }
  };

  const fetchBids = async () => {
    try {
      const response = await api.get(`/bids/item/${id}`);
      setBids(response.data);
    } catch (err) {
      console.error('Failed to fetch bids:', err);
    }
  };

  const handlePlaceBid = async (e) => {
    e.preventDefault();
    
    if (!user) {
      navigate('/login');
      return;
    }

    setError('');
    setSuccess('');
    setBidding(true);

    try {
      await api.post('/bids', {
        itemId: id,
        amount: parseFloat(bidAmount)
      });
      
      setSuccess('Bid placed successfully!');
      setBidAmount(parseFloat(bidAmount) + 1);
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to place bid');
    } finally {
      setBidding(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Item not found</div>
      </div>
    );
  }

  const isUserWinning = bids.length > 0 && bids[0].bidder._id === user?._id;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button
        onClick={() => navigate('/')}
        className="mb-4 text-primary-600 hover:text-primary-800"
      >
        ← Back to items
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Item Details */}
        <div>
          <img
            src={item.imageUrl}
            alt={item.title}
            className="w-full h-96 object-cover rounded-lg shadow-md"
          />
        </div>

        <div>
          <div className="flex justify-between items-start mb-4">
            <h1 className="text-3xl font-bold text-gray-900">{item.title}</h1>
            <span
              className={`px-3 py-1 text-sm rounded ${
                item.status === 'active'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              {item.status}
            </span>
          </div>

          <p className="text-gray-600 mb-6">{item.description}</p>

          <div className="bg-gray-50 p-6 rounded-lg mb-6">
            <div className="mb-4">
              <p className="text-sm text-gray-500">Starting Bid</p>
              <p className="text-2xl font-bold text-gray-900">${item.startingBid}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Current Highest Bid</p>
              <p className="text-3xl font-bold text-primary-600">
                ${item.currentBid || item.startingBid}
              </p>
            </div>
          </div>

          {item.status === 'closed' ? (
            <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
              <p className="font-semibold text-yellow-800">Auction Closed</p>
              {item.winner && (
                <p className="text-yellow-700">
                  Winner: {item.winner.username} - ${item.winningAmount}
                </p>
              )}
            </div>
          ) : user ? (
            <div>
              {isUserWinning && (
                <div className="bg-green-50 border border-green-200 p-3 rounded-lg mb-4">
                  <p className="text-green-800 font-semibold">🎉 You're currently winning!</p>
                </div>
              )}
              
              <form onSubmit={handlePlaceBid} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Place Your Bid
                  </label>
                  <input
                    type="number"
                    step="1"
                    min={item.currentBid + 1}
                    value={bidAmount}
                    onChange={(e) => setBidAmount(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Enter bid amount"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Minimum bid: ${(item.currentBid || item.startingBid) + 1}
                  </p>
                </div>

                {error && (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    {error}
                  </div>
                )}

                {success && (
                  <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                    {success}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={bidding}
                  className="w-full py-3 px-4 bg-primary-600 text-white font-semibold rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50"
                >
                  {bidding ? 'Placing Bid...' : 'Place Bid'}
                </button>
              </form>
            </div>
          ) : (
            <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
              <p className="text-blue-800">
                Please <button onClick={() => navigate('/login')} className="underline font-semibold">login</button> to place a bid
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Bid History */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Bid History</h2>
        {bids.length === 0 ? (
          <p className="text-gray-500">No bids yet. Be the first to bid!</p>
        ) : (
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Bidder
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Time
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {bids.map((bid, index) => (
                  <tr
                    key={bid._id}
                    className={index === 0 ? 'bg-green-50' : ''}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className="text-sm font-medium text-gray-900">
                          {bid.bidder.username}
                        </span>
                        {index === 0 && (
                          <span className="ml-2 px-2 py-1 text-xs bg-green-100 text-green-800 rounded">
                            Winning
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-bold text-gray-900">
                        ${bid.amount}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(bid.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ItemDetail;
