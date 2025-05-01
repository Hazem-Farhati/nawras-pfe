import logo from "./logo.svg";
import "./App.css";
import { Route, Routes, useNavigate } from "react-router-dom";
import Profile from "./Pages/Profile";
import Register from "./Components/Register";
import { getusers, logout, userCurrent } from "./redux/userSlice/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import Verifyaccount from "./Pages/Verifyaccount";
import Forgotpassword from "./Pages/Forgotpassword";
import Reset_password from "./Pages/Reset_password";
import Registerlogin from "./Pages/Registerlogin";
import Dashboard from "./Pages/Dashboard";
import DataComList from "./Pages/DataComList";
import PrivateRoute from "./Utils/PrivateRoute";
import PrivateLoginRoutes from "./Utils/PrivateLoginRoutes";
import { getAllDataComs } from "./redux/dataCom/dataCom";
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Divider,
  Grid,
  IconButton,
  Paper,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import {
  CloudUpload as CloudUploadIcon,
  ExitToApp as LogoutIcon,
  AddCircle as AddCircleIcon,
} from "@mui/icons-material";
// --------------------end importation------------------
function App() {
  // State for refresh
  const [refresh, setRefresh] = useState(false);
  const navigate = useNavigate();

  // Verify user is logged in
  const isAuth = localStorage.getItem("token");
  console.log(isAuth, "eeee");

  // Declaration dispatch
  const dispatch = useDispatch();

  // useEffect & dispatch to get data
  useEffect(() => {
    if (isAuth) {
      dispatch(userCurrent());
    }
    dispatch(getusers());
    dispatch(getAllDataComs());
  }, [dispatch, refresh]);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };
  const users = useSelector((state) => state.user?.users);
  const user = useSelector((state) => state.user?.user);

  console.log(users, "hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh");

  return (
    <div>
      {isAuth && (
        <AppBar position="static" color="primary">
          <Toolbar>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                cursor: "pointer",
              }}
            >
              {user?.role === "comercial" && (
                <Typography
                  onClick={() => navigate("/dashboard")}
                  variant="subtitle1"
                  sx={{ mr: 2 }}
                >
                  Ajouter
                </Typography>
              )}

              <Typography
                onClick={() => navigate("/dataComList")}
                variant="subtitle1"
                sx={{ mr: 2 }}
              >
                Liste
              </Typography>
            </Box>
            <Typography
              variant="h6"
              component="div"
              sx={{ flexGrow: 1 }}
            ></Typography>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Typography variant="subtitle1" sx={{ mr: 2 }}>
                Hello, {user?.nom || "User"}
              </Typography>

              <IconButton color="inherit" onClick={handleLogout}>
                <LogoutIcon />
              </IconButton>
            </Box>
          </Toolbar>
        </AppBar>
      )}
      <div className="app">
        <Routes>
          <Route element={<PrivateLoginRoutes />}>
            <Route path="/" element={<Registerlogin />} />
          </Route>
          <Route element={<PrivateRoute />}>
            {user?.role === "comercial" && (
              <Route path="/dashboard" element={<Dashboard />} />
            )}
            <Route
              path="/dataComList"
              element={
                <DataComList
                  user={user}
                  setRefresh={setRefresh}
                  refresh={refresh}
                />
              }
            />{" "}
            <Route path="/verify-account/:token" element={<Verifyaccount />} />
            <Route path="/forgotpassword" element={<Forgotpassword />} />
            <Route path="/reset-password/:token" element={<Reset_password />} />
          </Route>
        </Routes>
      </div>
    </div>
  );
}

export default App;
