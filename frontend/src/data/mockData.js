// Mock Data for Smart Garbage Management System (Week 1 UI)
// Fully coherent with PRD, TRD, and Design Document

export const MOCK_ZONES = [
  {
    id: "zone-12",
    name: "Sector 12 (Indira Nagar)",
    collectionDays: "Monday, Wednesday, Friday",
    timeWindow: "07:30 AM - 11:30 AM",
    assignedDriver: "Ramesh Kumar",
    truckNumber: "DL-04-E-1029",
    totalStops: 8,
    centerCoordinates: [28.6139, 77.2090], // New Delhi area
  },
  {
    id: "zone-08",
    name: "Sector 08 (Civil Lines)",
    collectionDays: "Tuesday, Thursday, Saturday",
    timeWindow: "07:00 AM - 11:00 AM",
    assignedDriver: "Sunil Verma",
    truckNumber: "DL-01-A-4491",
    totalStops: 10,
    centerCoordinates: [28.6200, 77.2150],
  },
  {
    id: "zone-15",
    name: "Sector 15 (Green Park)",
    collectionDays: "Daily",
    timeWindow: "06:30 AM - 10:30 AM",
    assignedDriver: "Mohd. Aslam",
    truckNumber: "DL-07-K-8820",
    totalStops: 12,
    centerCoordinates: [28.6080, 77.2020],
  },
];

export const MOCK_CITIZEN_USER = {
  id: "usr-cit-101",
  name: "Ayush Sharma",
  email: "ayush.citizen@delhimunicipal.gov.in",
  role: "citizen",
  zoneId: "zone-12",
  zoneName: "Sector 12 (Indira Nagar)",
  address: "Flat 402, Block B, Silver Oak Apartments, Sector 12",
  coordinates: [28.6142, 77.2110],
  registeredDate: "12 Aug 2026",
};

export const MOCK_STAFF_USER = {
  id: "usr-stf-204",
  name: "Ramesh Kumar",
  email: "ramesh.driver@delhimunicipal.gov.in",
  role: "staff",
  zoneId: "zone-12",
  zoneName: "Sector 12 (Indira Nagar)",
  vehicleId: "DL-04-E-1029 (Compactor Truck 4)",
  assignedStopsCount: 7,
};

export const MOCK_ADMIN_USER = {
  id: "usr-adm-001",
  name: "Dr. Sunita Rao",
  email: "admin.sanitation@delhimunicipal.gov.in",
  role: "admin",
  department: "Municipal Solid Waste Monitoring Directorate",
};

// Route stops for Sector 12 with coordinates for Leaflet
export const MOCK_ROUTE_STOPS = [
  { id: "stp-1", order: 1, address: "Community Center Bin Complex, Main Gate", lat: 28.6110, lng: 77.2050, status: "completed", completedAt: "08:10 AM" },
  { id: "stp-2", order: 2, address: "Pocket A Market Green Bins, Shop 1-14", lat: 28.6125, lng: 77.2075, status: "completed", completedAt: "08:35 AM" },
  { id: "stp-3", order: 3, address: "Silver Oak Enclave / Citizen Home Bin", lat: 28.6142, lng: 77.2110, status: "completed", completedAt: "09:00 AM", isCitizenStop: true },
  { id: "stp-4", order: 4, address: "Government Primary School Corner Bin", lat: 28.6160, lng: 77.2135, status: "pending", expectedTime: "09:25 AM" },
  { id: "stp-5", order: 5, address: "Sector 12 Dispensary & Clinic Waste Point", lat: 28.6175, lng: 77.2160, status: "pending", expectedTime: "09:50 AM" },
  { id: "stp-6", order: 6, address: "Block D Resident Welfare Assoc. Depot", lat: 28.6190, lng: 77.2185, status: "skipped", skipReason: "Narrow lane blocked by construction material" },
  { id: "stp-7", order: 7, address: "Central Park West Gate Public Bins", lat: 28.6210, lng: 77.2205, status: "pending", expectedTime: "10:30 AM" },
];

export const MOCK_COMPLAINTS = [
  {
    id: "CMP-2026-0891",
    citizenName: "Ayush Sharma",
    category: "Overflowing Bin",
    location: "Opposite Silver Oak Enclave Gate 2, Sector 12",
    description: "Community organic waste bin has been overflowing since yesterday evening. Stray animals are scattering trash across the footpath.",
    photoUrl: "https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=600&q=80",
    status: "in-progress",
    createdAt: "24 Sep 2026, 04:30 PM",
    zone: "Sector 12",
    assignedStaff: "Ramesh Kumar (Vehicle #DL-04-E-1029)",
    updates: [
      { timestamp: "24 Sep 2026, 04:30 PM", note: "Complaint registered and auto-routed to Sector 12 sanitation supervisor." },
      { timestamp: "25 Sep 2026, 07:45 AM", note: "Assigned to driver Ramesh Kumar for morning clearance run." }
    ]
  },
  {
    id: "CMP-2026-0842",
    citizenName: "Ayush Sharma",
    category: "Missed Collection",
    location: "Flat 402, Block B, Silver Oak Apartments",
    description: "Door-to-door dry waste collection truck skipped Block B on Monday collection cycle.",
    photoUrl: "https://images.unsplash.com/photo-1605600659908-0ef719419d41?auto=format&fit=crop&w=600&q=80",
    status: "resolved",
    createdAt: "21 Sep 2026, 11:15 AM",
    zone: "Sector 12",
    assignedStaff: "Sunil Verma",
    updates: [
      { timestamp: "21 Sep 2026, 11:15 AM", note: "Complaint logged." },
      { timestamp: "21 Sep 2026, 02:20 PM", note: "Backup vehicle dispatched and Block B waste cleared." }
    ]
  },
  {
    id: "CMP-2026-0810",
    citizenName: "Pooja Malhotra",
    category: "Illegal Dumping",
    location: "Vacant Plot 45, Behind Community Hall, Sector 12",
    description: "Commercial debris dumped overnight near the stormwater drain.",
    photoUrl: "https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?auto=format&fit=crop&w=600&q=80",
    status: "submitted",
    createdAt: "25 Sep 2026, 08:20 AM",
    zone: "Sector 12",
    assignedStaff: "Unassigned",
    updates: [
      { timestamp: "25 Sep 2026, 08:20 AM", note: "Complaint logged. Verification pending." }
    ]
  },
  {
    id: "CMP-2026-0799",
    citizenName: "Virender Saxena",
    category: "Damaged Bin",
    location: "Main Market Bus Stop, Sector 8",
    description: "Pedal and lid broken off the dry-waste receptacle.",
    photoUrl: "https://images.unsplash.com/photo-1528323273322-d81458248d40?auto=format&fit=crop&w=600&q=80",
    status: "resolved",
    createdAt: "19 Sep 2026, 09:00 AM",
    zone: "Sector 08",
    assignedStaff: "Sunil Verma",
    updates: [
      { timestamp: "19 Sep 2026, 09:00 AM", note: "Complaint logged." },
      { timestamp: "20 Sep 2026, 04:00 PM", note: "Replaced with new 240L wheelie bin." }
    ]
  }
];

export const MOCK_PICKUP_REQUESTS = [
  {
    id: "PCK-2026-0312",
    citizenName: "Ayush Sharma",
    pickupType: "Bulk Waste (Old Furniture)",
    fee: 350,
    scheduledDate: "2026-09-27",
    timeSlot: "Morning (09:00 AM - 12:00 PM)",
    address: "Flat 402, Block B, Silver Oak Apartments, Sector 12",
    notes: "2 disassembled wooden wardrobes and 1 mattress placed near lobby elevator.",
    paymentStatus: "paid",
    razorpayPaymentId: "pay_NzkX91Jz8Lq9W",
    status: "confirmed",
    assignedStaff: "Ramesh Kumar (DL-04-E-1029)",
    canCancel: true, // >24h
  },
  {
    id: "PCK-2026-0298",
    citizenName: "Ayush Sharma",
    pickupType: "E-Waste Disposal",
    fee: 250,
    scheduledDate: "2026-09-15",
    timeSlot: "Afternoon (02:00 PM - 05:00 PM)",
    address: "Flat 402, Block B, Silver Oak Apartments, Sector 12",
    notes: "Old CRT monitor, defective UPS, and 3 mixer motors.",
    paymentStatus: "paid",
    razorpayPaymentId: "pay_NmW491Kh2Bp0Z",
    status: "completed",
    assignedStaff: "Ramesh Kumar (DL-04-E-1029)",
    canCancel: false,
  },
  {
    id: "PCK-2026-0320",
    citizenName: "Kavita Sen",
    pickupType: "Construction Debris",
    fee: 750,
    scheduledDate: "2026-09-28",
    timeSlot: "Morning (09:00 AM - 12:00 PM)",
    address: "House 18, Block C, Green Park, Sector 15",
    notes: "Tile renovation rubble packed into 8 gunny bags.",
    paymentStatus: "pending",
    razorpayPaymentId: null,
    status: "pending_payment",
    assignedStaff: "Unassigned",
    canCancel: true,
  }
];

export const MOCK_KPI_STATS = {
  totalComplaints: 48,
  pendingComplaints: 14,
  resolvedComplaints: 34,
  specialPickupRevenue: 42500,
  dailyRouteStopsTotal: 30,
  dailyRouteStopsCompleted: 26,
  dailyRouteCompletionRate: 86.6,
  activeDriversOnDuty: 4,
};
