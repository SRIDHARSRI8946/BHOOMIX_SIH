import React from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { MapPin, Search, Layers, FileCheck2, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

export const LandRecordListPage: React.FC = () => {
  const records = [
    {
      id: 'REC-MH-PUN-001',
      surveyNumber: '142/A',
      owner: 'Rameshwar Mahadev Patil',
      village: 'Hadapsar, Haveli',
      district: 'Pune',
      area: '1.4500 Ha',
      category: 'Agricultural',
      status: 'verified',
    },
    {
      id: 'REC-MH-PUN-002',
      surveyNumber: '143/B',
      owner: 'Suresh Deshmukh',
      village: 'Mavli, Haveli',
      district: 'Pune',
      area: '0.9200 Ha',
      category: 'Agricultural',
      status: 'discrepancy',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 text-emerald-600 text-xs font-semibold uppercase tracking-wider mb-1">
            <MapPin className="w-4 h-4" /> Official Cadastral Land Parcel Registry
          </div>
          <h1 className="text-xl font-bold text-slate-900">Digitized & Verified Land Records</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Public digital ledger of verified land parcels, ownership shares, encumbrance certificates, and GIS maps.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {records.map((rec) => (
          <Card key={rec.id} className="p-5 border-slate-200 hover:shadow-md transition-all space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-mono font-bold text-slate-400">{rec.id}</span>
                <h3 className="text-base font-bold text-slate-900">Survey No. {rec.surveyNumber}</h3>
                <p className="text-xs text-slate-500">{rec.village}, {rec.district}</p>
              </div>
              <Badge variant={rec.status as any}>{rec.status}</Badge>
            </div>

            <div className="bg-slate-50 p-3 rounded-lg text-xs space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-500">Primary Owner:</span>
                <span className="font-semibold text-slate-900">{rec.owner}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Land Area:</span>
                <span className="font-bold text-slate-900">{rec.area}</span>
              </div>
            </div>

            <div className="pt-1 flex justify-between items-center">
              <span className="text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-medium">
                GIS Polygons Vectorized
              </span>
              <Button size="sm" variant="outline" className="text-xs py-1 px-3">
                Inspect GIS Parcel
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
