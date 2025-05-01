import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllDataComs,
  update,
  updateDataComFiles,
} from "../redux/dataCom/dataCom";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  Box,
  Chip,
  Divider,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SaveIcon from "@mui/icons-material/Save";
import AddIcon from "@mui/icons-material/Add";
import VisibilityIcon from "@mui/icons-material/Visibility";
import GetAppIcon from "@mui/icons-material/GetApp";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import { set } from "mongoose";

const DataComList = ({ refresh, setRefresh }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state?.user?.user);
  const { allDataComs } = useSelector((state) => state.dataCom);

  const [editingRow, setEditingRow] = useState(null);
  const [files, setFiles] = useState({
    preavisDarriver: null,
    avisDarriver: null,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [isViewCommentModalOpen, setIsViewCommentModalOpen] = useState(false);
  const [rejectComment, setRejectComment] = useState("");
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [currentComment, setCurrentComment] = useState("");

  const calculateTimeRemaining = (arrivalDate) => {
    const now = new Date();
    const arrival = new Date(arrivalDate);
    const diff = arrival - now;

    if (diff <= 0)
      return { days: 0, hours: 0, message: "Arrivé", color: "error.main" };

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    let message = "";
    let color = "text.secondary";

    if (days <= 2) {
      message = `⏳ ${days} jour(s) et ${hours} heure(s) restante(s)`;
      color = days < 1 ? "error.main" : "warning.main";
    }

    return { days, hours, message, color };
  };

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

  const handleOpenRejectModal = (id) => {
    setSelectedItemId(id);
    setIsRejectModalOpen(true);
  };

  const navigateToDashboard = () => {
    window.location.href = "/dashboard";
  };

  const handleReject = async () => {
    try {
      await dispatch(
        update({
          id: selectedItemId,
          fields: { statut: "reject", coments: rejectComment },
        })
      ).unwrap();
      setRefresh(!refresh);
      setIsRejectModalOpen(false);
      setRejectComment("");
    } catch (error) {
      console.error("Failed to reject:", error);
    }
  };

  useEffect(() => {
    dispatch(getAllDataComs());
  }, [dispatch, refresh]);

  const renderDocumentButtons = (document, name, prefix) => {
    if (!document) return "-";

    return (
      <Box sx={{ display: "flex", justifyContent: "center", gap: 1 }}>
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
          onClick={() =>
            handleDownload(
              `http://localhost:5000${document}`,
              `${prefix}_${name}.pdf`
            )
          }
        >
          <GetAppIcon fontSize="small" />
        </IconButton>
      </Box>
    );
  };

  return (
    <div className="p-4">
      <div style={{ display: "flex" }}>
        <img
          src="https://cdn-icons-png.flaticon.com/512/4383/4383773.png"
          alt=""
          style={{ width: "150px", margin: "20px" }}
        />
        <div style={{ margin: "20px" }}>
          <h2>
            Nom et prenom : {user?.nom} {user?.prenom}
          </h2>
          <h2>Role : {user?.role}</h2>
        </div>
      </div>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
          marginTop: "20px",
          marginRight: "20px",
        }}
      >
        <Typography
          variant="h5"
          fontWeight="bold"
          sx={{
            marginRight: "20px",
          }}
        >
          {"   "}Liste
        </Typography>
        {user?.role === "comercial" && (
          <Button
            variant="contained"
            color="primary"
            onClick={navigateToDashboard}
            startIcon={<AddIcon />}
          >
            Ajouter
          </Button>
        )}
      </Box>

      {allDataComs.length === 0 ? (
        <Typography variant="body1">Aucun DataCom trouvé.</Typography>
      ) : (
        <TableContainer component={Paper} elevation={3} sx={{ mb: 4 }}>
          <Table sx={{ minWidth: 650 }} size="small">
            <TableHead>
              <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                <TableCell sx={{ fontWeight: "bold" }}>Client</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Volume</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Provenance</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Magasin</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>BL</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Statut</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Facture</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Packing Liste</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>ETD</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>ETA</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>
                  Préavis d'arriver
                </TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>
                  Avis d'arriver
                </TableCell>
                {user?.role === "magasin" && (
                  <TableCell sx={{ fontWeight: "bold" }}>Actions</TableCell>
                )}
              </TableRow>
            </TableHead>

            <TableBody>
              {allDataComs
                .map((item) => {
                  const timeRemaining = calculateTimeRemaining(
                    item.arrivedTime
                  );
                  return (
                    <TableRow
                      key={item._id}
                      sx={{
                        "&:nth-of-type(odd)": { backgroundColor: "#fafafa" },
                        "&:hover": { backgroundColor: "#f0f7ff" },
                      }}
                    >
                      <TableCell>{item.nom}</TableCell>
                      <TableCell>{item.volume}</TableCell>
                      <TableCell>{item.provenence}</TableCell>
                      <TableCell>{item.poid}</TableCell>
                      <TableCell>
                        {(item?.statut === "accept" &&
                          user?.role === "magasin") ||
                        user?.role === "comercial"
                          ? renderDocumentButtons(
                              item.bielle,
                              item.nom,
                              "bielle"
                            )
                          : "-"}{" "}
                      </TableCell>
                      <TableCell>
                        {user?.role === "comercial" ? (
                          item?.statut === "accept" ? (
                            <Chip
                              label={"Validé"}
                              color="success"
                              size="small"
                              sx={{ fontSize: "0.75rem" }}
                            />
                          ) : item?.statut === "reject" ? (
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                              }}
                            >
                              <Typography
                                variant="body2"
                                color="error"
                                sx={{ fontWeight: "bold" }}
                              >
                                Rejeté
                              </Typography>
                              <IconButton
                                size="small"
                                onClick={() => {
                                  setCurrentComment(
                                    item?.coments || "Pas de commentaire"
                                  );
                                  setIsViewCommentModalOpen(true);
                                }}
                                sx={{ color: "text.secondary" }}
                              >
                                <ChatBubbleOutlineIcon fontSize="small" />
                              </IconButton>
                            </Box>
                          ) : (
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "center",
                                gap: 1,
                              }}
                            >
                              {item?.user_id !== user?._id ? (
                                <>
                                  <IconButton
                                    color="success"
                                    size="small"
                                    onClick={() => {
                                      dispatch(
                                        update({
                                          id: item._id,
                                          fields: { statut: "accept" },
                                        })
                                      )
                                        .then((res) => {
                                          if (
                                            res.meta.requestStatus ===
                                            "fulfilled"
                                          ) {
                                            setRefresh(!refresh); // utile si tu veux aussi garder le re-render local
                                            window.location.reload();
                                          }
                                        })
                                        .catch((error) =>
                                          console.error(
                                            "Failed to accept:",
                                            error
                                          )
                                        );
                                    }}
                                  >
                                    <CheckCircleIcon fontSize="small" />
                                  </IconButton>
                                  <IconButton
                                    color="error"
                                    size="small"
                                    onClick={() => {
                                      handleOpenRejectModal(item._id);
                                      setRefresh(!refresh);
                                    }}
                                  >
                                    <CancelIcon fontSize="small" />
                                  </IconButton>
                                </>
                              ) : (
                                "bielle en attente de confirmation"
                              )}
                            </Box>
                          )
                        ) : (
                          "-"
                        )}
                      </TableCell>
                      <TableCell>
                        {renderDocumentButtons(
                          item.facture,
                          item.nom,
                          "facture"
                        )}
                      </TableCell>
                      <TableCell>
                        {renderDocumentButtons(
                          item.packingListe,
                          item.nom,
                          "packing-list"
                        )}
                      </TableCell>
                      <TableCell>
                        {new Date(item.estimateTime).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Box>
                          {new Date(item.arrivedTime).toLocaleDateString()}
                          {timeRemaining.message && (
                            <Typography
                              variant="caption"
                              display="block"
                              color={timeRemaining.color}
                              sx={{ mt: 0.5, fontWeight: "bold" }}
                            >
                              {timeRemaining.message}
                            </Typography>
                          )}
                        </Box>
                      </TableCell>

                      <TableCell>
                        {renderDocumentButtons(
                          item.preavisDarriver,
                          item.nom,
                          "preavisDarriver"
                        )}
                      </TableCell>
                      <TableCell>
                        {renderDocumentButtons(
                          item.avisDarriver,
                          item.nom,
                          "avisDarriver"
                        )}
                      </TableCell>

                      {user?.role === "magasin" && (
                        <TableCell>
                          <Button
                            variant="contained"
                            size="small"
                            color="primary"
                            onClick={() => handleEdit(item._id)}
                            sx={{ textTransform: "none", py: 0.5 }}
                          >
                            Modifier
                          </Button>
                        </TableCell>
                      )}
                    </TableRow>
                  );
                })
                .reverse()}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Modal for file update */}
      <Dialog open={isModalOpen} onClose={handleCancel} maxWidth="sm" fullWidth>
        <DialogTitle
          sx={{
            m: 0,
            p: 2,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h6">Modifier les fichiers</Typography>
          <IconButton
            aria-label="close"
            onClick={handleCancel}
            sx={{ color: "gray" }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <Divider />
        <DialogContent>
          <Box sx={{ my: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Préavis:
            </Typography>
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
            <Typography variant="subtitle2" gutterBottom>
              Avis:
            </Typography>
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
          <Button onClick={handleCancel} color="inherit" variant="outlined">
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

      {/* Modal for rejection */}
      <Dialog
        open={isRejectModalOpen}
        onClose={() => {
          setIsRejectModalOpen(false);
          setRejectComment("");
        }}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle
          sx={{
            m: 0,
            p: 2,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h6">Rejeter avec commentaire</Typography>
          <IconButton
            aria-label="close"
            onClick={() => {
              setIsRejectModalOpen(false);
              setRejectComment("");
            }}
            sx={{ color: "gray" }}
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
            value={rejectComment}
            onChange={(e) => setRejectComment(e.target.value)}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={() => {
              setIsRejectModalOpen(false);
              setRejectComment("");
              setRefresh(!refresh);
            }}
            color="inherit"
            variant="outlined"
          >
            Annuler
          </Button>
          <Button
            onClick={() => {
              handleReject();
              setRefresh(!refresh);
              setIsRejectModalOpen(false);
            }}
            color="primary"
            variant="contained"
            disabled={!rejectComment.trim()}
          >
            Mettre à jour
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal for viewing rejection comment */}
      <Dialog
        open={isViewCommentModalOpen}
        onClose={() => setIsViewCommentModalOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle
          sx={{
            m: 0,
            p: 2,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h6">Commentaire de rejet</Typography>
          <IconButton
            aria-label="close"
            onClick={() => setIsViewCommentModalOpen(false)}
            sx={{ color: "gray" }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <Divider />
        <DialogContent>
          <Typography variant="body1" sx={{ whiteSpace: "pre-line", p: 2 }}>
            {currentComment}
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={() => setIsViewCommentModalOpen(false)}
            color="primary"
            variant="contained"
          >
            Fermer
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default DataComList;
