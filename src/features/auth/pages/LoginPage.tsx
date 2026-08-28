import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../../stores/authStore';
import { Button } from '../../../components/ui/Button';
import { Layers, Shield, UserCheck, Lock, Sparkles, MapPin, CheckCircle2, FileText, Cpu, ArrowRight } from 'lucide-react';
import { AcidSquares } from '../../../components/ui/AcidSquares';
import { GsapTextAnimation } from '../../../components/ui/GsapTextAnimation';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [selectedRole, setSelectedRole] = useState<'REVENUE_OFFICER' | 'SURVEYOR' | 'CITIZEN'>('REVENUE_OFFICER');
  const [email, setEmail] = useState('officer.sharma@landrecords.gov.in');
  const [password, setPassword] = useState('••••••••••••');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      login(
        {
          id: 'USR-901',
          name: selectedRole === 'REVENUE_OFFICER' ? 'Rajesh Sharma' : selectedRole === 'SURVEYOR' ? 'Amit Verma' : 'Ramesh Patil',
          email,
          role: selectedRole,
          district: 'Pune',
          state: 'Maharashtra',
        },
        'mock-sih-token-2026'
      );
      setIsLoading(false);
      navigate('/dashboard');
    }, 800);
  };

  return (
    <div className="min-h-screen bg-slate-950 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
      {/* LEFT SIDE: Brand Title, Platform Capabilities & WebGL Shader */}
      <div className="lg:col-span-7 relative p-8 lg:p-12 flex flex-col justify-between text-white overflow-hidden bg-slate-900 border-r border-slate-800">
        {/* Interactive WebGL AcidSquares Shader */}
        <div className="absolute inset-0 z-0">
          <AcidSquares
            color1="#020617"
            color2="#0f172a"
            color3="#10b981"
            detail="medium"
            speed={0.4}
            waveDepth={1.4}
            zoom={1.5}
            density={7}
            glow={1.3}
            exposure={2600}
            spread={0.4}
            stepSize={0.003}
            colorShift={0.1}
            contrast={1.2}
            brightness={0.85}
            opacity={0.7}
            mouseInteraction={true}
            mouseStrength={0.2}
            mouseRadius={0.4}
            grain={true}
            grainIntensity={0.05}
          />
        </div>

        {/* Top Branding Header */}
        <div className="relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 px-3.5 py-1.5 rounded-full text-emerald-400 text-xs font-semibold tracking-wide backdrop-blur-md">
            <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse" /> SIH 2026 Official Submission Portal
          </div>

          <div className="space-y-3 max-w-xl">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/40 shadow-inner">
                <Layers className="w-8 h-8" />
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
                <GsapTextAnimation text="ReshiLand AI" type="split-char" stagger={0.04} />
              </h1>
            </div>

            <p className="text-base text-slate-300 font-medium leading-relaxed">
              <GsapTextAnimation
                text="Smart Land Record Digitization & Legal Discrepancy Verification Engine"
                type="stagger-words"
                stagger={0.03}
              />
            </p>
          </div>

          {/* Key Capabilities List */}
          <div className="space-y-3 pt-4 max-w-lg">
            <div className="p-3.5 bg-slate-900/80 border border-slate-800 rounded-xl backdrop-blur-md flex items-start gap-3">
              <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-lg shrink-0 mt-0.5">
                <FileText className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">Multilingual AI OCR Pipeline</h4>
                <p className="text-[11px] text-slate-400 leading-snug">
                  Automated extraction of 7/12 extracts, Ferfar mutation registers, and Khatauni title records with 98.5% accuracy.
                </p>
              </div>
            </div>

            <div className="p-3.5 bg-slate-900/80 border border-slate-800 rounded-xl backdrop-blur-md flex items-start gap-3">
              <div className="p-2 bg-purple-500/20 text-purple-400 rounded-lg shrink-0 mt-0.5">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">Cadastral GIS Map Vectorization</h4>
                <p className="text-[11px] text-slate-400 leading-snug">
                  Bhudnaksha land parcel boundary mapping, vertex alignment, and spatial overlap collision detection.
                </p>
              </div>
            </div>

            <div className="p-3.5 bg-slate-900/80 border border-slate-800 rounded-xl backdrop-blur-md flex items-start gap-3">
              <div className="p-2 bg-blue-500/20 text-blue-400 rounded-lg shrink-0 mt-0.5">
                <Cpu className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">Discrepancy & Legal Rule Engine</h4>
                <p className="text-[11px] text-slate-400 leading-snug">
                  30-year ownership chain audit, bank mortgage charge verification, and SHA-256 tamper-evident logs.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Metrics */}
        <div className="relative z-10 pt-8 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
          <div className="flex gap-6">
            <div>
              <span className="block font-bold text-white text-base">14,850+</span>
              <span>Records Digitized</span>
            </div>
            <div>
              <span className="block font-bold text-emerald-400 text-base">98.5%</span>
              <span>OCR Accuracy</span>
            </div>
            <div>
              <span className="block font-bold text-blue-400 text-base">Instant</span>
              <span>Discrepancy Check</span>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE: Clean Professional Login Input Box */}
      <div className="lg:col-span-5 flex items-center justify-center p-6 lg:p-12 bg-slate-950 relative z-10">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200">
          {/* Header */}
          <div className="bg-slate-900 p-6 text-white text-center">
            <h2 className="text-xl font-bold tracking-tight">Portal Access Sign In</h2>
            <p className="text-xs text-slate-400 mt-1">Select demo role preset or enter desk credentials</p>
          </div>

          {/* Quick Demo Role Switcher */}
          <div className="bg-slate-50 px-6 py-3 border-b border-slate-200">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 text-center">
              DEMO QUICK ROLE PRESET:
            </p>
            <div className="grid grid-cols-3 gap-2">
              {[
                { role: 'REVENUE_OFFICER', label: 'Revenue Officer' },
                { role: 'SURVEYOR', label: 'Land Surveyor' },
                { role: 'CITIZEN', label: 'Citizen / Buyer' },
              ].map((preset) => (
                <button
                  key={preset.role}
                  type="button"
                  onClick={() => setSelectedRole(preset.role as any)}
                  className={`py-2 px-2 rounded-lg text-[11px] font-bold transition-all text-center ${
                    selectedRole === preset.role
                      ? 'bg-slate-900 text-white shadow-md ring-2 ring-emerald-500/50'
                      : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="p-6 space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Official Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg pl-9 pr-3 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 font-semibold"
                  placeholder="officer@landrecords.gov.in"
                />
                <Shield className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg pl-9 pr-3 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 font-semibold"
                  placeholder="••••••••••••"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              </div>
            </div>

            <div className="flex justify-between items-center text-xs">
              <label className="flex items-center gap-2 text-slate-600 cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded border-slate-300 text-slate-900" />
                <span className="text-[11px]">Remember Desk Session</span>
              </label>
              <a
                href="/forgot-password"
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/forgot-password');
                }}
                className="text-emerald-600 font-bold hover:underline text-[11px]"
              >
                Forgot Password?
              </a>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg transition-all"
            >
              {isLoading ? (
                <span>Authenticating Officer...</span>
              ) : (
                <>
                  <UserCheck className="w-4 h-4" /> Secure Portal Sign In
                </>
              )}
            </Button>

            <div className="pt-2 text-center border-t border-slate-100">
              <p className="text-xs text-slate-500">
                Need official desk access?{' '}
                <a
                  href="/register"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate('/register');
                  }}
                  className="text-slate-900 font-bold hover:underline"
                >
                  Register Profile
                </a>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
