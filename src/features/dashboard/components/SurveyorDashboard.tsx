import React from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { MapWidget } from './MapWidget';
import { MapPin, UploadCloud, Compass, Layers, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const SurveyorDashboard: React.FC = () => {
  const surveyTasks = [
    { id: 'SURV-401', village: 'Haveli', surveyNo: '142/A', task: 'Cadastral Boundary Polygon Vectorization', status: 'In Progress', priority: 'High' },
    { id: 'SURV-402', village: 'Mavli', surveyNo: '143/B', task: 'Field Overlap Resurvey', status: 'Pending Review', priority: 'Urgent' },
    { id: 'SURV-403', village: 'Hadapsar', surveyNo: '410/1', task: 'Drone Geo-referencing', status: 'Completed', priority: 'Normal' },
  ];

  return (
    <div className="space-y-6">
      {/* Surveyor Header Banner */}
      <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-purple-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <Compass className="w-4 h-4" /> Cadastral Land Surveyor Workbench
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Geo-Spatial Boundary Vectorization</h1>
          <p className="text-xs text-slate-300 mt-1 max-w-xl">
            Survey plot boundary mapping, drone orthomosaic alignment, and GIS coordinate polygon vectorization for Bhudnaksha.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <Link to="/documents/upload">
            <Button className="bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs flex items-center gap-2">
              <UploadCloud className="w-4 h-4" /> Upload Cadastral Map (CAD/SHP)
            </Button>
          </Link>
        </div>
      </div>

      {/* Main Map & Survey Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8">
          <MapWidget />
        </div>

        <div className="lg:col-span-4 space-y-4">
          <Card className="p-4 space-y-3">
            <h3 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-2">Surveyor Quick Tools</h3>
            <div className="space-y-2">
              <button className="w-full text-left p-3 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors text-xs flex items-center justify-between">
                <span className="font-semibold text-slate-800">Adjust Polygon Vertices</span>
                <span className="text-[10px] bg-purple-50 text-purple-700 font-bold px-2 py-0.5 rounded">Active</span>
              </button>
              <button className="w-full text-left p-3 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors text-xs flex items-center justify-between">
                <span className="font-semibold text-slate-800">Run Overlap Collision Test</span>
                <span className="text-[10px] bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded">GIS GNN</span>
              </button>
              <button className="w-full text-left p-3 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors text-xs flex items-center justify-between">
                <span className="font-semibold text-slate-800">Export GeoJSON / KML</span>
                <span className="text-[10px] bg-blue-50 text-blue-700 font-bold px-2 py-0.5 rounded">Format</span>
              </button>
            </div>
          </Card>

          <Card className="p-4 bg-slate-900 text-white space-y-2">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
              <CheckCircle2 className="w-4 h-4" /> 142 Plots Vectorized
            </div>
            <p className="text-xs text-slate-300">
              Haveli Taluka cadastral map grid fully synchronized with ISRO Bhuvan satellite imagery.
            </p>
          </Card>
        </div>
      </div>

      {/* Assigned Survey Tasks */}
      <Card className="p-0 overflow-hidden border-slate-200">
        <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
          <h3 className="font-bold text-slate-900 text-sm">Assigned Field Survey Assignments</h3>
          <span className="text-xs text-slate-500">3 Pending Tasks</span>
        </div>
        <div className="divide-y divide-slate-100">
          {surveyTasks.map((task) => (
            <div key={task.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors text-xs">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-50 text-purple-700 rounded-lg">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-bold text-slate-900">{task.task} - Survey No. {task.surveyNo}</p>
                  <p className="text-[11px] text-slate-500">{task.village} Village • Task ID: {task.id}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                  task.priority === 'Urgent' ? 'bg-rose-100 text-rose-700' : 'bg-blue-100 text-blue-700'
                }`}>
                  {task.priority}
                </span>
                <Button size="sm" variant="outline" className="text-xs py-1 px-3">
                  Open GIS Editor
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
