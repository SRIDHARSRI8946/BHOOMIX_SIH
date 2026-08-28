import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { KeyRound, Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import { Button } from '../../../components/ui/Button';

export const ForgotPasswordPage: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-6 text-center">
        <div className="inline-flex p-3 bg-blue-50 text-blue-600 rounded-xl mb-3">
          <KeyRound className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Reset Portal Password</h2>
        <p className="text-xs text-slate-500 mt-1 mb-6">Enter your registered email address to receive password reset instructions.</p>

        {submitted ? (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-xl text-xs space-y-2">
            <CheckCircle className="w-6 h-6 text-emerald-600 mx-auto" />
            <p className="font-semibold">Reset Link Sent!</p>
            <p>If an account exists for that email, password recovery instructions have been sent.</p>
            <Link to="/login" className="inline-block mt-3 text-emerald-700 font-bold hover:underline">Return to Sign In</Link>
          </div>
        ) : (
          <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }} className="space-y-4 text-left">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Official Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="officer@gov.in"
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>
            </div>
            <Button type="submit" className="w-full py-2.5 bg-slate-900 text-white font-medium">Send Reset Link</Button>
            <div className="text-center pt-2">
              <Link to="/login" className="text-xs text-slate-600 hover:text-slate-900 inline-flex items-center gap-1 font-medium">
                <ArrowLeft className="w-3.5 h-3.5" /> Back to Login
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
