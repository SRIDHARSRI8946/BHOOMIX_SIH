import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Layers, User, Mail, Lock, Building, MapPin, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { AcidSquares } from '../../../components/ui/AcidSquares';
import { GsapTextAnimation } from '../../../components/ui/GsapTextAnimation';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'REVENUE_OFFICER',
    department: 'Revenue & Land Reforms',
    state: 'Maharashtra',
    district: 'Pune',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Officer Account Registration Request Submitted! Redirecting to Login...');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* WebGL AcidSquares Dynamic Shader Background */}
      <div className="absolute inset-0 z-0">
        <AcidSquares
          color1="#020617"
          color2="#0f172a"
          color3="#10b981"
          detail="medium"
          speed={0.5}
          waveDepth={1.3}
          zoom={1.4}
          density={8}
          glow={1.2}
          exposure={2700}
          spread={0.4}
          stepSize={0.003}
          colorShift={0.1}
          contrast={1.1}
          brightness={0.85}
          opacity={0.75}
          mouseInteraction={true}
          mouseStrength={0.15}
          mouseRadius={0.35}
          grain={true}
          grainIntensity={0.06}
        />
      </div>

      <div className="max-w-md w-full bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl overflow-hidden border border-slate-700/30 relative z-10 my-8">
        <div className="bg-slate-900/95 p-6 text-white text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl"></div>
          <div className="inline-flex p-3 bg-emerald-500/20 text-emerald-400 rounded-xl mb-2 border border-emerald-500/30 shadow-inner">
            <Layers className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-bold tracking-tight">
            <GsapTextAnimation text="Officer Registration Portal" type="split-char" stagger={0.03} />
          </h2>
          <p className="text-xs text-slate-300 mt-1">Register new government revenue official or surveyor profile</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-3.5">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Full Official Name</label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg pl-9 pr-3 py-2 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-slate-900"
                placeholder="Dr. Anand Patil"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Official Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg pl-9 pr-3 py-2 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-slate-900"
                placeholder="anand.patil@gov.in"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Role Designation</label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-2 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-slate-900"
              >
                <option value="REVENUE_OFFICER">Revenue Officer</option>
                <option value="SURVEYOR">Land Surveyor</option>
                <option value="ADMIN">System Admin</option>
                <option value="CITIZEN">Citizen User</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">District</label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={formData.district}
                  onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg pl-8 pr-2 py-2 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Create Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg pl-9 pr-3 py-2 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>
          </div>

          <Button type="submit" className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md mt-2">
            Submit Officer Registration
          </Button>

          <p className="text-center text-xs text-slate-500 pt-2">
            Already registered? <Link to="/login" className="text-slate-900 font-bold hover:underline">Log In</Link>
          </p>
        </form>
      </div>
    </div>
  );
};
