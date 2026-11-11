import {
  Customer,
  Booking,
  StudioProject,
  PackageItem,
  Invoice,
  StaffMember,
  Expense,
  StudioSettings,
  ServiceCategory,
  BookingStatus,
  PaymentStatus,
  ProjectStage
} from './types';

const STORAGE_KEYS = {
  CUSTOMERS: 'auragold_customers_v1',
  BOOKINGS: 'auragold_bookings_v1',
  PROJECTS: 'auragold_projects_v1',
  PACKAGES: 'auragold_packages_v1',
  INVOICES: 'auragold_invoices_v1',
  STAFF: 'auragold_staff_v1',
  EXPENSES: 'auragold_expenses_v1',
  SETTINGS: 'auragold_settings_v1',
};

// Initial Seed Data
const DEFAULT_SETTINGS: StudioSettings = {
  studioName: 'AuraGold Luxury Studios',
  tagline: 'Premier Photography, 4K Cinema & Spatial Audio Production',
  phone: '+1 (555) 789-2040',
  email: 'concierge@auragoldstudios.com',
  address: 'Suite 400, Platinum Media Tower, Beverly Hills, CA 90210',
  website: 'https://auragoldstudios.com',
  currencySymbol: '$',
  taxRatePercent: 8.5,
  invoicePrefix: 'AGS-INV-',
  bankDetails: {
    bankName: 'First Imperial Luxury Bank',
    accountName: 'AuraGold Creative Media Group LLC',
    accountNumber: '•••• •••• 8842',
    ifscOrRouting: '026009593',
    upiId: 'auragold@imperial'
  }
};

const DEFAULT_CUSTOMERS: Customer[] = [
  {
    id: 'c1',
    name: 'Elena Rostova & Liam Vance',
    phone: '+1 (555) 234-5678',
    email: 'elena.vance@vancemedia.com',
    address: 'Bel Air Crest, Los Angeles, CA',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    notes: 'High-end destination wedding couple. Prefers warm film grain and golden hour lighting.',
    totalSpent: 8500,
    createdAt: '2026-10-14',
    vipStatus: true,
  },
  {
    id: 'c2',
    name: 'Marcus Sterling',
    phone: '+1 (555) 345-6789',
    email: 'marcus@sterlingrecords.io',
    address: 'Silverlake Hills, Los Angeles, CA',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    notes: 'Record producer and vocalist. Needs analog warmth stem mixing and Dolby Atmos stems.',
    totalSpent: 4200,
    createdAt: '2026-10-20',
    vipStatus: true,
  },
  {
    id: 'c3',
    name: 'Sophia Chen',
    phone: '+1 (555) 456-7890',
    email: 'sophia@chenventures.com',
    address: 'Century City, Los Angeles, CA',
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80',
    notes: 'Corporate executive branding photoshoot and keynote video reel.',
    totalSpent: 2800,
    createdAt: '2026-11-01',
    vipStatus: false,
  },
  {
    id: 'c4',
    name: 'The Midnight Velvet (Band)',
    phone: '+1 (555) 567-8901',
    email: 'mgmt@midnightvelvet.band',
    address: 'Hollywood Boulevard, Los Angeles, CA',
    avatarUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=300&q=80',
    notes: 'Indie rock band recording EP album. Full live room tracking and final radio master.',
    totalSpent: 5600,
    createdAt: '2026-11-03',
    vipStatus: true,
  },
  {
    id: 'c5',
    name: 'Julian & Isabella De Luca',
    phone: '+1 (555) 678-9012',
    email: 'deluca.studios@gmail.com',
    address: 'Malibu Colony, Malibu, CA',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
    notes: 'Pre-wedding editorial and fashion shoot at coastal bluffs.',
    totalSpent: 3500,
    createdAt: '2026-11-06',
    vipStatus: false,
  }
];

const DEFAULT_PACKAGES: PackageItem[] = [
  {
    id: 'pkg1',
    name: 'Royal Heritage Wedding Cinema',
    category: 'video',
    price: 4800,
    duration: '2 Full Days (Up to 18 Hours)',
    description: 'Complete 3-camera 4K cinema coverage with drone cinematography, full highlight reel, and ceremony feature film.',
    features: [
      '3 Dedicated 4K Sony FX6 / FX3 Cinema Cameras',
      'Licensed FAA Drone Aerial 4K Footage',
      'Full Color Grade in DaVinci Resolve Studio',
      '10-Minute Cinematic Highlight Film + 60-Sec Reel',
      'Full Multi-Cam Ceremony & Speeches Edit',
      'Raw Footage Delivered on Luxury NVMe SSD'
    ],
    isPopular: true
  },
  {
    id: 'pkg2',
    name: 'Haute Couture Editorial Photography',
    category: 'photo',
    price: 2400,
    duration: '6 Hours Studio & Outdoor',
    description: 'High-fashion editorial, bridal, and executive portraits with medium-format fidelity and high-end magazine skin retouching.',
    features: [
      'Medium Format & 61MP Full-Frame Stills',
      'Master Lighting Assistant & Profoto B10X Setup',
      'Private Online Proofing & Selection Gallery',
      '35 Magazine-Grade Retouched Master Images',
      'Handcrafted Italian Leather 12x12 Flushmount Album',
      'Full Commercial & Social Media Usage Rights'
    ],
    isPopular: true
  },
  {
    id: 'pkg3',
    name: 'Dolby Atmos Audio Mixing & Mastering',
    category: 'audio',
    price: 1800,
    duration: 'Per 4-Track EP Package',
    description: 'Acoustically tuned control room mixing with Rupert Neve analog gear and pristine digital mastering ready for Apple Music & Spotify.',
    features: [
      'Up to 48 Audio Stems Per Song',
      'Analog Summing through Rupert Neve Console',
      'Vocal Tuning (Melodyne & Auto-Tune Pro)',
      'Stereo High-Res Master + Dolby Atmos Stems',
      'Instrumental & TV / Acapella Cut Stems',
      '3 Revision Rounds with Engineer Consultation'
    ],
    isPopular: false
  },
  {
    id: 'pkg4',
    name: 'The Magnum Opus - Trio All-in-One',
    category: 'combo',
    price: 7900,
    duration: 'Full Production Campaign',
    description: 'The ultimate studio bundle: 4K Cinematic Video, Editorial Photo Gallery, and Custom Studio Audio Soundtrack / Scoring.',
    features: [
      'Full Cinema Crew (Director, DP, Sound Recordist)',
      'Lead Photographer & Lighting Gaffer',
      'Custom Original Score / Sound Design in Studio',
      'Ultra 4K Master Video + 50 Retouched Photos',
      'Deluxe Velvet Keepsake Box with Acrylic Print',
      'Same-Week Teaser Drop for Social Media'
    ],
    isPopular: true
  },
  {
    id: 'pkg5',
    name: 'Vocal Tracking & Podcast Live Suite',
    category: 'audio',
    price: 850,
    duration: '4-Hour Soundproof Booth Block',
    description: 'Dedicated sound booth tracking with Neumann U87 microphone, live engineer, and real-time headphone monitor mix.',
    features: [
      'Neumann U87 Ai & Shure SM7B Microphones',
      'Universal Audio Apollo X8P Preamp Chain',
      'Dedicated Audio Engineer on Board',
      'Immediate Clean Stem Export at Session End',
      'Beverage & Artist Lounge Hospitality'
    ],
    isPopular: false
  }
];

const DEFAULT_STAFF: StaffMember[] = [
  {
    id: 's1',
    name: 'Alexandre Roy',
    role: 'Lead Photographer',
    phone: '+1 (555) 701-4411',
    email: 'alexandre@auragoldstudios.com',
    avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80',
    activeProjects: 3,
    rating: 4.9,
    status: 'on_shoot',
    specialties: ['Editorial Lighting', 'Medium Format', 'Hasselblad Master', 'Fashion']
  },
  {
    id: 's2',
    name: 'Kavita Sharma',
    role: 'Cinematographer',
    phone: '+1 (555) 701-4422',
    email: 'kavita@auragoldstudios.com',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
    activeProjects: 4,
    rating: 5.0,
    status: 'available',
    specialties: ['Sony FX6 / FX3', 'Anamorphic Lenses', 'Drone Cinematography', 'Gimbal Operation']
  },
  {
    id: 's3',
    name: 'Damon Vance',
    role: 'Audio Engineer',
    phone: '+1 (555) 701-4433',
    email: 'damon@auragoldstudios.com',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80',
    activeProjects: 2,
    rating: 4.8,
    status: 'available',
    specialties: ['Pro Tools Ultimate', 'Analog Outboard', 'Vocal Production', 'Dolby Atmos']
  },
  {
    id: 's4',
    name: 'Sienna Miller-Cross',
    role: 'Colorist & Editor',
    phone: '+1 (555) 701-4444',
    email: 'sienna@auragoldstudios.com',
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80',
    activeProjects: 3,
    rating: 4.9,
    status: 'available',
    specialties: ['DaVinci Resolve Studio', 'Premiere Pro', 'Film Emulation LUTs', 'Sound Sync']
  },
  {
    id: 's5',
    name: 'Darius Drake',
    role: 'Studio Manager',
    phone: '+1 (555) 701-4400',
    email: 'darius@auragoldstudios.com',
    avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=300&q=80',
    activeProjects: 8,
    rating: 5.0,
    status: 'available',
    specialties: ['Client Concierge', 'Budget Allocation', 'Equipment Logistics', 'Scheduling']
  }
];

const DEFAULT_BOOKINGS: Booking[] = [
  {
    id: 'b1',
    bookingNumber: 'AGS-BK-1081',
    customerId: 'c1',
    customerName: 'Elena Rostova & Liam Vance',
    customerPhone: '+1 (555) 234-5678',
    customerEmail: 'elena.vance@vancemedia.com',
    title: 'Elena & Liam Grand Wedding Film & Stills',
    serviceCategory: 'combo',
    packageId: 'pkg4',
    packageName: 'The Magnum Opus - Trio All-in-One',
    date: '2026-11-11', // Today!
    time: '14:00 - 22:00',
    location: 'Villa Bella Vista, Malibu Palisades, CA',
    status: 'in_progress',
    totalAmount: 7900,
    advancePaid: 5000,
    balanceDue: 2900,
    paymentStatus: 'partial',
    assignedStaffIds: ['s1', 's2', 's4'],
    notes: 'Outdoor sunset ceremony at 16:45. Prepare drone battery heaters and prime lenses.',
    shotList: [
      'Bride prep & gown reveal',
      'Father-daughter emotional first look',
      'Coastal cliffside golden hour couple portraits',
      'Drone sweep over amphitheater vows',
      'Champagne tower night toast'
    ],
    createdAt: '2026-10-15'
  },
  {
    id: 'b2',
    bookingNumber: 'AGS-BK-1082',
    customerId: 'c2',
    customerName: 'Marcus Sterling',
    customerPhone: '+1 (555) 345-6789',
    customerEmail: 'marcus@sterlingrecords.io',
    title: 'Marcus Sterling - Studio Vocal & Mix Session',
    serviceCategory: 'audio',
    packageId: 'pkg3',
    packageName: 'Dolby Atmos Audio Mixing & Mastering',
    date: '2026-11-11', // Today!
    time: '18:30 - 22:30',
    location: 'Studio A - Rupert Neve Control Room',
    status: 'confirmed',
    totalAmount: 1800,
    advancePaid: 1800,
    balanceDue: 0,
    paymentStatus: 'paid',
    assignedStaffIds: ['s3'],
    notes: 'Warm vintage tone requested on lead vocals using Neumann U87 through Avalon 737.',
    shotList: ['Lead Vocal Multi-takes', 'Harmony Stacks', 'Analog EQ Summing Pass'],
    createdAt: '2026-10-22'
  },
  {
    id: 'b3',
    bookingNumber: 'AGS-BK-1083',
    customerId: 'c3',
    customerName: 'Sophia Chen',
    customerPhone: '+1 (555) 456-7890',
    customerEmail: 'sophia@chenventures.com',
    title: 'Executive Brand Photoshoot & Keynote Video',
    serviceCategory: 'photo',
    packageId: 'pkg2',
    packageName: 'Haute Couture Editorial Photography',
    date: '2026-11-13',
    time: '10:00 - 16:00',
    location: 'Main Cyclorama Studio B, AuraGold Complex',
    status: 'confirmed',
    totalAmount: 2400,
    advancePaid: 1200,
    balanceDue: 1200,
    paymentStatus: 'partial',
    assignedStaffIds: ['s1'],
    notes: 'Black turtleneck, crisp navy suit, and soft warm ambient lighting setup.',
    shotList: ['Forbes Style Headshots', 'Action Candid on Laptop', 'Clean Silhouette Keynote Banner'],
    createdAt: '2026-11-02'
  },
  {
    id: 'b4',
    bookingNumber: 'AGS-BK-1084',
    customerId: 'c4',
    customerName: 'The Midnight Velvet (Band)',
    customerPhone: '+1 (555) 567-8901',
    customerEmail: 'mgmt@midnightvelvet.band',
    title: 'Live Tracking EP "Neon Sunset"',
    serviceCategory: 'audio',
    packageId: 'pkg5',
    packageName: 'Vocal Tracking & Podcast Live Suite',
    date: '2026-11-15',
    time: '13:00 - 21:00',
    location: 'Live Tracking Room B & Isolation Booth',
    status: 'confirmed',
    totalAmount: 1700,
    advancePaid: 1000,
    balanceDue: 700,
    paymentStatus: 'partial',
    assignedStaffIds: ['s3'],
    notes: 'Drum kit mic setup with 12 channels. Tube preamps preferred for bass guitar.',
    shotList: ['Drum overhead alignment', 'Bass DI & Amp track', 'Scratch rhythm guitar'],
    createdAt: '2026-11-04'
  },
  {
    id: 'b5',
    bookingNumber: 'AGS-BK-1085',
    customerId: 'c5',
    customerName: 'Julian & Isabella De Luca',
    customerPhone: '+1 (555) 678-9012',
    customerEmail: 'deluca.studios@gmail.com',
    title: 'De Luca Wedding Cinematic 4K Film',
    serviceCategory: 'video',
    packageId: 'pkg1',
    packageName: 'Royal Heritage Wedding Cinema',
    date: '2026-11-20',
    time: '11:00 - 23:00',
    location: 'Greystone Mansion & Gardens, Beverly Hills',
    status: 'confirmed',
    totalAmount: 4800,
    advancePaid: 2400,
    balanceDue: 2400,
    paymentStatus: 'partial',
    assignedStaffIds: ['s2', 's4'],
    notes: 'Strict venue insurance filed. Ceremony starts precisely at 15:00.',
    shotList: ['Groom styling and watch detail', 'Bride walk down spiral staircase', 'Fountain vows'],
    createdAt: '2026-11-06'
  },
  {
    id: 'b6',
    bookingNumber: 'AGS-BK-1080',
    customerId: 'c1',
    customerName: 'Elena Rostova & Liam Vance',
    customerPhone: '+1 (555) 234-5678',
    customerEmail: 'elena.vance@vancemedia.com',
    title: 'Pre-Wedding Sunset Editorial in Malibu',
    serviceCategory: 'photo',
    packageId: 'pkg2',
    packageName: 'Haute Couture Editorial Photography',
    date: '2026-10-28',
    time: '15:00 - 19:30',
    location: 'El Matador State Beach, Malibu, CA',
    status: 'completed',
    totalAmount: 2400,
    advancePaid: 2400,
    balanceDue: 0,
    paymentStatus: 'paid',
    assignedStaffIds: ['s1'],
    notes: 'Delivered in private online gallery. 100% client satisfaction.',
    shotList: ['Caves archway portrait', 'Sea spray backlit silhouette'],
    createdAt: '2026-10-14'
  }
];

const DEFAULT_PROJECTS: StudioProject[] = [
  {
    id: 'proj1',
    bookingId: 'b1',
    title: 'Elena & Liam Luxury Wedding Cinema',
    customerId: 'c1',
    customerName: 'Elena Rostova & Liam Vance',
    category: 'video',
    stage: 'Rough Cut Assembly',
    progressPercent: 45,
    deadline: '2026-11-28',
    assignedStaff: 'Kavita Sharma & Sienna Miller-Cross',
    leadGear: 'Sony FX6 Cinema Line, DGI Ronin 4D, Cooke Anamorphic',
    deliverables: [
      { id: 'del1', name: '4K Cinematic Teaser (60s)', type: 'video', size: '1.2 GB', downloadUrl: '#', isReady: true },
      { id: 'del2', name: 'Master Feature Film (12m)', type: 'video', size: '8.4 GB', downloadUrl: '#', isReady: false },
      { id: 'del3', name: 'Speeches & Vows Archive (45m)', type: 'video', size: '14.2 GB', downloadUrl: '#', isReady: false }
    ],
    videoEmbedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    createdAt: '2026-10-16'
  },
  {
    id: 'proj2',
    bookingId: 'b6',
    title: 'Elena & Liam Pre-Wedding Editorial Gallery',
    customerId: 'c1',
    customerName: 'Elena Rostova & Liam Vance',
    category: 'photo',
    stage: 'Client Selection / Proofing',
    progressPercent: 80,
    deadline: '2026-11-16',
    assignedStaff: 'Alexandre Roy',
    leadGear: 'Hasselblad X2D 100C + Profoto B10X Plus',
    proofingPhotos: [
      {
        id: 'ph1',
        url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80',
        title: 'Golden Archway Romance',
        status: 'approved',
        clientComment: 'Stunning light! Definitely our primary album cover.'
      },
      {
        id: 'ph2',
        url: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=80',
        title: 'Emerald Velvet Gown Profile',
        status: 'approved',
        clientComment: 'Love the contrast and skin tones.'
      },
      {
        id: 'ph3',
        url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=80',
        title: 'Cliffside Whisper Silhouette',
        status: 'approved'
      },
      {
        id: 'ph4',
        url: 'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?auto=format&fit=crop&w=1200&q=80',
        title: 'Shoreline Candid Laugh',
        status: 'pending'
      },
      {
        id: 'ph5',
        url: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=1200&q=80',
        title: 'Ring & Keepsake Macro',
        status: 'retouched'
      },
      {
        id: 'ph6',
        url: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=1200&q=80',
        title: 'Sunset Sea Breeze Dip',
        status: 'pending'
      }
    ],
    deliverables: [
      { id: 'del4', name: 'High-Res TIFF Masters (35 Images)', type: 'photo', size: '2.4 GB', downloadUrl: '#', isReady: true },
      { id: 'del5', name: 'Web-Optimized JPEG Collection', type: 'photo', size: '380 MB', downloadUrl: '#', isReady: true }
    ],
    createdAt: '2026-10-29'
  },
  {
    id: 'proj3',
    bookingId: 'b2',
    title: 'Marcus Sterling - "Echoes of Gold" EP',
    customerId: 'c2',
    customerName: 'Marcus Sterling',
    category: 'audio',
    stage: 'Mixing',
    progressPercent: 65,
    deadline: '2026-11-18',
    assignedStaff: 'Damon Vance',
    leadGear: 'Neve 88RS Console, Shadow Hills Mastering Compressor',
    audioTracks: [
      {
        id: 'trk1',
        title: '01 - Golden Horizon (Lead Single)',
        artist: 'Marcus Sterling',
        bpm: 124,
        key: 'F# Minor',
        genre: 'Modern R&B / Synth Pop',
        stage: 'Mix',
        duration: '3:42',
        synthToneFreq: 370,
        waveType: 'sawtooth'
      },
      {
        id: 'trk2',
        title: '02 - Velvet Nights (Vocal Focus)',
        artist: 'Marcus Sterling feat. Aria',
        bpm: 96,
        key: 'D Minor',
        genre: 'Soul / Neo-R&B',
        stage: 'Editing',
        duration: '4:15',
        synthToneFreq: 293.66,
        waveType: 'sine'
      },
      {
        id: 'trk3',
        title: '03 - Malibu Waves (Acoustic Stems)',
        artist: 'Marcus Sterling',
        bpm: 108,
        key: 'A Major',
        genre: 'Acoustic Soul',
        stage: 'Tracking',
        duration: '3:18',
        synthToneFreq: 440,
        waveType: 'triangle'
      },
      {
        id: 'trk4',
        title: '04 - Starlight Reprise (Club Mix)',
        artist: 'Marcus Sterling',
        bpm: 128,
        key: 'E Minor',
        genre: 'Electro-Funk',
        stage: 'Master',
        duration: '5:02',
        synthToneFreq: 329.63,
        waveType: 'square'
      }
    ],
    deliverables: [
      { id: 'del6', name: 'Stereo Master WAV (24bit / 96kHz)', type: 'audio', size: '420 MB', downloadUrl: '#', isReady: false },
      { id: 'del7', name: 'Dolby Atmos ADM BWF File', type: 'audio', size: '1.8 GB', downloadUrl: '#', isReady: false }
    ],
    createdAt: '2026-10-23'
  },
  {
    id: 'proj4',
    bookingId: 'b3',
    title: 'Sophia Chen Executive Leadership Portfolio',
    customerId: 'c3',
    customerName: 'Sophia Chen',
    category: 'photo',
    stage: 'Retouching & Color',
    progressPercent: 70,
    deadline: '2026-11-19',
    assignedStaff: 'Alexandre Roy',
    leadGear: 'Sony A1 + G Master 85mm f/1.4 + Broncolor Paras',
    deliverables: [
      { id: 'del8', name: 'Press & Media Package (PNG/TIFF)', type: 'photo', size: '890 MB', downloadUrl: '#', isReady: true }
    ],
    createdAt: '2026-11-03'
  }
];

const DEFAULT_INVOICES: Invoice[] = [
  {
    id: 'inv1',
    invoiceNumber: 'AGS-INV-2026-081',
    bookingId: 'b1',
    customerId: 'c1',
    customerName: 'Elena Rostova & Liam Vance',
    customerEmail: 'elena.vance@vancemedia.com',
    customerPhone: '+1 (555) 234-5678',
    customerAddress: 'Bel Air Crest, Los Angeles, CA',
    issueDate: '2026-10-15',
    dueDate: '2026-11-15',
    items: [
      { id: 'i1', description: 'The Magnum Opus - Trio All-in-One Studio Bundle', qty: 1, rate: 7900, amount: 7900 },
      { id: 'i2', description: 'Drone Permit & FAA Night Flight Clearance', qty: 1, rate: 350, amount: 350 },
      { id: 'i3', description: 'Same-Week Social Media 60s Reel Teaser', qty: 1, rate: 450, amount: 450 }
    ],
    subtotal: 8700,
    taxRate: 8.5,
    taxAmount: 739.5,
    discount: 500,
    totalAmount: 8939.5,
    advancePaid: 5000,
    balanceDue: 3939.5,
    paymentStatus: 'partial',
    paymentMethod: 'Wire Transfer / Amex Black',
    notes: 'Balance due upon delivery of final master cut. Thank you for choosing AuraGold Studios.'
  },
  {
    id: 'inv2',
    invoiceNumber: 'AGS-INV-2026-082',
    bookingId: 'b2',
    customerId: 'c2',
    customerName: 'Marcus Sterling',
    customerEmail: 'marcus@sterlingrecords.io',
    customerPhone: '+1 (555) 345-6789',
    customerAddress: 'Silverlake Hills, Los Angeles, CA',
    issueDate: '2026-10-22',
    dueDate: '2026-10-22',
    items: [
      { id: 'i4', description: 'Dolby Atmos Audio Mixing & Mastering (4 Tracks)', qty: 1, rate: 1800, amount: 1800 }
    ],
    subtotal: 1800,
    taxRate: 8.5,
    taxAmount: 153,
    discount: 0,
    totalAmount: 1953,
    advancePaid: 1953,
    balanceDue: 0,
    paymentStatus: 'paid',
    paymentMethod: 'ACH Direct Deposit',
    notes: 'Paid in full on receipt. Studio session locked.'
  },
  {
    id: 'inv3',
    invoiceNumber: 'AGS-INV-2026-083',
    bookingId: 'b3',
    customerId: 'c3',
    customerName: 'Sophia Chen',
    customerEmail: 'sophia@chenventures.com',
    customerPhone: '+1 (555) 456-7890',
    customerAddress: 'Century City, Los Angeles, CA',
    issueDate: '2026-11-02',
    dueDate: '2026-11-18',
    items: [
      { id: 'i5', description: 'Haute Couture Editorial Photography Session', qty: 1, rate: 2400, amount: 2400 },
      { id: 'i6', description: 'Rush 48-Hour Retouching Service', qty: 1, rate: 400, amount: 400 }
    ],
    subtotal: 2800,
    taxRate: 8.5,
    taxAmount: 238,
    discount: 100,
    totalAmount: 2938,
    advancePaid: 1500,
    balanceDue: 1438,
    paymentStatus: 'partial',
    paymentMethod: 'Corporate Visa',
    notes: 'Includes expedited selection gallery.'
  }
];

const DEFAULT_EXPENSES: Expense[] = [
  {
    id: 'exp1',
    title: 'Sony FX6 Cinema Camera & 24-70 GM II Rental',
    category: 'Equipment & Gear',
    amount: 750,
    date: '2026-11-09',
    receiptNumber: 'EXP-1099',
    notes: 'Backup body for upcoming weekend wedding production.'
  },
  {
    id: 'exp2',
    title: 'Studio A Acoustics & Sound Booth Calibration',
    category: 'Maintenance',
    amount: 420,
    date: '2026-11-05',
    receiptNumber: 'EXP-1084',
    notes: 'Quarterly Genelec SAM monitor tuning & laser acoustic sweep.'
  },
  {
    id: 'exp3',
    title: 'Universal Audio & FabFilter Pro Suite Renewal',
    category: 'Software & Plugins',
    amount: 380,
    date: '2026-11-02',
    receiptNumber: 'EXP-1077',
    notes: 'DAW plugin licenses for Dolby Atmos mixing suite.'
  },
  {
    id: 'exp4',
    title: 'Studio Complex Power & Dedicated Fiber Internet',
    category: 'Studio Rent & Power',
    amount: 890,
    date: '2026-11-01',
    receiptNumber: 'EXP-1065',
    notes: '10Gbps dedicated upload pipeline for client cloud galleries.'
  },
  {
    id: 'exp5',
    title: 'Lighting Gaffer & Assistant Crew Fees',
    category: 'Freelancers & Crew',
    amount: 600,
    date: '2026-10-28',
    receiptNumber: 'EXP-1049',
    notes: 'Malibu coastal sunset editorial shoot.'
  }
];

class StudioStore {
  customers: Customer[] = [];
  bookings: Booking[] = [];
  projects: StudioProject[] = [];
  packages: PackageItem[] = [];
  invoices: Invoice[] = [];
  staff: StaffMember[] = [];
  expenses: Expense[] = [];
  settings: StudioSettings = DEFAULT_SETTINGS;

  private listeners: (() => void)[] = [];

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    try {
      const c = localStorage.getItem(STORAGE_KEYS.CUSTOMERS);
      this.customers = c ? JSON.parse(c) : DEFAULT_CUSTOMERS;

      const b = localStorage.getItem(STORAGE_KEYS.BOOKINGS);
      this.bookings = b ? JSON.parse(b) : DEFAULT_BOOKINGS;

      const pr = localStorage.getItem(STORAGE_KEYS.PROJECTS);
      this.projects = pr ? JSON.parse(pr) : DEFAULT_PROJECTS;

      const pk = localStorage.getItem(STORAGE_KEYS.PACKAGES);
      this.packages = pk ? JSON.parse(pk) : DEFAULT_PACKAGES;

      const inv = localStorage.getItem(STORAGE_KEYS.INVOICES);
      this.invoices = inv ? JSON.parse(inv) : DEFAULT_INVOICES;

      const st = localStorage.getItem(STORAGE_KEYS.STAFF);
      this.staff = st ? JSON.parse(st) : DEFAULT_STAFF;

      const ex = localStorage.getItem(STORAGE_KEYS.EXPENSES);
      this.expenses = ex ? JSON.parse(ex) : DEFAULT_EXPENSES;

      const s = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      this.settings = s ? JSON.parse(s) : DEFAULT_SETTINGS;
    } catch (e) {
      console.warn('Failed to load local storage data, using defaults:', e);
      this.resetToDefaults();
    }
  }

  save() {
    try {
      localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(this.customers));
      localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(this.bookings));
      localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(this.projects));
      localStorage.setItem(STORAGE_KEYS.PACKAGES, JSON.stringify(this.packages));
      localStorage.setItem(STORAGE_KEYS.INVOICES, JSON.stringify(this.invoices));
      localStorage.setItem(STORAGE_KEYS.STAFF, JSON.stringify(this.staff));
      localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(this.expenses));
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(this.settings));
    } catch (e) {
      console.error('Error saving data to localStorage:', e);
    }
    this.notify();
  }

  subscribe(listener: () => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach(fn => fn());
  }

  resetToDefaults() {
    this.customers = JSON.parse(JSON.stringify(DEFAULT_CUSTOMERS));
    this.bookings = JSON.parse(JSON.stringify(DEFAULT_BOOKINGS));
    this.projects = JSON.parse(JSON.stringify(DEFAULT_PROJECTS));
    this.packages = JSON.parse(JSON.stringify(DEFAULT_PACKAGES));
    this.invoices = JSON.parse(JSON.stringify(DEFAULT_INVOICES));
    this.staff = JSON.parse(JSON.stringify(DEFAULT_STAFF));
    this.expenses = JSON.parse(JSON.stringify(DEFAULT_EXPENSES));
    this.settings = JSON.parse(JSON.stringify(DEFAULT_SETTINGS));
    this.save();
  }

  // --- Customer Operations ---
  addCustomer(customer: Omit<Customer, 'id' | 'createdAt' | 'totalSpent'>): Customer {
    const newCust: Customer = {
      ...customer,
      id: 'c_' + Date.now(),
      createdAt: new Date().toISOString().split('T')[0],
      totalSpent: 0
    };
    this.customers.unshift(newCust);
    this.save();
    return newCust;
  }

  updateCustomer(id: string, updates: Partial<Customer>) {
    const idx = this.customers.findIndex(c => c.id === id);
    if (idx !== -1) {
      this.customers[idx] = { ...this.customers[idx], ...updates };
      this.save();
    }
  }

  deleteCustomer(id: string) {
    this.customers = this.customers.filter(c => c.id !== id);
    this.save();
  }

  // --- Booking Operations ---
  addBooking(booking: Omit<Booking, 'id' | 'bookingNumber' | 'createdAt'>): Booking {
    const num = 'AGS-BK-' + Math.floor(1000 + Math.random() * 9000);
    const newBooking: Booking = {
      ...booking,
      id: 'b_' + Date.now(),
      bookingNumber: num,
      createdAt: new Date().toISOString().split('T')[0]
    };
    this.bookings.unshift(newBooking);

    // Auto-create matching project
    const newProj: StudioProject = {
      id: 'proj_' + Date.now(),
      bookingId: newBooking.id,
      title: newBooking.title,
      customerId: newBooking.customerId,
      customerName: newBooking.customerName,
      category: newBooking.serviceCategory,
      stage: newBooking.serviceCategory === 'photo' ? 'Pre-Production' : newBooking.serviceCategory === 'video' ? 'Footage Ingest' : 'Tracking / Recording',
      progressPercent: 10,
      deadline: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
      assignedStaff: newBooking.assignedStaffIds.map(id => this.staff.find(s => s.id === id)?.name).filter(Boolean).join(', ') || 'Unassigned',
      deliverables: [],
      createdAt: newBooking.createdAt
    };
    this.projects.unshift(newProj);

    // Auto-create matching invoice
    const newInv: Invoice = {
      id: 'inv_' + Date.now(),
      invoiceNumber: this.settings.invoicePrefix + Math.floor(10000 + Math.random() * 90000),
      bookingId: newBooking.id,
      customerId: newBooking.customerId,
      customerName: newBooking.customerName,
      customerEmail: newBooking.customerEmail,
      customerPhone: newBooking.customerPhone,
      customerAddress: this.customers.find(c => c.id === newBooking.customerId)?.address || 'Studio Client Address',
      issueDate: newBooking.createdAt,
      dueDate: newBooking.date,
      items: [
        {
          id: 'item_1',
          description: newBooking.packageName + ' - ' + newBooking.title,
          qty: 1,
          rate: newBooking.totalAmount,
          amount: newBooking.totalAmount
        }
      ],
      subtotal: newBooking.totalAmount,
      taxRate: this.settings.taxRatePercent,
      taxAmount: Math.round((newBooking.totalAmount * (this.settings.taxRatePercent / 100)) * 100) / 100,
      discount: 0,
      totalAmount: Math.round((newBooking.totalAmount * (1 + this.settings.taxRatePercent / 100)) * 100) / 100,
      advancePaid: newBooking.advancePaid,
      balanceDue: Math.max(0, Math.round((newBooking.totalAmount * (1 + this.settings.taxRatePercent / 100)) * 100) / 100 - newBooking.advancePaid),
      paymentStatus: newBooking.paymentStatus,
      paymentMethod: 'Credit Card / Direct Wire',
      notes: 'Thank you for choosing AuraGold Studios.'
    };
    this.invoices.unshift(newInv);

    // Update customer total spent
    const cust = this.customers.find(c => c.id === newBooking.customerId);
    if (cust) {
      cust.totalSpent += newBooking.advancePaid;
    }

    this.save();
    return newBooking;
  }

  updateBookingStatus(id: string, status: BookingStatus) {
    const booking = this.bookings.find(b => b.id === id);
    if (booking) {
      booking.status = status;
      this.save();
    }
  }

  recordBookingPayment(id: string, amount: number) {
    const booking = this.bookings.find(b => b.id === id);
    if (booking) {
      booking.advancePaid += amount;
      booking.balanceDue = Math.max(0, booking.totalAmount - booking.advancePaid);
      booking.paymentStatus = booking.balanceDue === 0 ? 'paid' : (booking.advancePaid > 0 ? 'partial' : 'unpaid');
      
      const cust = this.customers.find(c => c.id === booking.customerId);
      if (cust) {
        cust.totalSpent += amount;
      }
      this.save();
    }
  }

  deleteBooking(id: string) {
    this.bookings = this.bookings.filter(b => b.id !== id);
    this.save();
  }

  // --- Project Operations ---
  updateProjectStage(id: string, stage: ProjectStage, progressPercent: number) {
    const proj = this.projects.find(p => p.id === id);
    if (proj) {
      proj.stage = stage;
      proj.progressPercent = progressPercent;
      this.save();
    }
  }

  toggleProofingPhotoStatus(projectId: string, photoId: string, status: 'approved' | 'rejected' | 'pending') {
    const proj = this.projects.find(p => p.id === projectId);
    if (proj && proj.proofingPhotos) {
      const ph = proj.proofingPhotos.find(p => p.id === photoId);
      if (ph) {
        ph.status = status;
        this.save();
      }
    }
  }

  // --- Package Operations ---
  addPackage(pkg: Omit<PackageItem, 'id'>) {
    const newPkg: PackageItem = {
      ...pkg,
      id: 'pkg_' + Date.now()
    };
    this.packages.push(newPkg);
    this.save();
  }

  updatePackage(id: string, updates: Partial<PackageItem>) {
    const idx = this.packages.findIndex(p => p.id === id);
    if (idx !== -1) {
      this.packages[idx] = { ...this.packages[idx], ...updates };
      this.save();
    }
  }

  deletePackage(id: string) {
    this.packages = this.packages.filter(p => p.id !== id);
    this.save();
  }

  // --- Staff Operations ---
  addStaff(member: Omit<StaffMember, 'id' | 'activeProjects'>) {
    const newStaff: StaffMember = {
      ...member,
      id: 's_' + Date.now(),
      activeProjects: 0
    };
    this.staff.push(newStaff);
    this.save();
  }

  updateStaff(id: string, updates: Partial<StaffMember>) {
    const idx = this.staff.findIndex(s => s.id === id);
    if (idx !== -1) {
      this.staff[idx] = { ...this.staff[idx], ...updates };
      this.save();
    }
  }

  deleteStaff(id: string) {
    this.staff = this.staff.filter(s => s.id !== id);
    this.save();
  }

  // --- Expense Operations ---
  addExpense(expense: Omit<Expense, 'id'>) {
    const newExp: Expense = {
      ...expense,
      id: 'exp_' + Date.now()
    };
    this.expenses.unshift(newExp);
    this.save();
  }

  deleteExpense(id: string) {
    this.expenses = this.expenses.filter(e => e.id !== id);
    this.save();
  }

  // --- Invoices ---
  markInvoicePaid(id: string) {
    const inv = this.invoices.find(i => i.id === id);
    if (inv) {
      inv.advancePaid = inv.totalAmount;
      inv.balanceDue = 0;
      inv.paymentStatus = 'paid';
      this.save();
    }
  }

  // --- Settings ---
  updateSettings(settings: Partial<StudioSettings>) {
    this.settings = { ...this.settings, ...settings };
    this.save();
  }

  // Export / Backup
  exportData(): string {
    return JSON.stringify({
      customers: this.customers,
      bookings: this.bookings,
      projects: this.projects,
      packages: this.packages,
      invoices: this.invoices,
      staff: this.staff,
      expenses: this.expenses,
      settings: this.settings,
      exportedAt: new Date().toISOString()
    }, null, 2);
  }

  importData(jsonString: string): boolean {
    try {
      const data = JSON.parse(jsonString);
      if (data.customers && data.bookings && data.settings) {
        this.customers = data.customers;
        this.bookings = data.bookings;
        this.projects = data.projects || [];
        this.packages = data.packages || [];
        this.invoices = data.invoices || [];
        this.staff = data.staff || [];
        this.expenses = data.expenses || [];
        this.settings = data.settings || DEFAULT_SETTINGS;
        this.save();
        return true;
      }
      return false;
    } catch (e) {
      console.error('Import failed:', e);
      return false;
    }
  }

  // Statistics & Financials
  getFinancialSummary() {
    const totalRevenue = this.bookings.reduce((sum, b) => sum + b.totalAmount, 0);
    const collectedRevenue = this.bookings.reduce((sum, b) => sum + b.advancePaid, 0);
    const pendingBalance = this.bookings.reduce((sum, b) => sum + b.balanceDue, 0);
    const totalExpenses = this.expenses.reduce((sum, e) => sum + e.amount, 0);
    const netProfit = collectedRevenue - totalExpenses;

    const todayDate = '2026-11-11';
    const todayShoots = this.bookings.filter(b => b.date === todayDate);

    const pendingProjects = this.projects.filter(p => p.progressPercent < 100);
    const completedProjects = this.projects.filter(p => p.progressPercent >= 100);

    return {
      totalCustomers: this.customers.length,
      totalBookings: this.bookings.length,
      todayShootsCount: todayShoots.length,
      todayShoots,
      pendingProjectsCount: pendingProjects.length,
      completedProjectsCount: completedProjects.length,
      totalRevenue,
      collectedRevenue,
      pendingBalance,
      totalExpenses,
      netProfit,
      monthlyEarnings: collectedRevenue
    };
  }
}

export const store = new StudioStore();
