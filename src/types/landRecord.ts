export interface LandOwner {
  name: string;
  sharePercentage: number;
  khataNumber: string;
  aadhaarHash?: string;
}

export interface GeoCoordinates {
  lat: number;
  lng: number;
}

export interface LandRecord {
  id: string;
  plotId: string;
  surveyNumber: string;
  subDivision: string;
  state: string;
  district: string;
  taluka: string;
  village: string;
  owners: LandOwner[];
  areaHectares: number;
  landCategory: 'Agricultural' | 'Non-Agricultural' | 'Commercial' | 'Forest' | 'Government';
  encumbranceStatus: 'Clear' | 'Mortgaged' | 'Disputed' | 'Leased';
  marketValueEst: number;
  centerCoordinates: GeoCoordinates;
  boundaryCoordinates: GeoCoordinates[];
  verifiedAt?: string;
  verifiedBy?: string;
  blockchainHash?: string;
}
