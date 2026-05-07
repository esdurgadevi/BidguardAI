import React from 'react';
import { ShieldCheck } from 'lucide-react';

const AuthLayout = ({ children, title, subtitle }) => {
  return (
    <div className="min-h-screen bg-[#f4f7f9] flex flex-col justify-center items-center p-4">
      <div className="mb-8 text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="bg-crpf-dark p-3 rounded-xl shadow-lg shadow-crpf-dark/20">
            <ShieldCheck className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-extrabold text-crpf-dark tracking-tight">
            BidGuard <span className="text-crpf-red">AI</span>
          </h1>
        </div>
        <p className="text-gray-600 font-medium tracking-wide uppercase text-xs">
          Central Reserve Police Force (CRPF) Procurement Portal
        </p>
      </div>

      <div className="w-full max-w-md">
        <div className="glass-card">
          <div className="mb-6 text-center">
            <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
            {subtitle && <p className="text-gray-500 mt-1">{subtitle}</p>}
          </div>
          {children}
        </div>
        
        <p className="text-center text-gray-400 text-sm mt-8">
          © 2026 CRPF Procurement Division. Secure Access Only.
        </p>
      </div>
    </div>
  );
};

export default AuthLayout;
