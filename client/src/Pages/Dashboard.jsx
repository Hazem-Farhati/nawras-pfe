import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

// Material UI imports
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
import { styled } from "@mui/material/styles";

import { logout } from "../redux/userSlice/userSlice";
import { addDataCom } from "../redux/dataCom/dataCom";

// Styled component for file inputs
const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

const Dashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector((state) => state.user?.user);

  const [form, setForm] = useState({
    nom: "",
    poid: "",
    volume: "",
    provenence: "",
    estimateTime: "",
    arrivedTime: "",
  });

  const [files, setFiles] = useState({
    bielle: null,
    facture: null,
    packingListe: null,
  });

  const [fileNames, setFileNames] = useState({
    bielle: "No file chosen",
    facture: "No file chosen",
    packingListe: "No file chosen",
  });

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFiles({ ...files, [e.target.name]: e.target.files[0] });
    setFileNames({
      ...fileNames,
      [e.target.name]: e.target.files[0]?.name || "No file chosen",
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();

    // Add text fields
    Object.entries(form).forEach(([key, value]) => {
      formData.append(key, value);
    });

    // Add files
    if (files.bielle) formData.append("bielle", files.bielle);
    if (files.facture) formData.append("facture", files.facture);
    if (files.packingListe) formData.append("packingListe", files.packingListe);

    // Dispatch Redux action
    dispatch(addDataCom(formData));
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" color="primary">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Dashboard
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Typography variant="subtitle1" sx={{ mr: 2 }}>
              Hello, {user?.name || "User"}
            </Typography>
            <IconButton color="inherit" onClick={handleLogout}>
              <LogoutIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
          <Typography variant="h5" component="h2" sx={{ mb: 4 }}>
            Add New Shipment
          </Typography>

          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Nom"
                  name="nom"
                  variant="outlined"
                  onChange={handleInputChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Poids"
                  name="poid"
                  variant="outlined"
                  onChange={handleInputChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Volume"
                  name="volume"
                  variant="outlined"
                  onChange={handleInputChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Provenance"
                  name="provenence"
                  variant="outlined"
                  onChange={handleInputChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Estimated Time"
                  name="estimateTime"
                  type="datetime-local"
                  InputLabelProps={{ shrink: true }}
                  variant="outlined"
                  onChange={handleInputChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Arrived Time"
                  name="arrivedTime"
                  type="datetime-local"
                  InputLabelProps={{ shrink: true }}
                  variant="outlined"
                  onChange={handleInputChange}
                  required
                />
              </Grid>

              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Document Uploads
                </Typography>
              </Grid>

              <Grid item xs={12} md={4}>
                <Card variant="outlined" sx={{ height: "100%" }}>
                  <CardContent>
                    <Typography variant="subtitle1" gutterBottom>
                      Bielle (PDF)
                    </Typography>
                    <Typography variant="caption" display="block" gutterBottom>
                      {fileNames.bielle}
                    </Typography>
                    <Button
                      component="label"
                      variant="contained"
                      startIcon={<CloudUploadIcon />}
                      sx={{ mt: 1 }}
                    >
                      Upload
                      <VisuallyHiddenInput
                        type="file"
                        name="bielle"
                        accept="application/pdf"
                        onChange={handleFileChange}
                      />
                    </Button>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={4}>
                <Card variant="outlined" sx={{ height: "100%" }}>
                  <CardContent>
                    <Typography variant="subtitle1" gutterBottom>
                      Facture (PDF)
                    </Typography>
                    <Typography variant="caption" display="block" gutterBottom>
                      {fileNames.facture}
                    </Typography>
                    <Button
                      component="label"
                      variant="contained"
                      startIcon={<CloudUploadIcon />}
                      sx={{ mt: 1 }}
                    >
                      Upload
                      <VisuallyHiddenInput
                        type="file"
                        name="facture"
                        accept="application/pdf"
                        onChange={handleFileChange}
                      />
                    </Button>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={4}>
              <Card variant="outlined" sx={{ height: "100%" }}>
  <CardContent sx={{ p: 2 }}> {/* Reduced padding */}
    <Typography variant="body2" sx={{ fontWeight: 'medium' }}> {/* Smaller text */}
      Packing Liste (PDF)
    </Typography>
    <Typography variant="caption" display="block" sx={{ mt: 0.5, fontSize: '0.7rem' }}> {/* Smaller file name */}
      {fileNames.packingListe}
    </Typography>
    <Button
      component="label"
      variant="contained"
      size="small" 
      startIcon={<CloudUploadIcon fontSize="small" />}
      sx={{ mt: 1, py: 0.5 }} 
    >
      Upload
      <VisuallyHiddenInput
        type="file"
        name="packingListe"
        accept="application/pdf"
        onChange={handleFileChange}
      />
    </Button>
  </CardContent>
</Card>
              </Grid>

              <Grid item xs={12} sx={{ mt: 3, textAlign: "center" }}>
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  color="primary"
                  startIcon={<AddCircleIcon />}
                >
                  Ajouter
                </Button>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Container>
    </Box>
  );
};

export default Dashboard;
