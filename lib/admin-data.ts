// Mock data for admin dashboard

export type BookingStatus = "pending" | "confirmed" | "cancelled" | "completed";
export type UserRole = "user" | "admin";
export type UserStatus = "active" | "inactive";

export interface Booking {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  service: string;
  therapist: string;
  date: string;
  time: string;
  duration: number;
  price: number;
  status: BookingStatus;
  notes?: string;
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  status: UserStatus;
  bookings: number;
  totalSpent: number;
  joinedAt: string;
  avatar?: string;
}

export interface Service {
  id: string;
  name: string;
  category: string;
  duration: number;
  price: number;
  description: string;
  image: string;
  active: boolean;
  bookings: number;
}

export interface ContentBlock {
  id: string;
  page: string;
  section: string;
  title: string;
  body: string;
  updatedAt: string;
}

export const MOCK_BOOKINGS: Booking[] = [
  {
    id: "BK-001",
    customerId: "U-001",
    customerName: "Sophie Anderson",
    customerEmail: "sophie@email.com",
    service: "Hot Stone Massage",
    therapist: "Emma Chen",
    date: "2026-03-30",
    time: "10:00",
    duration: 90,
    price: 180,
    status: "confirmed",
    notes: "Client prefers light pressure",
    createdAt: "2026-03-25T09:00:00Z",
  },
  {
    id: "BK-002",
    customerId: "U-002",
    customerName: "James Mitchell",
    customerEmail: "james@email.com",
    service: "Deep Tissue Massage",
    therapist: "Liam Torres",
    date: "2026-03-30",
    time: "11:30",
    duration: 60,
    price: 130,
    status: "pending",
    createdAt: "2026-03-26T14:00:00Z",
  },
  {
    id: "BK-003",
    customerId: "U-003",
    customerName: "Olivia Park",
    customerEmail: "olivia@email.com",
    service: "Aromatherapy Ritual",
    therapist: "Mia Johnson",
    date: "2026-03-31",
    time: "09:00",
    duration: 75,
    price: 155,
    status: "confirmed",
    createdAt: "2026-03-24T11:00:00Z",
  },
  {
    id: "BK-004",
    customerId: "U-004",
    customerName: "Ethan Williams",
    customerEmail: "ethan@email.com",
    service: "Swedish Massage",
    therapist: "Emma Chen",
    date: "2026-03-29",
    time: "14:00",
    duration: 60,
    price: 110,
    status: "completed",
    createdAt: "2026-03-20T10:00:00Z",
  },
  {
    id: "BK-005",
    customerId: "U-005",
    customerName: "Isabella Brown",
    customerEmail: "isabella@email.com",
    service: "Couples Retreat",
    therapist: "Liam Torres",
    date: "2026-03-28",
    time: "15:00",
    duration: 120,
    price: 320,
    status: "cancelled",
    notes: "Cancelled due to illness",
    createdAt: "2026-03-22T16:00:00Z",
  },
  {
    id: "BK-006",
    customerId: "U-006",
    customerName: "Noah Davis",
    customerEmail: "noah@email.com",
    service: "Bamboo Fusion",
    therapist: "Mia Johnson",
    date: "2026-04-01",
    time: "13:00",
    duration: 90,
    price: 175,
    status: "pending",
    createdAt: "2026-03-27T08:00:00Z",
  },
  {
    id: "BK-007",
    customerId: "U-007",
    customerName: "Ava Martinez",
    customerEmail: "ava@email.com",
    service: "Prenatal Massage",
    therapist: "Emma Chen",
    date: "2026-04-02",
    time: "10:00",
    duration: 60,
    price: 140,
    status: "confirmed",
    createdAt: "2026-03-28T12:00:00Z",
  },
  {
    id: "BK-008",
    customerId: "U-001",
    customerName: "Sophie Anderson",
    customerEmail: "sophie@email.com",
    service: "Reflexology",
    therapist: "Liam Torres",
    date: "2026-04-03",
    time: "11:00",
    duration: 45,
    price: 90,
    status: "pending",
    createdAt: "2026-03-29T09:30:00Z",
  },
];

export const MOCK_USERS: User[] = [
  {
    id: "U-001",
    name: "Sophie Anderson",
    email: "sophie@email.com",
    phone: "+61 412 345 678",
    role: "user",
    status: "active",
    bookings: 8,
    totalSpent: 1240,
    joinedAt: "2025-08-15",
  },
  {
    id: "U-002",
    name: "James Mitchell",
    email: "james@email.com",
    phone: "+61 423 456 789",
    role: "user",
    status: "active",
    bookings: 3,
    totalSpent: 390,
    joinedAt: "2025-11-02",
  },
  {
    id: "U-003",
    name: "Olivia Park",
    email: "olivia@email.com",
    phone: "+61 434 567 890",
    role: "user",
    status: "active",
    bookings: 12,
    totalSpent: 1860,
    joinedAt: "2025-06-20",
  },
  {
    id: "U-004",
    name: "Ethan Williams",
    email: "ethan@email.com",
    phone: "+61 445 678 901",
    role: "user",
    status: "active",
    bookings: 5,
    totalSpent: 650,
    joinedAt: "2025-09-10",
  },
  {
    id: "U-005",
    name: "Isabella Brown",
    email: "isabella@email.com",
    phone: "+61 456 789 012",
    role: "user",
    status: "inactive",
    bookings: 2,
    totalSpent: 320,
    joinedAt: "2025-12-01",
  },
  {
    id: "U-006",
    name: "Noah Davis",
    email: "noah@email.com",
    phone: "+61 467 890 123",
    role: "user",
    status: "active",
    bookings: 1,
    totalSpent: 175,
    joinedAt: "2026-01-14",
  },
  {
    id: "U-007",
    name: "Ava Martinez",
    email: "ava@email.com",
    phone: "+61 478 901 234",
    role: "user",
    status: "active",
    bookings: 4,
    totalSpent: 560,
    joinedAt: "2025-10-05",
  },
  {
    id: "A-001",
    name: "Admin User",
    email: "admin@wellness.com",
    phone: "+61 400 000 001",
    role: "admin",
    status: "active",
    bookings: 0,
    totalSpent: 0,
    joinedAt: "2025-01-01",
  },
];

export const MOCK_SERVICES: Service[] = [
  {
    id: "SV-001",
    name: "Swedish Massage",
    category: "Relaxation",
    duration: 60,
    price: 110,
    description:
      "A gentle full-body massage perfect for relaxation and stress relief. Uses long, gliding strokes to soothe tense muscles.",
    image: "/images/services/swedish.jpg",
    active: true,
    bookings: 48,
  },
  {
    id: "SV-002",
    name: "Deep Tissue Massage",
    category: "Therapeutic",
    duration: 60,
    price: 130,
    description:
      "Targets deep layers of muscle and connective tissue to release chronic tension and muscle knots.",
    image: "/images/services/deep-tissue.jpg",
    active: true,
    bookings: 36,
  },
  {
    id: "SV-003",
    name: "Hot Stone Massage",
    category: "Luxury",
    duration: 90,
    price: 180,
    description:
      "Smooth heated basalt stones are used to warm and relax muscles for a deeply restorative experience.",
    image: "/images/services/hot-stone.jpg",
    active: true,
    bookings: 29,
  },
  {
    id: "SV-004",
    name: "Aromatherapy Ritual",
    category: "Relaxation",
    duration: 75,
    price: 155,
    description:
      "Combines therapeutic massage with carefully selected essential oils to balance mind, body, and spirit.",
    image: "/images/services/aromatherapy.jpg",
    active: true,
    bookings: 22,
  },
  {
    id: "SV-005",
    name: "Couples Retreat",
    category: "Couples",
    duration: 120,
    price: 320,
    description:
      "A shared wellness experience for two. Both partners enjoy side-by-side massages in our private couples suite.",
    image: "/images/services/couples.jpg",
    active: true,
    bookings: 18,
  },
  {
    id: "SV-006",
    name: "Bamboo Fusion",
    category: "Luxury",
    duration: 90,
    price: 175,
    description:
      "A unique treatment using warm bamboo sticks to massage, relax and energise the body.",
    image: "/images/services/bamboo.jpg",
    active: true,
    bookings: 14,
  },
  {
    id: "SV-007",
    name: "Prenatal Massage",
    category: "Therapeutic",
    duration: 60,
    price: 140,
    description:
      "Specially designed for expectant mothers, this nurturing massage relieves the aches of pregnancy.",
    image: "/images/services/prenatal.jpg",
    active: true,
    bookings: 11,
  },
  {
    id: "SV-008",
    name: "Reflexology",
    category: "Therapeutic",
    duration: 45,
    price: 90,
    description:
      "Therapeutic foot massage that applies pressure to specific points to promote healing throughout the body.",
    image: "/images/services/reflexology.jpg",
    active: false,
    bookings: 7,
  },
];

export const MOCK_CONTENT: ContentBlock[] = [
  {
    id: "C-001",
    page: "home",
    section: "hero",
    title: "Restore Your Balance",
    body: "Welcome to Serenity Wellness Spa — Melbourne's premium sanctuary for relaxation, rejuvenation, and holistic wellbeing. Step into a world of calm.",
    updatedAt: "2026-03-20T10:00:00Z",
  },
  {
    id: "C-002",
    page: "home",
    section: "intro",
    title: "Your Wellness Journey Begins Here",
    body: "At Serenity, we believe wellness is a journey, not a destination. Our expert therapists combine ancient healing traditions with modern techniques to create a truly personalised experience.",
    updatedAt: "2026-03-18T14:00:00Z",
  },
  {
    id: "C-003",
    page: "about",
    section: "story",
    title: "Our Story",
    body: "Founded in 2018 in the heart of Melbourne, Serenity Wellness Spa was born from a passion for holistic healing. We've helped thousands of clients find relief, relaxation, and renewal.",
    updatedAt: "2026-03-15T09:00:00Z",
  },
  {
    id: "C-004",
    page: "about",
    section: "mission",
    title: "Our Mission",
    body: "To provide a sanctuary of healing where every guest experiences transformative care through skilled touch, therapeutic treatments, and a deeply nurturing environment.",
    updatedAt: "2026-03-15T09:30:00Z",
  },
  {
    id: "C-005",
    page: "contact",
    section: "info",
    title: "Visit Us",
    body: "123 Wellness Lane, South Yarra, Melbourne VIC 3141\nPhone: +61 3 9000 1234\nEmail: hello@serenityspa.com.au\nHours: Mon–Sat 9am–8pm | Sun 10am–6pm",
    updatedAt: "2026-03-10T11:00:00Z",
  },
];

export const CHART_DATA = {
  bookingTrend: [
    { month: "Oct", bookings: 42, revenue: 5460 },
    { month: "Nov", bookings: 58, revenue: 7540 },
    { month: "Dec", bookings: 71, revenue: 9230 },
    { month: "Jan", bookings: 45, revenue: 5850 },
    { month: "Feb", bookings: 63, revenue: 8190 },
    { month: "Mar", bookings: 79, revenue: 10270 },
  ],
  serviceBreakdown: [
    { name: "Swedish", value: 48 },
    { name: "Deep Tissue", value: 36 },
    { name: "Hot Stone", value: 29 },
    { name: "Aromatherapy", value: 22 },
    { name: "Couples", value: 18 },
    { name: "Other", value: 32 },
  ],
  weeklyBookings: [
    { day: "Mon", bookings: 8 },
    { day: "Tue", bookings: 12 },
    { day: "Wed", bookings: 10 },
    { day: "Thu", bookings: 15 },
    { day: "Fri", bookings: 18 },
    { day: "Sat", bookings: 22 },
    { day: "Sun", bookings: 14 },
  ],
};
