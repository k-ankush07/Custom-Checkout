import { Navigate } from "react-router-dom";

export default function PrivateRoute({ children }) {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

  if (!isLoggedIn) {
    alert("You must login first!");
    return <Navigate to="/admin/login" />;
  }

  return children;
}
