import { Navigate, Outlet } from "react-router-dom";
const PrivateLoginRoutes = () => {
  const isAuth = localStorage.getItem("token");

  return !isAuth ? <Outlet /> : <Navigate to="/dataComList" />;
};
export default PrivateLoginRoutes;