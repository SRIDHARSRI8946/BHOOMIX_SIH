import React from 'react';
import { Card } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { MapPin, ShieldCheck, AlertTriangle } from 'lucide-react';
import { Map, MapControls, MapMarker, MarkerContent, MarkerPopup, MarkerLabel } from '@/components/ui/map';

export const MapWidget: React.FC = () => {
  // Dharmapuri, Tamil Nadu Coordinates [longitude, latitude]
  const center: [number, number] = [78.1584, 12.1211];

  const surveyPlots = [
    {
      id: '132/1',
      title: 'Survey No. 132/1',
      owner: 'R. Ananthi',
      area: '1.20 Acres',
      status: 'Verified',
      lng: 78.1590,
      lat: 12.1220,
      color: 'bg-emerald-500',
    },
    {
      id: '132/2',
      title: 'Survey No. 132/2',
      owner: 'K. Selvam',
      area: '0.85 Acres',
      status: 'In Review',
      lng: 78.1575,
      lat: 12.1205,
      color: 'bg-amber-500',
    },
    {
      id: '133',
      title: 'Survey No. 133',
      owner: 'Payanatham Village Commons',
      area: '3.40 Acres',
      status: 'Village Poramboke',
      lng: 78.1605,
      lat: 12.1195,
      color: 'bg-blue-500',
    },
  ];

  return (
    <Card className="h-[430px] flex flex-col p-5 bg-white rounded-2xl border-slate-200 shadow-xs">
      <div className="flex flex-wrap justify-between items-center pb-3 border-b border-slate-100 mb-3 gap-2">
        <div>
          <h3 className="font-bold text-slate-900 text-sm sm:text-base flex items-center gap-2">
            <MapPin className="w-4 h-4 text-emerald-600" />
            Cadastral Parcel GIS Map (Bhudnaksha)
          </h3>
          <p className="text-xs text-slate-500">
            Interactive land parcel vector markers & survey plot coordinates
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-purple-50 text-purple-700 border border-purple-200">
            142 Plots Mapped
          </span>
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            1 Overlap Flag
          </span>
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
