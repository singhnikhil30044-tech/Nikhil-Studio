export type ServiceCategory = 'photo' | 'video' | 'audio' | 'combo';

export type BookingStatus = 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
export type PaymentStatus = 'unpaid' | 'partial' | 'paid';
export type ProjectStage = 
  // Photo
  | 'Pre-Production' 
  | 'Shoot Completed' 
  | 'Client Selection / Proofing' 
  | 'Retouching & Color' 
  | 'Album Design' 
  | 'Delivered'
  // Video
  | 'Footage Ingest' 
  | 'Rough Cut Assembly' 
  | 'Color Grading & FX' 
  | 'Audio Sync & Master' 
  | 'Final Render' 
  | 'Export & Delivered'
  // Audio
  | 'Tracking / Recording' 
  | 'Editing & Tuning' 
  | 'Mixing' 
  | 'Mastering' 
  | 'Stems Released';

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  avatarUrl?: string;
  notes?: string;
  totalSpent: number;
  createdAt: string;
  vipStatus?: boolean;
}

export interface Booking {
  id: string;
  bookingNumber: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  title: string;
  serviceCategory: ServiceCategory;
  packageId: string;
  packageName: string;
  date: string;
  time: string;
  location: string;
  status: BookingStatus;
  totalAmount: number;
  advancePaid: number;
  balanceDue: number;
  paymentStatus: PaymentStatus;
  assignedStaffIds: string[];
  notes?: string;
  shotList?: string[];
  createdAt: string;
}

export interface ProofingPhoto {
  id: string;
  url: string;
  title: string;
  status: 'pending' | 'approved' | 'rejected' | 'retouched';
  clientComment?: string;
}

export interface AudioTrackItem {
  id: string;
  title: string;
  artist: string;
  bpm: number;
  key: string;
  genre: string;
  stage: 'Tracking' | 'Editing' | 'Mix' | 'Master' | 'Done';
  duration: string;
  synthToneFreq?: number;
  waveType?: 'sine' | 'triangle' | 'square' | 'sawtooth';
}

export interface ProjectDeliverable {
  id: string;
  name: string;
  type: 'photo' | 'video' | 'audio' | 'document';
  size: string;
  downloadUrl: string;
  isReady: boolean;
}

export interface StudioProject {
  id: string;
  bookingId: string;
  title: string;
  customerId: string;
  customerName: string;
  category: ServiceCategory;
  stage: ProjectStage;
  progressPercent: number;
  deadline: string;
  assignedStaff: string;
  leadGear?: string;
  proofingPhotos?: ProofingPhoto[];
  audioTracks?: AudioTrackItem[];
  deliverables?: ProjectDeliverable[];
  videoEmbedUrl?: string;
  createdAt: string;
}

export interface PackageItem {
  id: string;
  name: string;
  category: ServiceCategory;
  price: number;
  description: string;
  duration: string;
  features: string[];
  isPopular?: boolean;
}

export interface InvoiceItem {
  id: string;
  description: string;
  qty: number;
  rate: number;
  amount: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  bookingId: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress: string;
  issueDate: string;
  dueDate: string;
  items: InvoiceItem[];
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  discount: number;
  totalAmount: number;
  advancePaid: number;
  balanceDue: number;
  paymentStatus: PaymentStatus;
  paymentMethod?: string;
  notes?: string;
}

export interface StaffMember {
  id: string;
  name: string;
  role: 'Lead Photographer' | 'Cinematographer' | 'Audio Engineer' | 'Colorist & Editor' | 'Studio Manager';
  phone: string;
  email: string;
  avatarUrl: string;
  activeProjects: number;
  rating: number;
  status: 'available' | 'on_shoot' | 'off_duty';
  specialties: string[];
}

export interface Expense {
  id: string;
  title: string;
  category: 'Equipment & Gear' | 'Studio Rent & Power' | 'Software & Plugins' | 'Freelancers & Crew' | 'Maintenance' | 'Marketing';
  amount: number;
  date: string;
  receiptNumber?: string;
  notes?: string;
}

export interface StudioSettings {
  studioName: string;
  tagline: string;
  phone: string;
  email: string;
  address: string;
  website: string;
  currencySymbol: string;
  taxRatePercent: number;
  invoicePrefix: string;
  bankDetails: {
    bankName: string;
    accountName: string;
    accountNumber: string;
    ifscOrRouting: string;
    upiId?: string;
  };
}

export type ActiveTab = 
  | 'dashboard'
  | 'photo'
  | 'video'
  | 'audio'
  | 'bookings'
  | 'customers'
  | 'packages'
  | 'accounting'
  | 'staff'
  | 'gallery'
  | 'virtual_stage'
  | 'settings';
