import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Mail, Lock, LogIn, Loader2 } from 'lucide-react';
import AuthLayout from '../components/AuthLayout';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', formData);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      
      // Redirect based on role
      if (res.data.user.role === 'CRPF_OFFICER') {
        navigate('/dashboard/officer');
      } else {
        navigate('/dashboard/bidder');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Welcome Back" subtitle="Secure login to your procurement dashboard">
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded text-red-700 text-sm animate-pulse">
            {error}
          </div>
        )}
        
        <div className="relative">
          <label className="block text-sm font-semibold text-gray-700 mb-1 ml-1">Email Address</label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-crpf-dark transition-colors">
              <Mail className="h-5 w-5" />
            </div>
            <input
              name="email"
              type="email"
              required
              className="input-field pl-10"
              placeholder="name@company.com"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="relative">
          <label className="block text-sm font-semibold text-gray-700 mb-1 ml-1">Password</label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-crpf-dark transition-colors">
              <Lock className="h-5 w-5" />
            </div>
            <input
              name="password"
              type="password"
              required
              className="input-field pl-10"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center text-gray-600 cursor-pointer">
            <input type="checkbox" className="rounded border-gray-300 text-crpf-dark focus:ring-crpf-dark mr-2" />
            Remember me
          </label>
          <a href="#" className="text-crpf-red font-semibold hover:underline">Forgot password?</a>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full py-3.5 mt-2"
        >
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              <LogIn className="w-5 h-5" />
              Sign In to Portal
            </>
          )}
        </button>

        <p className="text-center text-gray-600 mt-6">
          Don't have an account?{' '}
          <Link to="/register" className="text-crpf-dark font-bold hover:underline">
            Register Business
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
};

export default Login;
