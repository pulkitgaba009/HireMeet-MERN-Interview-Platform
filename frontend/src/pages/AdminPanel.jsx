import AdminNav from "../components/AdminNav";
import { Outlet } from "react-router-dom";

function AdminPanel() {
  return (
    <div>
      <AdminNav />
      <div className="p-6">
        <Outlet />
      </div>
    </div>
  );
}

export default AdminPanel;