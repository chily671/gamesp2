import AdminDashboard from "@/components/admin/AdminDashboard";

export const metadata = {
  title: "Event control — DATA TRAP",
  description: "Bảng quản trị sự kiện DATA TRAP.",
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return <AdminDashboard />;
}
