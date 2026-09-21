import React, { useState } from 'react';
import { Card } from '../../../components/ui/Card';

interface ThroughputItem {
  day: string;
  processed: number;
  verified: number;
}

interface Props {
  data?: ThroughputItem[];
}

const DEFAULT_DATA: ThroughputItem[] = [
  { day: 'Mon', processed: 105, verified: 72 },
  { day: 'Tue', processed: 178, verified: 164 },
  { day: 'Wed', processed: 240, verified: 230 },
  { day: 'Thu', processed: 312, verified: 298 },
  { day: 'Fri', processed: 290, verified: 280 },
  { day: 'Sat', processed: 152, verified: 146 },
  { day: 'Sun', processed: 94, verified: 88 },
];

export const WeeklyThroughputCard: React.FC<Props> = ({ data = DEFAULT_DATA }) => {
  const chartData = data && data.length === 7 ? data : DEFAULT_DATA;
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const maxVal = 320;
  const yTicks = [320, 240, 160, 0];

  return (
    <Card className="h-[430px] flex flex-col p-5 bg-white rounded-2xl border-slate-200 shadow-xs justify-between">
      {/* Header */}
      <div className="flex justify-between items-center pb-3 border-b border-slate-100">
        <div>
          <h3 className="font-bold text-slate-900 text-sm sm:text-base">
            Weekly Digitization Throughput
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Document records processed vs verified per day
          </p>
        </div>
        <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200/80">
          This Week
        </span>
      </div>

      {/* Chart Body */}
      <div className="flex-1 pt-6 pb-2 px-1 flex flex-col justify-end relative">
        {/* Hover Tooltip display */}
        {hoveredIndex !== null && (
          <div className="absolute top-1 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[11px] px-3 py-1 rounded-lg shadow-lg pointer-events-none z-20 flex items-center gap-3 animate-fade-in">
            <span className="font-bold text-slate-200">{chartData[hoveredIndex].day}:</span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-slate-400" />
              <span>{chartData[hoveredIndex].processed} Processed</span>
            </span>
            <span className="flex items-center gap-1 text-emerald-400 font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>{chartData[hoveredIndex].verified} Verified</span>
            </span>
          </div>
        )}

        {/* Chart Area with Grid Lines */}
        <div className="relative flex-1 flex">
          {/* Y-Axis scale */}
          <div className="w-8 flex flex-col justify-between text-right pr-2 text-[10px] font-mono text-slate-400 select-none pb-5">
            {yTicks.map((tick) => (
              <span key={tick}>{tick}</span>
            ))}
          </div>

          {/* Grid area and Bars */}
          <div className="flex-1 relative flex flex-col justify-between pb-5">
            {/* Horizontal Grid lines */}
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-5">
              <div className="border-b border-slate-100 w-full" />
              <div className="border-b border-slate-100 w-full" />
              <div className="border-b border-slate-100 w-full" />
              <div className="border-b border-slate-200 w-full" />
            </div>

            {/* Day Columns */}
            <div className="relative h-full flex justify-between items-end px-2 sm:px-4 z-10">
              {chartData.map((item, idx) => {
                const processedHeight = Math.min(100, Math.max(4, (item.processed / maxVal) * 100));
                const verifiedHeight = Math.min(100, Math.max(4, (item.verified / maxVal) * 100));
                const isHovered = hoveredIndex === idx;

                return (
                  <div
                    key={item.day}
                    className="flex flex-col items-center h-full justify-end cursor-pointer group"
                    onMouseEnter={() => setHoveredIndex(idx)}
                    onMouseLeave={() => setHoveredIndex(null)}
                  >
                    {/* Dual Bars container */}
                    <div className="flex items-end gap-1 sm:gap-1.5 h-full pb-1">
                      {/* Dark Processed Bar */}
                      <div
                        style={{ height: `${processedHeight}%` }}
                        className={`w-3 sm:w-4 bg-slate-900 rounded-t-sm transition-all duration-300 ${
                          isHovered ? 'bg-slate-700 shadow-md scale-y-105' : 'hover:bg-slate-800'
                        }`}
                        title={`${item.day} Processed: ${item.processed}`}
                      />
                      {/* Green Verified Bar */}
                      <div
                        style={{ height: `${verifiedHeight}%` }}
                        className={`w-3 sm:w-4 bg-emerald-500 rounded-t-sm transition-all duration-300 ${
                          isHovered ? 'bg-emerald-400 shadow-md scale-y-105' : 'hover:bg-emerald-400'
                        }`}
                        title={`${item.day} Verified: ${item.verified}`}
                      />
                    </div>

                    {/* Day label */}
                    <span
                      className={`text-[11px] mt-2 transition-colors font-medium ${
                        isHovered ? 'text-emerald-700 font-bold' : 'text-slate-500'
                      }`}
                    >
                      {item.day}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Legend */}
      <div className="pt-2 border-t border-slate-100 flex items-center justify-center gap-6 text-xs text-slate-600">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-xs bg-slate-900" />
          <span className="font-medium text-slate-700">Records Processed</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-xs bg-emerald-500" />
          <span className="font-medium text-slate-700">Records Verified</span>
        </div>
      </div>
    </Card>
  );
};
