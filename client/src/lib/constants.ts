export const APP_NAME = "BhoomiX";
export const APP_TAGLINE = "AI-Powered Historical Land Record Digitization & Revenue Verification System";
export const PROTOTYPE_NOTICE = "PROTOTYPE VERIFICATION RECORD – NOT A GOVERNMENT CERTIFICATE";
export const DEMO_DATA_NOTICE = "Prototype Reference Database – Demo data only – not connected to live government land records.";
export const OCR_DISCLAIMER = "OCR confidence indicates how confidently the system extracted information from the uploaded document. It does not confirm the legal correctness of the record.";

// Jurisdiction strictly restricted to Tamil Nadu state and districts
export const STATES_DISTRICTS: Record<string, string[]> = {
  "Tamil Nadu": [
    "Dharmapuri",
    "Salem",
    "Krishnagiri",
    "Erode",
    "Coimbatore",
    "Chennai",
    "Madurai",
    "Tiruchirappalli",
    "Tirunelveli",
    "Vellore",
    "Thanjavur",
    "Dindigul",
    "Cuddalore",
    "Kanchipuram",
    "Tiruvannamalai",
    "Namakkal",
    "Karur",
    "The Nilgiris",
    "Theni",
    "Virudhunagar",
    "Ramanathapuram",
    "Sivaganga",
    "Thoothukudi",
    "Kanniyakumari",
    "Pudukkottai",
    "Nagapattinam",
    "Tiruvarur",
    "Perambalur",
    "Ariyalur",
    "Tiruppur",
    "Chengalpattu",
    "Tirupathur",
    "Ranipet",
    "Tenkasi",
    "Kallakurichi",
    "Mayiladuthurai",
    "Viluppuram"
  ],
};

export const DOCUMENT_TYPES = [
  { id: "patta_extract", name: "Patta / Chitta Extract (பட்டா / சிட்டா)", code: "PTA" },
  { id: "sale_deed", name: "Historical Sale Deed (கிரய பத்திரம்)", code: "DEED" },
  { id: "a_register", name: "A-Register Extract (அ-பதிவேடு)", code: "AREG" },
  { id: "tslr_extract", name: "Town Survey Land Register (TSLR)", code: "TSLR" },
  { id: "fmb_sketch", name: "Field Measurement Book (FMB / வரைபடம்)", code: "FMB" },
  { id: "encumbrance_cert", name: "Encumbrance Certificate (வில்லங்கச் சான்று)", code: "EC" },
];

export const STATUS_COLORS: Record<string, string> = {
  DRAFT: "bg-slate-100 text-slate-700 border-slate-300",
  UPLOADED: "bg-blue-50 text-blue-700 border-blue-200",
  OCR_PROCESSING: "bg-indigo-50 text-indigo-700 border-indigo-200",
  OCR_COMPLETED: "bg-cyan-50 text-cyan-700 border-cyan-200",
  READY_FOR_SUBMISSION: "bg-teal-50 text-teal-700 border-teal-200",
  SUBMITTED_TO_OFFICER: "bg-amber-50 text-amber-700 border-amber-200",
  UNDER_REVIEW: "bg-purple-50 text-purple-700 border-purple-200",
  MANUAL_VERIFICATION_REQUIRED: "bg-orange-50 text-orange-700 border-orange-200",
  UNDER_MANUAL_VERIFICATION: "bg-red-50 text-red-700 border-red-300 font-bold",
  MANUAL_VERIFICATION_COMPLETED: "bg-emerald-50 text-emerald-800 border-emerald-300 font-bold",
  DISCREPANCY_DETECTED: "bg-rose-50 text-rose-700 border-rose-200",
  APPROVED: "bg-emerald-50 text-emerald-700 border-emerald-200 font-bold",
  REJECTED: "bg-red-50 text-red-700 border-red-200",
};

export const MATCH_STATUS_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  MATCH: { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200" },
  POSSIBLE_MATCH: { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200" },
  MISMATCH: { bg: "bg-rose-50", text: "text-rose-700", border: "border-rose-200" },
  NOT_AVAILABLE: { bg: "bg-slate-100", text: "text-slate-600", border: "border-slate-300" },
  MANUAL_VERIFICATION_REQUIRED: { bg: "bg-amber-50", text: "text-amber-800", border: "border-amber-300" },
  UNDER_MANUAL_VERIFICATION: { bg: "bg-red-50", text: "text-red-700", border: "border-red-300 font-bold" },
  MANUAL_VERIFICATION_COMPLETED: { bg: "bg-emerald-50", text: "text-emerald-800", border: "border-emerald-300 font-bold" },
  VERIFIED_BY_OFFICER: { bg: "bg-emerald-50", text: "text-emerald-800", border: "border-emerald-300 font-bold" },
};
