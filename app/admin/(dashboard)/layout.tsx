import type { Metadata } from "next";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminNavbar from "@/components/admin/AdminNavbar";
import { ToastProvider } from "@/components/admin/AdminToast";
import AdminDarkModeWrapper from "@/components/admin/AdminDarkModeWrapper";
import AdminLayoutClient from "@/components/admin/AdminLayoutClient";

export const metadata: Metadata = {
  title: {
    template: "%s | Serenity Admin",
    default: "Serenity Admin",
  },
  description: "Serenity Wellness Spa — Admin Dashboard",
  robots: { index: false, follow: false },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ToastProvider>
      <AdminDarkModeWrapper>
        <div className="min-h-screen bg-[#F8FBF9] dark:bg-gray-950">
          <AdminSidebar />
          <AdminLayoutClient>
            <AdminNavbar />
            <main className="flex-1 p-4 sm:p-6">
              {children}
            </main>
          </AdminLayoutClient>
        </div>
      </AdminDarkModeWrapper>
    </ToastProvider>
  );
}
