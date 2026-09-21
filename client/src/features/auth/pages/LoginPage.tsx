import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../../../stores/authStore';
import { Button } from '../../../components/ui/Button';
import { Shield, User, Lock, Mail, ArrowRight, AlertCircle, CheckCircle2, FileText, Landmark, Sparkles } from 'lucide-react';
import api from '../../../lib/axios';
import { APP_NAME, APP_TAGLINE, PROTOTYPE_NOTICE } from '../../../lib/constants';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [selectedRole, setSelectedRole] = useState<'REVENUE_OFFICER' | 'CITIZEN'>('CITIZEN');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Clear any residual values on visit so fields are always clean and empty
  React.useEffect(() => {
    localStorage.removeItem('bhoomix_login_email');
    localStorage.removeItem('bhoomix_login_password');
    localStorage.removeItem('bhoomix_reg_draft');
  }, []);

  const handleRoleTab = (role: 'REVENUE_OFFICER' | 'CITIZEN') => {
    setSelectedRole(role);
    setErrorMsg(null);
    setEmail('');
    setPassword('');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);

    try {
      const res = await api.post('/auth/login', {
        email: email.trim(),
        password,
      });

      const { access_token, user } = res.data;

      if (selectedRole === 'REVENUE_OFFICER' && user.role !== 'REVENUE_OFFICER') {
        setErrorMsg('Access denied: This account does not possess Revenue Officer administrative privileges.');
        setIsLoading(false);
        return;
      }

      if (selectedRole === 'CITIZEN' && user.role !== 'CITIZEN') {
        setErrorMsg('Access denied: This account is not a Citizen account.');
        setIsLoading(false);
        return;
      }

      login(user, access_token);
      navigate('/dashboard');
    } catch (err: any) {
      let msg = 'Authentication failed. Please verify credentials.';
      if (err.response?.data?.detail) {
        msg = err.response.data.detail;
      } else if (err.message && (err.message.includes('Network') || err.code === 'ERR_NETWORK')) {
        msg = 'Unable to connect to BhoomiX backend server. Please verify backend is running on http://localhost:5000.';
      }
      setErrorMsg(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-between font-sans">
      {/* Official Government Top Bar */}
      <div className="bg-[#0b2545] text-white py-2.5 px-6 border-b-2 border-emerald-500 shadow-md">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-semibold tracking-wide">GOVERNMENT OF TAMIL NADU</span>
            <span className="text-slate-400">•</span>
            <span className="text-slate-300">Revenue & Disaster Management Department</span>
          </div>
          <div className="flex items-center gap-3 text-[11px] text-slate-300">
            <span className="bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-mono border border-emerald-500/30">
              State: Tamil Nadu
            </span>
            <span>Digital Land Administration Suite</span>
          </div>
        </div>
      </div>

      {/* Main Login Card Container */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <div className="max-w-4xl w-full bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden grid grid-cols-1 lg:grid-cols-12">
          
          {/* Left Hero Panel: Government Branding */}
          <div className="lg:col-span-6 bg-gradient-to-br from-[#0b2545] via-[#133c6d] to-[#0b2545] text-white p-8 sm:p-10 flex flex-col justify-between relative overflow-hidden">
            <div className="space-y-6 relative z-10">
              {/* Emblem Header */}
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/20 backdrop-blur-md flex items-center justify-center text-emerald-400 shadow-inner">
                  <Landmark className="w-7 h-7" />
                </div>
                <div>
                  <h2 className="text-2xl font-extrabold tracking-tight text-white flex items-center gap-2">
                    {APP_NAME}
                    <span className="text-[10px] bg-emerald-500 text-slate-900 font-bold px-2 py-0.5 rounded uppercase">
                      TN Portal
                    </span>
                  </h2>
                  <p className="text-[11px] text-slate-300 font-medium">நில நிர்வாக மற்றும் சரிபார்ப்பு அமைப்பு</p>
                </div>
              </div>

              {/* Title & Description */}
              <div className="space-y-2 pt-2">
                <h3 className="text-lg font-bold text-slate-100 leading-snug">
                  AI-Powered Historical Land Record Digitization & Revenue Verification System
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  A secure, citizen-to-revenue-officer platform for digitizing handwritten land deeds, performing field-by-field reference cross-checks, and issuing prototype verification approval forms.
                </p>
              </div>

              {/* Key Features List */}
              <div className="space-y-2.5 pt-2 text-xs text-slate-200">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Multilingual Indic-OCR with structured field parsing</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Automated reference cross-check against Tamil Nadu land database</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Transparent discrepancy alerts & Revenue Officer manual verification</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Official prototype approval form PDF generation with QR validation</span>
                </div>
              </div>
            </div>

            {/* Prototype Disclaimer Notice */}
            <div className="mt-8 pt-4 border-t border-white/10 relative z-10">
              <div className="p-3 bg-amber-500/15 border border-amber-400/30 rounded-xl text-[11px] text-amber-200 leading-snug">
                ⚠️ <b>Prototype Notice:</b> {PROTOTYPE_NOTICE}. Reference records are simulated for academic/demonstration purposes.
              </div>
            </div>
          </div>

          {/* Right Form Panel: Authentication Form */}
          <div className="lg:col-span-6 p-8 sm:p-10 flex flex-col justify-center bg-white">
            <div className="max-w-md w-full mx-auto space-y-6">
              
              <div>
                <h3 className="text-xl font-bold text-slate-900">Portal Authentication</h3>
                <p className="text-xs text-slate-500 mt-1">Please log in to access your dashboard and records</p>
              </div>

              {/* Role Selection Tabs */}
              <div className="grid grid-cols-2 gap-2 p-1.5 bg-slate-100 rounded-xl border border-slate-200">
                <button
                  type="button"
                  onClick={() => handleRoleTab('REVENUE_OFFICER')}
                  className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-bold transition-all ${
                    selectedRole === 'REVENUE_OFFICER'
                      ? 'bg-[#0b2545] text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Shield className="w-4 h-4" />
                  Revenue Officer
                </button>
                <button
                  type="button"
                  onClick={() => handleRoleTab('CITIZEN')}
                  className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-bold transition-all ${
                    selectedRole === 'CITIZEN'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <User className="w-4 h-4" />
                  Citizen Portal
                </button>
              </div>

              {errorMsg && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-rose-700 text-xs">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {selectedRole === 'REVENUE_OFFICER' ? 'Officer Email / Official ID' : 'Citizen Registered Email'}
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      name="email"
                      autoComplete="username"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg pl-9 pr-3.5 py-2.5 text-xs text-slate-900 font-medium focus:outline-none focus:border-[#0b2545] focus:bg-white transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      required
                      name="password"
                      autoComplete="current-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg pl-9 pr-3.5 py-2.5 text-xs text-slate-900 font-medium focus:outline-none focus:border-[#0b2545] focus:bg-white transition"
                    />
                  </div>
                </div>


                <Button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full py-2.5 text-xs font-bold rounded-lg flex items-center justify-center gap-2 shadow-md transition ${
                    selectedRole === 'REVENUE_OFFICER'
                      ? 'bg-[#0b2545] hover:bg-[#133c6d] text-white'
                      : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                  }`}
                >
                  {isLoading ? (
                    'Verifying Credentials...'
                  ) : (
                    <>
                      <span>Sign In as {selectedRole === 'REVENUE_OFFICER' ? 'Revenue Officer' : 'Citizen'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </Button>
              </form>

              {/* Registration Links */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-center text-xs text-slate-600 space-y-1">
                <div>Don't have a registered account yet?</div>
                <div className="flex justify-center items-center gap-3 pt-0.5 font-bold text-xs">
                  <Link to="/register" className="text-emerald-700 hover:underline">
                    Register as Citizen
                  </Link>
                  <span className="text-slate-300">•</span>
                  <Link to="/register" className="text-[#0b2545] hover:underline">
                    Register as Revenue Officer
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Official Footer */}
      <footer className="bg-white border-t border-slate-200 py-3 px-6 text-center text-xs text-slate-500">
        <p>© 2026 BhoomiX – Tamil Nadu Land Records AI Digitization Initiative • Smart India Hackathon Prototype</p>
      </footer>
    </div>
  );
};
