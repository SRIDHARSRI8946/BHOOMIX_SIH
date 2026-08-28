import React, { useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { Search, ShieldCheck, Download, FileText, CheckCircle2, AlertTriangle, ArrowRight, Home, CreditCard, Building } from 'lucide-react';
import { Link } from 'react-router-dom';

export const CitizenDashboard: React.FC = () => {
  const [searchNo, setSearchNo] = useState('142/A');
  const [searched, setSearched] = useState(true);

  return (
    <div className="space-y-6">
      {/* Citizen Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-blue-950 text-white p-6 rounded-2xl shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <Home className="w-4 h-4" /> Citizen & Property Buyer Public Portal
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Verified Land Record & Title Search</h1>
          <p className="text-xs text-slate-300 mt-1 max-w-xl">
            Search verified 7/12 Extracts, check bank mortgage encumbrances, download digitally signed land passbooks, and track mutation status online.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs flex items-center gap-2 shadow-md">
            <Download className="w-4 h-4" /> Download Digital Land Passbook
          </Button>
        </div>
      </div>

      {/* Citizen Search Bar */}
      <Card className="p-6 bg-white border-slate-200 shadow-sm space-y-4">
        <h3 className="font-bold text-slate-900 text-base">Public Property & Title Search</h3>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <input
            type="text"
            placeholder="Enter Survey / Gut No. (e.g. 142/A)"
            value={searchNo}
            onChange={(e) => setSearchNo(e.target.value)}
            className="sm:col-span-3 bg-slate-50 border border-slate-300 rounded-lg px-4 py-2.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-slate-900"
          />
          <Button onClick={() => setSearched(true)} className="bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs py-2.5 flex items-center justify-center gap-2">
            <Search className="w-4 h-4" /> Search Record
          </Button>
        </div>
      </Card>

      {/* Search Result View */}
      {searched && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Record Certificate Card */}
          <div className="lg:col-span-8 space-y-4">
            <Card className="p-6 border-slate-200 space-y-4">
              <div className="flex justify-between items-start border-b border-slate-100 pb-3">
                <div>
                  <span className="text-[10px] font-mono font-bold text-slate-400">CERTIFICATE NO: REG-MH-PUN-2024-142A</span>
                  <h3 className="text-lg font-bold text-slate-900">7/12 Extract Property Title Summary</h3>
                  <p className="text-xs text-slate-500">Haveli Taluka, Pune District, Maharashtra</p>
                </div>
                <Badge variant="verified">Digitally Verified & Cleared</Badge>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 bg-slate-50 p-4 rounded-xl text-xs">
                <div>
                  <span className="text-slate-500 block">Registered Owner:</span>
                  <span className="font-bold text-slate-900 text-sm">Rameshwar Mahadev Patil</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Survey / Gut No:</span>
                  <span className="font-bold text-slate-900 text-sm">142/A</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Land Area:</span>
                  <span className="font-bold text-slate-900 text-sm">1.4500 Ha (3.58 Acres)</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Encumbrance Status:</span>
                  <span className="font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded">SBI Loan Rs. 4.5L</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Ownership Chain:</span>
                  <span className="font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">30-Year Unbroken</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Boundary Status:</span>
                  <span className="font-bold text-slate-900">GIS Map Matched</span>
                </div>
              </div>

              <div className="pt-2 flex justify-between items-center">
                <span className="text-xs text-slate-500 flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" /> Revenue Department Digital Sign Seal Attached
                </span>
                <Link to="/documents/viewer">
                  <Button size="sm" variant="outline" className="text-xs py-1.5 px-4">
                    Inspect PDF Extract
                  </Button>
                </Link>
              </div>
            </Card>
          </div>

          {/* Citizen Quick Services */}
          <div className="lg:col-span-4 space-y-4">
            <Card className="p-5 space-y-3">
              <h3 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-2">Online Citizen Services</h3>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 hover:border-blue-500 transition-colors cursor-pointer">
                <h4 className="font-bold text-slate-900 text-xs flex items-center gap-2">
                  <FileText className="w-4 h-4 text-blue-600" /> Apply Online for Ferfar Mutation
                </h4>
                <p className="text-[11px] text-slate-500 mt-1">Submit sale deed for automated land mutation</p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 hover:border-emerald-500 transition-colors cursor-pointer">
                <h4 className="font-bold text-slate-900 text-xs flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" /> Get Encumbrance NOC Certificate
                </h4>
                <p className="text-[11px] text-slate-500 mt-1">Download official bank charge clearance certificate</p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 hover:border-purple-500 transition-colors cursor-pointer">
                <h4 className="font-bold text-slate-900 text-xs flex items-center gap-2">
                  <Building className="w-4 h-4 text-purple-600" /> Valuation & Stamp Duty Calculator
                </h4>
                <p className="text-[11px] text-slate-500 mt-1">Calculate government ready reckoner land rates</p>
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};
