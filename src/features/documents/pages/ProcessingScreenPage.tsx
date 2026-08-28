import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Sparkles, CheckCircle2, ArrowRight, FileCheck2, ShieldAlert } from 'lucide-react';
import { BarLoader } from '../../../components/ui/BarLoader';

export const ProcessingScreenPage: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(15);

  const steps = [
    { name: "Image Preprocessing & De-skewing", desc: "Adaptive binarization & noise reduction" },
    { name: "Multilingual OCR Engine (Indic-OCR)", desc: "Extracting Devanagari / English text bounding boxes" },
    { name: "Named Entity Recognition (NER)", desc: "Mapping Owner names, Khata numbers, Survey numbers, Area" },
    { name: "Cadastral Boundary Map Vectorization", desc: "Extracting polygon coordinates from map drawing" },
    { name: "Cross-Database Discrepancy Validation", desc: "Comparing extracted OCR with legacy government land DB" },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        const next = prev + 20;
        if (next > 20 && next <= 40) setCurrentStep(1);
        if (next > 40 && next <= 65) setCurrentStep(2);
        if (next > 65 && next <= 85) setCurrentStep(3);
        if (next > 85) setCurrentStep(4);
        return next;
      });
    }, 900);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="max-w-2xl mx-auto space-y-6 pt-6">
      <Card className="text-center p-8 space-y-6 border-slate-200 shadow-lg">
        <div className="relative inline-block">
          {progress < 100 ? (
            <div className="bg-emerald-950/90 p-6 rounded-2xl shadow-xl border border-emerald-800/40 inline-flex flex-col items-center gap-3">
              <BarLoader barColor="bg-emerald-400" height="h-10" width="w-2" />
              <span className="text-[11px] font-bold text-emerald-300 tracking-wider uppercase">Processing Land Scan</span>
            </div>
          ) : (
            <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto shadow-inner border border-emerald-300">
              <CheckCircle2 className="w-10 h-10" />
            </div>
          )}
        </div>

        <div>
          <h2 className="text-xl font-bold text-slate-900">
            {progress < 100 ? "AI Neural OCR Pipeline Running..." : "Document Processing Complete!"}
          </h2>
          <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
            Processing Saat Bara (7/12) Extract #142/A for Haveli Taluka, Pune District.
          </p>
        </div>

        {/* Live Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-semibold text-slate-700">
            <span>Overall Pipeline Progress</span>
            <span className="text-emerald-600">{progress}%</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden p-0.5 border border-slate-200">
            <div
              className="bg-gradient-to-r from-emerald-500 to-blue-600 h-full rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Pipeline Step List */}
        <div className="space-y-3 text-left border-t border-slate-100 pt-5">
          {steps.map((step, idx) => {
            const isDone = idx < currentStep || progress === 100;
            const isCurrent = idx === currentStep && progress < 100;

            return (
              <div
                key={idx}
                className={`p-3 rounded-xl border transition-all flex items-center justify-between ${
                  isDone
                    ? 'bg-emerald-50/50 border-emerald-200 text-emerald-950'
                    : isCurrent
                    ? 'bg-blue-50/50 border-blue-300 text-blue-950 shadow-xs'
                    : 'bg-slate-50/30 border-slate-100 text-slate-400'
                }`}
              >
                <div className="flex items-center gap-3">
                  {isDone ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  ) : isCurrent ? (
                    <BarLoader barColor="bg-blue-500" height="h-4" width="w-1" />
                  ) : (
                    <div className="w-5 h-5 rounded-full border-2 border-slate-300 flex items-center justify-center text-[10px] font-bold shrink-0">
                      {idx + 1}
                    </div>
                  )}
                  <div>
                    <p className="text-xs font-bold">{step.name}</p>
                    <p className="text-[11px] opacity-75">{step.desc}</p>
                  </div>
                </div>

                {isDone && <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100/60 px-2 py-0.5 rounded">PASSED</span>}
              </div>
            );
          })}
        </div>

        {/* Action Button once complete */}
        {progress === 100 && (
          <div className="pt-2 animate-in fade-in slide-in-from-bottom-2">
            <Button
              onClick={() => navigate('/digitization/extracted-data')}
              className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-lg"
            >
              <span>View AI Extracted Data & Confidence Scores</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
};
