import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { User, Mail, Lock, Building, FileText, UserCheck, Loader2, ArrowRight } from 'lucide-react';
import AuthLayout from '../components/AuthLayout';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'BIDDER',
    companyName: '',
    registrationNumber: ''
  });
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
      const res = await axios.post('http://localhost:5000/api/auth/register', formData);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      
      if (res.data.user.role === 'CRPF_OFFICER') {
        navigate('/dashboard/officer');
      } else {
        navigate('/dashboard/bidder');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Portal Registration" subtitle="Join the CRPF digital procurement ecosystem">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded text-red-700 text-sm">
            {error}
          </div>
        )}

        <div className="flex gap-2 p-1 bg-gray-100 rounded-xl mb-4">
          <button
            type="button"
            onClick={() => setFormData({ ...formData, role: 'BIDDER' })}
            className={`flex-1 py-2 px-4 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2 ${
              formData.role === 'BIDDER' ? 'bg-white shadow-sm text-crpf-dark' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Building className="w-4 h-4" />
            Bidder
          </button>
          <button
            type="button"
            onClick={() => setFormData({ ...formData, role: 'CRPF_OFFICER' })}
            className={`flex-1 py-2 px-4 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2 ${
              formData.role === 'CRPF_OFFICER' ? 'bg-white shadow-sm text-crpf-dark' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            Officer
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1 ml-1">Full Name</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <User className="h-5 w-5" />
              </div>
              <input name="name" required className="input-field pl-10 py-2.5" placeholder="John Doe" value={formData.name} onChange={handleChange} />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1 ml-1">Email Address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <Mail className="h-5 w-5" />
              </div>
              <input name="email" type="email" required className="input-field pl-10 py-2.5" placeholder="john@example.com" value={formData.email} onChange={handleChange} />
            </div>
          </div>

          {formData.role === 'BIDDER' && (
            <>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1 ml-1">Company Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <Building className="h-5 w-5" />
                  </div>
                  <input name="companyName" required className="input-field pl-10 py-2.5" placeholder="Tech Solutions Pvt Ltd" value={formData.companyName} onChange={handleChange} />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1 ml-1">Registration Number</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <FileText className="h-5 w-5" />
                  </div>
                  <input name="registrationNumber" required className="input-field pl-10 py-2.5" placeholder="GSTIN / CIN Number" value={formData.registrationNumber} onChange={handleChange} />
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1 ml-1">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <Lock className="h-5 w-5" />
              </div>
              <input name="password" type="password" required className="input-field pl-10 py-2.5" placeholder="••••••••" value={formData.password} onChange={handleChange} />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full py-3 mt-4"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Complete Registration <ArrowRight className="w-5 h-5" /></>}
        </button>

        <p className="text-center text-gray-600 mt-4 text-sm">
          Already registered?{' '}
          <Link to="/login" className="text-crpf-dark font-bold hover:underline">
            Login here
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
};

export default Register;
