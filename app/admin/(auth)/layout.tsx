// Auth pages (login) have their own standalone layout without the admin sidebar
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
