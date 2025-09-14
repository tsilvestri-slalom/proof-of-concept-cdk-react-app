import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

interface Order {
  customerPhone: string;
  customPizza: any[];
  customerName: string;
  orderId: string;
  timestamp: string;
  status: string;
  pizzaName: string;
}

interface OrdersResponse {
  orders: Order[];
  count: number;
}

function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const apiUrl = `${process.env.REACT_APP_API_URL}/api/orders`
        
        
      const result = await axios.get<OrdersResponse>(apiUrl);
      
      if (result.data && result.data.orders) {
        setOrders(result.data.orders);
      } else {
        setError('No orders data received');
      }
    } catch (error) {
      setError('Error fetching orders');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'received':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'preparing':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'ready':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'delivered':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading orders...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-700 mb-4">{error}</p>
          <button
            onClick={fetchOrders}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Silvestri's Pizza Orders.
          </h1>
          <p className="text-gray-600">
            Total Orders: {orders.length}
          </p>
          <Link
            to="/"
            className="inline-block bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200 ease-in-out text-sm"
          >
            Place Order
          </Link>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white rounded-xl shadow-2xl p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-600 mb-4">No Orders Found</h2>
            <p className="text-gray-500">There are currently no orders to display.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {orders.map((order) => (
              <div
                key={order.orderId}
                className="bg-white rounded-xl shadow-2xl p-6 hover:shadow-3xl transition-shadow duration-300"
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-gray-800 truncate">
                    {order.customerName}
                  </h3>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(order.status)}`}
                  >
                    {order.status.toUpperCase()}
                  </span>
                </div>

                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-gray-700">Pizza:</p>
                    <p className="text-lg text-blue-600 font-semibold">{order.pizzaName}</p>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-700">Phone:</p>
                    <p className="text-gray-600">{order.customerPhone}</p>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-700">Order ID:</p>
                    <p className="text-xs text-gray-500 font-mono break-all">{order.orderId}</p>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-700">Ordered:</p>
                    <p className="text-sm text-gray-600">{formatDate(order.timestamp)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="text-center mt-8">
          <button
            onClick={fetchOrders}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 ease-in-out transform hover:scale-105"
          >
            Refresh Orders
          </button>
        </div>
      </div>
    </div>
  );
}

export default Orders;