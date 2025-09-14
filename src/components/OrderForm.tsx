import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import axios from 'axios';

interface FormData {
  customerName: string;
  customerPhone: string;
  pizzaName: string;
}

interface LambdaResponse {
  message: string;
  method: string;
  timestamp: string;
}

function OrderForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();
  const [response, setResponse] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      const apiUrl = `${process.env.REACT_APP_API_URL}/api/orders`;
        
      const result = await axios.post<LambdaResponse>(apiUrl, {
        customerName: data.customerName,
        customerPhone: data.customerPhone,
        pizzaName: data.pizzaName
      });
      
      if (result.data && result.data.message) {
        setResponse(result.data.message);
      } else {
        setResponse('No response received');
      }
    } catch (error) {
      setResponse('Error connecting to backend');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Silvestri's Pizza
          </h1>
          <Link
            to="/orders"
            className="inline-block bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200 ease-in-out text-sm"
          >
            View All Orders
          </Link>
        </div>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label htmlFor="customerName" className="block text-sm font-medium text-gray-700 mb-2">
              Customer Name
            </label>
            <input
              {...register('customerName', { required: 'Customer name is required' })}
              type="text"
              id="customerName"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 ease-in-out"
              placeholder="Enter your name..."
            />
            {errors.customerName && (
              <p className="text-red-500 text-sm mt-1">{errors.customerName.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="customerPhone" className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number
            </label>
            <input
              {...register('customerPhone', { required: 'Phone number is required' })}
              type="tel"
              id="customerPhone"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 ease-in-out"
              placeholder="555-1234"
            />
            {errors.customerPhone && (
              <p className="text-red-500 text-sm mt-1">{errors.customerPhone.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="pizzaName" className="block text-sm font-medium text-gray-700 mb-2">
              Pizza Selection
            </label>
            <select
              {...register('pizzaName', { required: 'Please select a pizza' })}
              id="pizzaName"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 ease-in-out"
            >
              <option value="">Select a pizza...</option>
              <option value="Margherita">Margherita</option>
              <option value="Pepperoni">Pepperoni</option>
              <option value="Supreme">Supreme</option>
              <option value="Hawaiian">Hawaiian</option>
              <option value="Meat Lovers">Meat Lovers</option>
              <option value="Veggie">Veggie</option>
            </select>
            {errors.pizzaName && (
              <p className="text-red-500 text-sm mt-1">{errors.pizzaName.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 ease-in-out transform hover:scale-105 disabled:scale-100"
          >
            {loading ? 'Placing Order...' : 'Place Order'}
          </button>
        </form>

        {response && (
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <h3 className="font-medium text-green-800 mb-2">Order Status:</h3>
            <p className="text-green-700">{response}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default OrderForm;