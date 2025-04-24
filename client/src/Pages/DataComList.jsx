import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllDataComs, updateDataComFiles } from "../redux/dataCom/dataCom";
import "../styles/DataComList.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faSave, faDownload } from "@fortawesome/free-solid-svg-icons";
import { userCurrent } from "../redux/userSlice/userSlice";

// Import Material UI components
import { 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  Button, IconButton, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Typography, Box, Chip, Divider
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SaveIcon from '@mui/icons-material/Save';
import VisibilityIcon from '@mui/icons-material/Visibility';
import GetAppIcon from '@mui/icons-material/GetApp';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

const DataComList = () => {
  const dispatch = useDispatch();

  const user = useSelector((state) => state?.user?.user);
  const { allDataComs, status, error } = useSelector((state) => state.dataCom);
  const [editingRow, setEditingRow] = useState(null);
  const [files, setFiles] = useState({
    preavisDarriver: null,
    avisDarriver: null,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  console.log("first", user);
  useEffect(() => {
    dispatch(getAllDataComs());
  }, [dispatch]);

  const handleDownload = async (url, filename) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (err) {
      console.error("Download failed:", err);
    }
  };

  const handleFileChange = (e) => {
    const { name, files: selectedFiles } = e.target;
    setFiles((prev) => ({
      ...prev,
      [name]: selectedFiles[0],
    }));
  };

  const handleEdit = (id) => {
    setEditingRow(id);
    setFiles({ preavisDarriver: null, avisDarriver: null });
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setEditingRow(null);
  };

  const handleSave = async (id) => {
    const formData = new FormData();
    if (files.preavisDarriver)
      formData.append("preavisDarriver", files.preavisDarriver);
    if (files.avisDarriver) formData.append("avisDarriver", files.avisDarriver);

    try {
      await dispatch(updateDataComFiles({ id, formData })).unwrap();
      dispatch(getAllDataComs());
      setIsModalOpen(false);
      setEditingRow(null);
    } catch (error) {
      console.error("Update failed:", error);
    }
  };

  // Rendu des boutons de document avec Material UI
  const renderDocumentButtons = (document, name, prefix) => {
    if (!document) return "-";
    
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
        <IconButton 
          size="small" 
          color="primary"
          href={`http://localhost:5000${document}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <VisibilityIcon fontSize="small" />
        </IconButton>
        <IconButton 
          size="small" 
          color="success"
          onClick={() => handleDownload(`http://localhost:5000${document}`, `${prefix}_${name}.pdf`)}
        >
          <GetAppIcon fontSize="small" />
        </IconButton>
      </Box>
    );
  };

  if (status === "loading") return <Typography>Chargement...</Typography>;
  if (status === "failed") return <Typography color="error">Erreur: {error}</Typography>;

  return (
    <div className="p-4">
      <Typography variant="h5" fontWeight="bold" sx={{ mb: 3 }}>
        Liste des DataComs
      </Typography>
      
      {allDataComs.length === 0 ? (
        <Typography variant="body1">Aucun DataCom trouvé.</Typography>
      ) : (
        <TableContainer component={Paper} elevation={3} sx={{ mb: 4, overflow: 'auto' }}>
          <Table sx={{ minWidth: 650 }} size="small">
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                <TableCell sx={{ fontWeight: 'bold' }}>Nom</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Poids</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Volume</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Provenance</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Date Estimée</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Date Arrivée</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Bielle</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Facture</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Packing Liste</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Préavis</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Avis</TableCell>
                {user?.role === "comercial" && (
                  <TableCell sx={{ fontWeight: 'bold' }}>Statut</TableCell>
                )}
                {user?.role === "magasin" && (
                  <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                )}
              </TableRow>
            </TableHead>
            
            <TableBody>
              {allDataComs.map((item) => (
                <>
                  {user?.role === "comercial" && (
                    <TableRow 
                      key={item._id} 
                      sx={{ 
                        '&:nth-of-type(odd)': { backgroundColor: '#fafafa' },
                        '&:hover': { backgroundColor: '#f0f7ff' }
                      }}
                    >
                      <TableCell>{item.nom}</TableCell>
                      <TableCell>{item.poid}</TableCell>
                      <TableCell>{item.volume}</TableCell>
                      <TableCell>{item.provenence}</TableCell>
                      <TableCell>{new Date(item.estimateTime).toLocaleDateString()}</TableCell>
                      <TableCell>{new Date(item.arrivedTime).toLocaleDateString()}</TableCell>
                      <TableCell>{renderDocumentButtons(item.bielle, item.nom, 'bielle')}</TableCell>
                      <TableCell>{renderDocumentButtons(item.facture, item.nom, 'facture')}</TableCell>
                      <TableCell>{renderDocumentButtons(item.packingListe, item.nom, 'packing-list')}</TableCell>
                      <TableCell>{renderDocumentButtons(item.preavisDarriver, item.nom, 'preavisDarriver')}</TableCell>
                      <TableCell>{renderDocumentButtons(item.avisDarriver, item.nom, 'avisDarriver')}</TableCell>
                      
                      {user?.role === "comercial" && (
                        <TableCell>
                          {item?.statut === "" || item?.statut === "reject" ? (
                            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                              <IconButton color="success" size="small">
                                <CheckCircleIcon fontSize="small" />
                              </IconButton>
                              {item?.statut === "" && (
                                <IconButton 
                                  color="error" 
                                  size="small" 
                                  onClick={() => setIsRejectModalOpen(true)}
                                >
                                  <CancelIcon fontSize="small" />
                                </IconButton>
                              )}
                            </Box>
                          ) : item?.statut === "accept" ? (
                            <Chip 
                              label={item?.coments || "Validé"} 
                              color="success" 
                              size="small" 
                              sx={{ fontSize: '0.75rem' }}
                            />
                          ) : null}
                        </TableCell>
                      )}
                      
                      {user?.role === "magasin" && (
                        <TableCell>
                          <Button
                            variant="contained"
                            size="small"
                            color="primary"
                            onClick={() => handleEdit(item._id)}
                            sx={{ textTransform: 'none', py: 0.5 }}
                          >
                            Update
                          </Button>
                        </TableCell>
                      )}
                    </TableRow>
                  )}
                </>
              ))}
              
              {allDataComs.map((item) => (
                <>
                  {user?.role === "magasin" && item?.statut === "accept" && (
                    <TableRow 
                      key={item._id} 
                      sx={{ 
                        '&:nth-of-type(odd)': { backgroundColor: '#fafafa' },
                        '&:hover': { backgroundColor: '#f0f7ff' }
                      }}
                    >
                      <TableCell>{item.nom}</TableCell>
                      <TableCell>{item.poid}</TableCell>
                      <TableCell>{item.volume}</TableCell>
                      <TableCell>{item.provenence}</TableCell>
                      <TableCell>{new Date(item.estimateTime).toLocaleDateString()}</TableCell>
                      <TableCell>{new Date(item.arrivedTime).toLocaleDateString()}</TableCell>
                      <TableCell>{renderDocumentButtons(item.bielle, item.nom, 'bielle')}</TableCell>
                      <TableCell>{renderDocumentButtons(item.facture, item.nom, 'facture')}</TableCell>
                      <TableCell>{renderDocumentButtons(item.packingListe, item.nom, 'packing-list')}</TableCell>
                      <TableCell>{renderDocumentButtons(item.preavisDarriver, item.nom, 'preavisDarriver')}</TableCell>
                      <TableCell>{renderDocumentButtons(item.avisDarriver, item.nom, 'avisDarriver')}</TableCell>
                      
                      {user?.role === "comercial" && (
                        <TableCell>
                          {item?.statut === "" || item?.statut === "reject" ? (
                            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                              <IconButton color="success" size="small">
                                <CheckCircleIcon fontSize="small" />
                              </IconButton>
                              {item?.statut === "" && (
                                <IconButton 
                                  color="error" 
                                  size="small" 
                                  onClick={() => setIsRejectModalOpen(true)}
                                >
                                  <CancelIcon fontSize="small" />
                                </IconButton>
                              )}
                            </Box>
                          ) : item?.statut === "accept" ? (
                            <Chip 
                              label={item?.coments || "Validé"} 
                              color="success" 
                              size="small"
                              sx={{ fontSize: '0.75rem' }}
                            />
                          ) : null}
                        </TableCell>
                      )}
                      
                      {user?.role === "magasin" && (
                        <TableCell>
                          <Button
                            variant="contained"
                            size="small"
                            color="primary"
                            onClick={() => handleEdit(item._id)}
                            sx={{ textTransform: 'none', py: 0.5 }}
                          >
                            Update
                          </Button>
                        </TableCell>
                      )}
                    </TableRow>
                  )}
                </>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Modal for file update - using Material UI Dialog */}
      <Dialog 
        open={isModalOpen} 
        onClose={handleCancel}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ m: 0, p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">Modifier les fichiers</Typography>
          <IconButton
            aria-label="close"
            onClick={handleCancel}
            sx={{ color: 'gray' }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <Divider />
        <DialogContent>
          <Box sx={{ my: 2 }}>
            <Typography variant="subtitle2" gutterBottom>Préavis:</Typography>
            <TextField
              type="file"
              id="preavisDarriver"
              name="preavisDarriver"
              onChange={handleFileChange}
              fullWidth
              variant="outlined"
              size="small"
              InputLabelProps={{ shrink: true }}
            />
          </Box>
          <Box sx={{ my: 2 }}>
            <Typography variant="subtitle2" gutterBottom>Avis:</Typography>
            <TextField
              type="file"
              id="avisDarriver"
              name="avisDarriver"
              onChange={handleFileChange}
              fullWidth
              variant="outlined"
              size="small"
              InputLabelProps={{ shrink: true }}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button 
            onClick={handleCancel} 
            color="inherit"
            variant="outlined"
          >
            Annuler
          </Button>
          <Button 
            onClick={() => handleSave(editingRow)} 
            color="primary"
            variant="contained"
            startIcon={<SaveIcon />}
          >
            Enregistrer
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal for rejection comment - using Material UI Dialog */}
      <Dialog
        open={isRejectModalOpen}
        onClose={() => setIsRejectModalOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ m: 0, p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">Rejeter avec commentaire</Typography>
          <IconButton
            aria-label="close"
            onClick={() => setIsRejectModalOpen(false)}
            sx={{ color: 'gray' }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <Divider />
        <DialogContent>
          <TextField
            id="comment"
            label="Commentaire"
            multiline
            rows={4}
            placeholder="Entrez votre commentaire ici..."
            fullWidth
            margin="normal"
            variant="outlined"
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button 
            onClick={() => setIsRejectModalOpen(false)} 
            color="inherit"
            variant="outlined"
          >
            Annuler
          </Button>
          <Button 
            color="primary"
            variant="contained"
          >
            Mettre à jour
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default DataComList;