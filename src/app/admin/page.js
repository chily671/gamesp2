import AdminDashboard from "@/components/admin/AdminDashboard";

export const metadata = {
  title: "Quản trị — Không gian 2",
  description: "Bảng quản trị Không gian 2.",
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return <AdminDashboard />;
}
