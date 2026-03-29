// Demo authentication - static credentials only
export const DEMO_USER = {
  email: "demo@wellness.com",
  password: "123456",
  name: "Alexandra Chen",
  avatar: null,
};

export function validateLogin(email: string, password: string): boolean {
  return email === DEMO_USER.email && password === DEMO_USER.password;
}

export function getDemoUser() {
  return {
    id: "demo-001",
    name: DEMO_USER.name,
    email: DEMO_USER.email,
    joinedDate: "March 2024",
    totalSessions: 12,
    nextAppointment: "Tuesday, 8 April 2026 at 2:00 PM",
    membershipTier: "Wellness Gold",
  };
}
