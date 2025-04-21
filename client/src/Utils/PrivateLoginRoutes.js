import { Navigate, Outlet } from "react-router-dom";
const PrivateLoginRoutes = () => {
  const isAuth = localStorage.getItem("token");

  return !isAuth ? <Outlet /> : <Navigate to="/dashboard" />;
};
export default PrivateLoginRoutes;