import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '../../../components/ui/Button';
import { Landmark, ShieldCheck, User, Shield, ArrowRight, AlertCircle, CheckCircle2, Lock, Phone, Mail, MapPin } from 'lucide-react';
import api from '../../../lib/axios';
import { APP_NAME, STATES_DISTRICTS } from '../../../lib/constants';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();

  // All fields start completely empty on page visit
  const [selectedRole, setSelectedRole] = useState<'CITIZEN' | 'REVENUE_OFFICER'>('CITIZEN');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [district, setDistrict] = useState('Dharmapuri');
  const [address, setAddress] = useState('');
  const [officerCode, setOfficerCode] = useState('');
  const [designation, setDesignation] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Clear any residual draft on visit so fields are always clean
  React.useEffect(() => {
    localStorage.removeItem('bhoomix_reg_draft');
    localStorage.removeItem('bhoomix_login_email');
    localStorage.removeItem('bhoomix_login_password');
  }, []);

  const handleRoleTab = (role: 'CITIZEN' | 'REVENUE_OFFICER') => {
    setSelectedRole(role);
    setErrorMsg(null);
    setSuccessMsg(null);
    // Explicitly wipe all inputs so Citizen details NEVER contaminate Revenue Officer fields
    setFullName('');
    setEmail('');
    setPhone('');
    setAddress('');
    setPassword('');
    setConfirmPassword('');
    if (role === 'REVENUE_OFFICER') {
      setDesignation('Tahsildar / Revenue Divisional Officer');
      setOfficerCode(`RO-${district.slice(0, 3).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`);
    } else {
      setDesignation('');
      setOfficerCode('');
    }
  };

  const handleDistrictChange = (d: string) => {
    setDistrict(d);
    if (selectedRole === 'REVENUE_OFFICER') {
      setOfficerCode(`RO-${d.slice(0, 3).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    // Client-side validations
    if (!fullName.trim() || !email.trim() || !phone.trim() || !password) {
      setErrorMsg('All mandatory fields are required.');
      return;
    }

    if (selectedRole === 'CITIZEN' && !address.trim()) {
      setErrorMsg('Please enter your residential address.');
      return;
    }

    if (selectedRole === 'REVENUE_OFFICER' && !officerCode.trim()) {
      setErrorMsg('Please enter your Revenue Officer Code / ID.');
      return;
    }

    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      setErrorMsg('Please enter a valid 10-digit mobile number.');
      return;
    }

    setIsLoading(true);

    try {
      await api.post('/api/auth/register', {
        full_name: fullName.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        password,
        confirm_password: confirmPassword,
        role: selectedRole,
        district,
        address: address.trim(),
        officer_code: officerCode.trim(),
        designation: designation.trim(),
      });

      // Ensure clean state for login
      localStorage.removeItem('bhoomix_reg_draft');
      localStorage.removeItem('bhoomix_login_email');
      localStorage.removeItem('bhoomix_login_password');

      const roleLabel = selectedRole === 'REVENUE_OFFICER' ? 'Revenue Officer' : 'Citizen';
      setSuccessMsg(`Registration successful as ${roleLabel}! Redirecting to Login...`);
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch (err: any) {
      console.error('Registration error details:', err);
      let msg = 'Registration failed. Please try again.';
      if (err.response?.data?.detail) {
        msg = err.response.data.detail;
      } else if (err.message && (err.message.includes('Network') || err.code === 'ERR_NETWORK')) {
        msg = 'Unable to connect to BhoomiX backend server. Please verify the service is running.';
      }
      setErrorMsg(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const tnDistricts = STATES_DISTRICTS['Tamil Nadu'] || [];

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
            <span>Land Administration Enrollment</span>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <div className="max-w-4xl w-full bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden grid grid-cols-1 lg:grid-cols-12">
          
          {/* Left Hero Panel */}
          <div className="lg:col-span-5 bg-gradient-to-br from-[#0b2545] via-[#133c6d] to-[#0b2545] text-white p-8 flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-emerald-400 shadow-inner">
                  <Landmark className="w-7 h-7" />
                </div>
                <div>
                  <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
                    {APP_NAME}
                    <span className="text-[10px] bg-emerald-500 text-slate-900 font-bold px-2 py-0.5 rounded uppercase">
                      TN Portal
                    </span>
                  </h1>
                  <p className="text-[11px] text-slate-300">நில நிர்வாக மற்றும் பதிவு முகப்பு</p>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <h2 className="text-lg font-bold text-slate-100">
                  {selectedRole === 'REVENUE_OFFICER'
                    ? 'Revenue Officer Jurisdiction Enrollment'
                    : 'Digitize Historical Tamil Nadu Land Records'}
                </h2>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {selectedRole === 'REVENUE_OFFICER'
                    ? 'Enroll as an official Revenue Officer, select your Tamil Nadu district jurisdiction, and access the verification command center.'
                    : 'Register as a citizen to upload scanned patta/chitta deeds, review Indic-OCR extractions, and track official verification approvals.'}
                </p>
              </div>

              <div className="space-y-2.5 pt-2 text-xs text-slate-200">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Strictly Tamil Nadu 38 district jurisdictions</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Role-based access: Citizen or Revenue Officer</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Secure SHA-256 audit ledger integration</span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-white/10 text-[11px] text-slate-400">
              © 2026 BhoomiX – Smart India Hackathon Prototype
            </div>
          </div>

          {/* Right Form Panel */}
          <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-center bg-white max-h-[85vh] overflow-y-auto">
            <div className="max-w-md w-full mx-auto space-y-4">
              <div>
                <h3 className="text-xl font-bold text-slate-900">Portal Registration</h3>
                <p className="text-xs text-slate-500 mt-0.5">Select your role to enroll in the digital system</p>
              </div>

              {/* Role Selection Tabs */}
              <div className="grid grid-cols-2 gap-2 p-1.5 bg-slate-100 rounded-xl border border-slate-200">
                <button
                  type="button"
                  onClick={() => handleRoleTab('CITIZEN')}
                  className={`flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all ${
                    selectedRole === 'CITIZEN'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <User className="w-4 h-4" />
                  Citizen
                </button>
                <button
                  type="button"
                  onClick={() => handleRoleTab('REVENUE_OFFICER')}
                  className={`flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all ${
                    selectedRole === 'REVENUE_OFFICER'
                      ? 'bg-[#0b2545] text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Shield className="w-4 h-4" />
                  Revenue Officer
                </button>
              </div>

              {errorMsg && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-rose-700 text-xs">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {successMsg && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-emerald-700 text-xs">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{successMsg}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-3">
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {selectedRole === 'REVENUE_OFFICER' ? 'Officer Full Name & Title' : 'Citizen Full Name (as per Land Deed)'}
                  </label>
                  <input
                    type="text"
                    required
                    name="full_name"
                    autoComplete="name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 font-medium focus:outline-none focus:border-[#0b2545] focus:bg-white transition"
                  />
                </div>

                {/* Email & Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {selectedRole === 'REVENUE_OFFICER' ? 'Official Email' : 'Email Address'}
                    </label>
                    <input
                      type="email"
                      required
                      name="email"
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 font-medium focus:outline-none focus:border-[#0b2545] focus:bg-white transition"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Mobile Number</label>
                    <input
                      type="tel"
                      required
                      name="phone"
                      autoComplete="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Enter 10-digit mobile number"
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 font-medium focus:outline-none focus:border-[#0b2545] focus:bg-white transition"
                    />
                  </div>
                </div>

                {/* District Jurisdiction Selector */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {selectedRole === 'REVENUE_OFFICER' ? 'Tamil Nadu District Jurisdiction' : 'Tamil Nadu District'}
                  </label>
                  <select
                    value={district}
                    onChange={(e) => handleDistrictChange(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 font-bold focus:outline-none focus:border-[#0b2545] focus:bg-white transition"
                  >
                    {tnDistricts.map((d) => (
                      <option key={d} value={d}>{d} District</option>
                    ))}
                  </select>
                </div>

                {/* Role Specific Fields */}
                {selectedRole === 'REVENUE_OFFICER' ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Officer Code / Official ID</label>
                      <input
                        type="text"
                        required
                        name="officer_code"
                        value={officerCode}
                        onChange={(e) => setOfficerCode(e.target.value)}
                        placeholder="Enter officer ID"
                        className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 font-mono font-bold focus:outline-none focus:border-[#0b2545] focus:bg-white transition"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Official Designation</label>
                      <input
                        type="text"
                        required
                        name="designation"
                        value={designation}
                        onChange={(e) => setDesignation(e.target.value)}
                        placeholder="Enter designation"
                        className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 font-medium focus:outline-none focus:border-[#0b2545] focus:bg-white transition"
                      />
                    </div>
                  </div>
                ) : (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Residential Address (Village / Taluk)</label>
                    <textarea
                      required
                      rows={2}
                      name="address"
                      autoComplete="street-address"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Enter residential address"
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-900 font-medium focus:outline-none focus:border-[#0b2545] focus:bg-white transition"
                    />
                  </div>
                )}

                {/* Password & Confirm */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
                    <input
                      type="password"
                      required
                      name="password"
                      autoComplete="new-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter password"
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 font-medium focus:outline-none focus:border-[#0b2545] focus:bg-white transition"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Confirm Password</label>
                    <input
                      type="password"
                      required
                      name="confirm_password"
                      autoComplete="new-password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-enter password"
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 font-medium focus:outline-none focus:border-[#0b2545] focus:bg-white transition"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full text-white font-bold text-xs py-2.5 rounded-lg flex items-center justify-center gap-2 shadow-md transition ${
                    selectedRole === 'REVENUE_OFFICER'
                      ? 'bg-[#0b2545] hover:bg-[#133c6d]'
                      : 'bg-emerald-600 hover:bg-emerald-500'
                  }`}
                >
                  {isLoading ? 'Processing Registration...' : (
                    <>
                      <span>Register as {selectedRole === 'REVENUE_OFFICER' ? 'Revenue Officer' : 'Citizen'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </Button>
              </form>

              <div className="text-center text-xs text-slate-600 pt-1">
                Already registered?{' '}
                <Link to="/login" className="text-[#0b2545] hover:underline font-bold">
                  Sign In to Your Account
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <footer className="bg-white border-t border-slate-200 py-3 px-6 text-center text-xs text-slate-500">
        <p>© 2026 BhoomiX – Tamil Nadu Land Records AI Digitization Initiative • Smart India Hackathon Prototype</p>
      </footer>
    </div>
  );
};
