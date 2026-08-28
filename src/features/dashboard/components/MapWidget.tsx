import React from 'react';
import { Card } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { MapPin, ShieldCheck, AlertTriangle } from 'lucide-react';
import { Map, MapControls, MapMarker, MarkerContent, MarkerPopup, MarkerLabel } from '@/components/ui/map';

export const MapWidget: React.FC = () => {
  // Pune Haveli Region Coordinates [longitude, latitude]
  const center: [number, number] = [73.8567, 18.5204];

  const surveyPlots = [
    {
      id: '142/A',
      title: 'Survey No. 142/A',
      owner: 'Rameshwar Patil',
      area: '1.4500 Hectares',
      status: 'Verified',
      lng: 73.8570,
      lat: 18.5215,
      color: 'bg-emerald-500',
    },
    {
      id: '143/B',
      title: 'Survey No. 143/B',
      owner: 'Suresh Deshmukh',
      area: '0.9200 Hectares',
      status: 'Discrepancy Flagged',
      lng: 73.8554,
      lat: 18.5200,
      color: 'bg-rose-500',
    },
    {
      id: '410/1',
      title: 'Survey No. 410/1',
      owner: 'Hadapsar Co-op Society',
      area: '2.1000 Hectares',
      status: 'In Review',
      lng: 73.8590,
      lat: 18.5190,
      color: 'bg-amber-500',
    },
  ];

  return (
    <Card className="h-[440px] flex flex-col p-4 border-slate-200">
      <div className="flex justify-between items-center pb-3 border-b border-slate-100 mb-3">
        <div>
          <h3 className="font-semibold text-slate-900 text-base flex items-center gap-2">
            <MapPin className="w-4 h-4 text-emerald-600" />
            Cadastral Parcel GIS Map (Bhudnaksha)
          </h3>
          <p className="text-xs text-slate-500">
            Interactive land parcel vector markers & survey plot coordinates
          </p>
        </div>
        <div className="flex gap-2">
          <Badge variant="verified">142 Plots Mapped</Badge>
          <Badge variant="discrepancy">1 Overlap Flag</Badge>
        </div>
      </div>

      <div className="flex-1 rounded-xl overflow-hidden relative border border-slate-200 shadow-inner">
        <Map center={center} zoom={14.5} className="h-full w-full">
          <MapControls showZoom showCompass showLocate showFullscreen position="bottom-right" />

          {surveyPlots.map((plot) => (
            <MapMarker key={plot.id} longitude={plot.lng} latitude={plot.lat}>
              <MarkerContent>
                <div className={`relative h-5 w-5 rounded-full border-2 border-white ${plot.color} shadow-lg animate-pulse flex items-center justify-center`}>
                  <div className="w-2 h-2 bg-white rounded-full" />
                </div>
              </MarkerContent>
              <MarkerLabel position="top">{plot.id}</MarkerLabel>
              <MarkerPopup closeButton>
                <div className="p-1 space-y-1">
                  <p className="font-bold text-slate-900 text-xs">{plot.title}</p>
                  <p className="text-[11px] text-slate-600">Owner: {plot.owner}</p>
                  <p className="text-[11px] text-slate-600">Area: {plot.area}</p>
                  <div className="pt-1">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        plot.status === 'Verified'
                          ? 'bg-emerald-100 text-emerald-700'
                          : plot.status === 'Discrepancy Flagged'
                          ? 'bg-rose-100 text-rose-700'
                          : 'bg-amber-100 text-amber-700'
                      }`}
                    >
                      {plot.status}
                    </span>
                  </div>
                </div>
              </MarkerPopup>
            </MapMarker>
          ))}
        </Map>
      </div>
    </Card>
  );
};

export default MapWidget;
