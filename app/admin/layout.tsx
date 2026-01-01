import AdminLayout from "@/components/admin/AdminLayout";

export const metadata = {
  title: "Admin Dashboard - Tilers Hub",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <AdminLayout>{children}</AdminLayout>;
}
