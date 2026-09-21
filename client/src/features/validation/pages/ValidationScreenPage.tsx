import React, { useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { ShieldCheck, CheckCircle2, AlertOctagon, Scale, FileText, ArrowRight, Layers } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const ValidationScreenPage: React.FC = () => {
  const navigate = useNavigate();
  const [isValidating, setIsValidating] = useState(false);

  const rules = [
    {
      ruleId: 'RULE-01',
      title: 'Ownership Chain Continuity Check',
      desc: 'Verifying 30-year unbroken ownership chain from Ferfar Mutation registers',
      status: 'passed',
      confidence: 100,
    },
    {
      ruleId: 'RULE-02',
      title: 'Land Ceiling Act Compliance (Agricultural)',
      desc: 'Checking total land holding limit does not exceed 54 acres limit per family',
      status: 'passed',
      confidence: 100,
    },
    {
      ruleId: 'RULE-03',
      title: 'GIS Cadastral Spatial Boundary Overlap',
      desc: 'Checking polygon overlap with neighboring Survey plots #141 and #143',
      status: 'passed',
      confidence: 99.4,
    },
    {
      ruleId: 'RULE-04',
      title: 'Bank Loan Encumbrance Clearance',
      desc: 'Validating active charge/mortgage against State Bank of India NOC',
      status: 'warning',
      descExtra: 'Active mortgage of Rs. 4,50,000 recorded - Conditional Clearance Granted',
      confidence: 95.0,
    },
    {
      ruleId: 'RULE-05',
      title: 'Zoning & Land Use Category Consistency',
      desc: 'Ensuring agricultural land is not fraudulently registered as non-agricultural',
      status: 'passed',
      confidence: 100,
    },
  ];

  const handleFinalSignoff = () => {
    setIsValidating(true);
    setTimeout(() => {
      navigate('/land-records');
    }, 800);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 text-blue-600 text-xs font-semibold uppercase tracking-wider mb-1">
            <Scale className="w-4 h-4" /> AI Statutory Rule & Legal Validation Engine
          </div>
          <h1 className="text-xl font-bold text-slate-900">Legal Compliance & Cadastral Validation</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Automated verification of land ceiling limits, encumbrances, ownership continuity, and spatial overlaps for Survey #142/A.
          </p>
        </div>
        <Badge variant="verified" className="px-3 py-1 text-xs">
          4/5 Rules Cleared
        </Badge>
      </div>

      {/* Rules Grid */}
      <div className="space-y-3">
        {rules.map((rule) => (
          <Card key={rule.ruleId} className="p-4 border-slate-200 hover:shadow-sm transition-all">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div
                  className={`p-2.5 rounded-xl shrink-0 ${
                    rule.status === 'passed' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                  }`}
                >
                  {rule.status === 'passed' ? <CheckCircle2 className="w-5 h-5" /> : <AlertOctagon className="w-5 h-5" />}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold text-slate-400">{rule.ruleId}</span>
                    <h3 className="font-bold text-slate-900 text-sm">{rule.title}</h3>
                  </div>
                  <p className="text-xs text-slate-600 mt-0.5">{rule.desc}</p>
                  {rule.descExtra && (
                    <p className="text-xs font-semibold text-amber-700 mt-1 bg-amber-50 p-1.5 rounded border border-amber-200">
                      {rule.descExtra}
                    </p>
                  )}
                </div>
              </div>

              <div className="text-right shrink-0">
                <span
                  className={`inline-block text-[11px] font-bold px-2.5 py-0.5 rounded capitalize ${
                    rule.status === 'passed' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                  }`}
                >
                  {rule.status}
                </span>
                <p className="text-[10px] text-slate-400 mt-1">{rule.confidence}% Confidence</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Final Officer Action */}
      <Card className="bg-slate-900 text-white p-6 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h3 className="font-bold text-base text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" /> Issue Verified Digital Land Passbook
          </h3>
          <p className="text-xs text-slate-300 mt-1">
            Sign off with digital Revenue Officer certificate and push record to public GIS Cadastral Registry.
          </p>
        </div>
        <Button
          onClick={handleFinalSignoff}
          isLoading={isValidating}
          className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2.5 px-6 text-xs shrink-0 flex items-center gap-2 shadow-lg"
        >
          <span>Approve & Issue Land Record</span>
          <ArrowRight className="w-4 h-4" />
        </Button>
      </Card>
    </div>
  );
};
