// src/app/admin/page.tsx
import AdminDashboardClient from "./AdminDashboardClient";

const AdminDashboard = async () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <AdminDashboardClient />{" "}
    </div>
  );
};

export default AdminDashboard;
