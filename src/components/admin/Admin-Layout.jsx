import { Outlet, useNavigate } from "react-router-dom";

export default function AdminLayout() {
  const navigate = useNavigate();
  const handleLoginClick = () => {
    navigate("/admin/login");
  };

  return (
    <div>
      <h2>Admin Area</h2>
      <button onClick={handleLoginClick}>Login</button>
      <Outlet /> 
    </div>
  );
}
