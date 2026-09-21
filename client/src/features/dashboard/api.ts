export interface DashboardStats {
  totalRecordsDigitized: number;
  pendingVerifications: number;
  discrepanciesFlagged: number;
  averageOcrConfidence: number;
  districtAccuracyRate: number;
}

export const getDashboardStats = async (): Promise<DashboardStats> => {
  return {
    totalRecordsDigitized: 14850,
    pendingVerifications: 42,
    discrepanciesFlagged: 9,
    averageOcrConfidence: 96.4,
    districtAccuracyRate: 98.2,
  };
};
