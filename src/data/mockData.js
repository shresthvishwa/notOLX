// Pre-populated Thapar University student profiles, listings, conversations, and reviews

export const MOCK_STUDENTS = [
  {
    id: 'usr_1',
    email: 'shresth.vishwakarma@thapar.edu',
    full_name: 'Shresth Vishwakarma',
    college_name: 'Thapar Institute of Engineering & Technology',
    college_id: 'TU-2024-101',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    dorm_block: 'Hostel J (Rm 314)',
    major: 'Computer Science Engineering (3rd Year)',
    rating_avg: 4.9,
    rating_count: 14,
    verified: true,
    joined_date: 'Sep 2024'
  },
  {
    id: 'usr_2',
    email: 'aditya.salwan@thapar.edu',
    full_name: 'Aditya Salwan',
    college_name: 'Thapar Institute of Engineering & Technology',
    college_id: 'TU-2024-102',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    dorm_block: 'Hostel M (Rm 204)',
    major: 'Electronics & Computer Engineering',
    rating_avg: 5.0,
    rating_count: 9,
    verified: true,
    joined_date: 'Jan 2025'
  },
  {
    id: 'usr_3',
    email: 'nishchay.goyal@thapar.edu',
    full_name: 'Nishchay Goyal',
    college_name: 'Thapar Institute of Engineering & Technology',
    college_id: 'TU-2024-103',
    avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
    dorm_block: 'Hostel B (Rm 112)',
    major: 'Mechanical Engineering',
    rating_avg: 4.8,
    rating_count: 21,
    verified: true,
    joined_date: 'Oct 2024'
  }
];

export const MOCK_COLLEGES = [
  { name: 'Thapar Institute of Engineering & Technology', domain: 'thapar.edu', code: 'TIET' }
];

export const CATEGORIES = [
  { id: 'all', label: 'All Campus Items', icon: 'Sparkles' },
  { id: 'calculators', label: 'Tech & Calculators', icon: 'Calculator' },
  { id: 'textbooks', label: 'Textbooks & Notes', icon: 'BookOpen' },
  { id: 'cycles', label: 'Cycles & Transport', icon: 'Bike' },
  { id: 'lab', label: 'Lab Gear & Supplies', icon: 'FlaskConical' },
  { id: 'dorm', label: 'Dorm & Electronics', icon: 'Home' },
  { id: 'sports', label: 'Sports & Hobbies', icon: 'Dumbbell' }
];

export const MOCK_MEETUP_SPOTS = [
  'COS (Center of Studies) Canteen',
  'Nava Nalanda Central Library Plaza',
  'Hostel J Quad / Lawns',
  'TIET Main Gate 1',
  'TAN Building Entrance',
  'G-Block Canteen & Student Plaza'
];

export const MOCK_LISTINGS = [
  {
    id: 'prod_101',
    seller_id: 'usr_2', // Aditya Salwan
    title: 'Casio FX-991EX Classwiz Non-Programmable Calculator',
    description: 'Essential calculator for engineering maths & circuit analysis courses at TIET. Solar + battery powered, high-res display. Works perfectly for end-sem exams.',
    price: 45.00,
    original_price: 95.00,
    category: 'calculators',
    condition: 'Like New',
    images: [
      'https://images.unsplash.com/photo-1611125832047-1d7ad1e8e48e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?auto=format&fit=crop&w=800&q=80'
    ],
    campus_location: 'Hostel M / COS Canteen',
    status: 'available',
    views_count: 54,
    created_at: '2026-08-15T10:30:00Z'
  },
  {
    id: 'prod_102',
    seller_id: 'usr_3', // Nishchay Goyal
    title: 'Hero Sprint 21-Speed Gear Bicycle',
    description: 'Perfect cycle for commuting between hostels, COS, and academic blocks across campus. Includes front basket, LED night light, and heavy-duty combination lock.',
    price: 120.00,
    original_price: 320.00,
    category: 'cycles',
    condition: 'Good',
    images: [
      'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?auto=format&fit=crop&w=800&q=80'
    ],
    campus_location: 'Hostel B / Main Gate 1',
    status: 'available',
    views_count: 98,
    created_at: '2026-08-16T14:15:00Z'
  },
  {
    id: 'prod_103',
    seller_id: 'usr_1', // Shresth Vishwakarma
    title: 'Data Structures & Algorithms in C++ (4th Ed) - Weiss',
    description: 'Standard textbook used in CSE 2nd year. Includes handwritten tutorial notes, solved lab assignment code snippets, and end-sem exam question papers attached!',
    price: 30.00,
    original_price: 85.00,
    category: 'textbooks',
    condition: 'Excellent',
    images: [
      'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80'
    ],
    campus_location: 'Hostel J / Central Library',
    status: 'available',
    views_count: 42,
    created_at: '2026-08-14T09:00:00Z'
  },
  {
    id: 'prod_104',
    seller_id: 'usr_2', // Aditya Salwan
    title: 'Logitech MX Master 3S Wireless Ergonomic Mouse',
    description: 'Super smooth precision mouse for coding, CAD designing, and studying. Bluetooth multi-device pair, long battery life. Used carefully on hostel study desk.',
    price: 48.00,
    original_price: 99.00,
    category: 'calculators',
    condition: 'Excellent',
    images: [
      'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=800&q=80'
    ],
    campus_location: 'Hostel M / TAN Building',
    status: 'available',
    views_count: 67,
    created_at: '2026-08-13T11:10:00Z'
  },
  {
    id: 'prod_105',
    seller_id: 'usr_3', // Nishchay Goyal
    title: 'Engineering Chemistry & Physics Lab Coat + Safety Goggles',
    description: 'White cotton lab coat size Large with TIET lab logo. Comes with clear anti-glare safety goggles for first year engineering lab courses.',
    price: 18.00,
    original_price: 45.00,
    category: 'lab',
    condition: 'Like New',
    images: [
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80'
    ],
    campus_location: 'G-Block / COS Canteen',
    status: 'available',
    views_count: 35,
    created_at: '2026-08-16T18:45:00Z'
  },
  {
    id: 'prod_106',
    seller_id: 'usr_1', // Shresth Vishwakarma
    title: 'Yonex Arcsaber Tennis / Badminton Racket + Carrying Bag',
    description: 'Graphite frame, lightweight with high string tension. Great for playing at Thapar sports complex. Comes with full padded head cover.',
    price: 35.00,
    original_price: 80.00,
    category: 'sports',
    condition: 'Good',
    images: [
      'https://images.unsplash.com/photo-1617083934555-ac7d4fed8824?auto=format&fit=crop&w=800&q=80'
    ],
    campus_location: 'Hostel J / Sports Complex',
    status: 'available',
    views_count: 28,
    created_at: '2026-08-17T11:00:00Z'
  }
];

export const MOCK_CONVERSATIONS = [
  {
    id: 'conv_1',
    product_id: 'prod_101',
    buyer_id: 'usr_1', // Shresth Vishwakarma
    seller_id: 'usr_2', // Aditya Salwan
    last_message: 'Is $40 okay if I pick it up at COS Canteen?',
    updated_at: '2026-08-17T12:00:00Z',
    messages: [
      {
        id: 'msg_1',
        sender_id: 'usr_1',
        content: 'Hi Aditya! Is the Casio calculator still available?',
        created_at: '2026-08-17T11:30:00Z'
      },
      {
        id: 'msg_2',
        sender_id: 'usr_2',
        content: 'Hey Shresth! Yes it is. Works great for end-sem maths exams.',
        created_at: '2026-08-17T11:42:00Z'
      },
      {
        id: 'msg_3',
        sender_id: 'usr_1',
        content: 'Awesome! Would you accept $40 for a quick meetup at COS Canteen?',
        offer_price: 40.00,
        meetup_spot: 'COS (Center of Studies) Canteen',
        created_at: '2026-08-17T12:00:00Z'
      }
    ]
  }
];

export const MOCK_REVIEWS = [
  {
    id: 'rev_1',
    product_id: 'prod_99',
    reviewer_id: 'usr_1',
    reviewee_id: 'usr_2',
    rating: 5,
    comment: 'Aditya was super punctual at COS Canteen and the scientific calculator was in pristine condition!',
    tags: ['Punctual', 'Item as described', 'Fair price'],
    created_at: '2026-08-10T16:20:00Z'
  },
  {
    id: 'rev_2',
    product_id: 'prod_98',
    reviewer_id: 'usr_1',
    reviewee_id: 'usr_3',
    rating: 5,
    comment: 'Nishchay delivered the gear bicycle right outside Hostel J. Smooth deal!',
    tags: ['Friendly seller', 'Fast campus pickup'],
    created_at: '2026-08-08T19:00:00Z'
  }
];
