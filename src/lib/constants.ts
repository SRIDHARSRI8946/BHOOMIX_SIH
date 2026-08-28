export const APP_NAME = "ReshiLand AI";
export const APP_TAGLINE = "Smart Land Record Digitization, Verification & AI Validation Platform";

export const DOCUMENT_TYPES = [
  { id: "7_12_extract", name: "7/12 Extract (Saat Bara)", code: "7/12" },
  { id: "khatauni", name: "Khatauni Record", code: "KHT" },
  { id: "jamabandi", name: "Jamabandi Extract", code: "JMB" },
  { id: "mutation_register", name: "Mutation Register (Ferfar)", code: "MUT" },
  { id: "cadastral_map", name: "Cadastral Map (Bhudnaksha)", code: "MAP" },
  { id: "title_deed", name: "Sale Deed / Title Deed", code: "DEED" },
  { id: "encumbrance_cert", name: "Encumbrance Certificate (EC)", code: "EC" },
];

export const STATES_DISTRICTS: Record<string, string[]> = {
  "Maharashtra": ["Pune", "Nagpur", "Nashik", "Thane", "Chhatrapati Sambhajinagar", "Satara"],
  "Karnataka": ["Bengaluru Urban", "Mysuru", "Belagavi", "Dharwad", "Mangaluru"],
  "Uttar Pradesh": ["Lucknow", "Varanasi", "Kanpur", "Gorakhpur", "Agra"],
  "Gujarat": ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Gandhinagar"],
  "Rajasthan": ["Jaipur", "Jodhpur", "Udaipur", "Kota", "Bikaner"],
};

export const STATUS_COLORS = {
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  processing: "bg-blue-50 text-blue-700 border-blue-200",
  digitized: "bg-emerald-50 text-emerald-700 border-emerald-200",
  verified: "bg-purple-50 text-purple-700 border-purple-200",
  discrepancy: "bg-rose-50 text-rose-700 border-rose-200",
  rejected: "bg-red-50 text-red-700 border-red-200",
};
