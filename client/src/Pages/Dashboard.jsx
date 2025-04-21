import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import "../styles/Profile.css";
import { logout } from "../redux/userSlice/userSlice";
import { addDataCom } from "../redux/dataCom/dataCom";

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

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFiles({ ...files, [e.target.name]: e.target.files[0] });
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
  return (
    <div className="dashboard">
      <h2>Welcome, {user?.name}</h2>

      {user?.role === "commercial" ? (
        <div>Commercial Dashboard</div>
      ) : user?.role === "magasin" ? (
        <div>Magasin Dashboard</div>
      ) : (
        <div>Admin Dashboard</div>
      )}
      {/* 
      {status && <div className="status-message">{status}</div>}
      {errorMessage && <div className="error-message">{errorMessage}</div>}

      
      {valideMessage && <div className="success-message">{valideMessage}</div>} */}
      <form onSubmit={handleSubmit}>
        <input name="nom" placeholder="Nom" onChange={handleInputChange} />
        <input name="poid" placeholder="Poids" onChange={handleInputChange} />
        <input
          name="volume"
          placeholder="Volume"
          onChange={handleInputChange}
        />
        <input
          name="provenence"
          placeholder="Provenance"
          onChange={handleInputChange}
        />
        <input
          name="estimateTime"
          type="datetime-local"
          onChange={handleInputChange}
        />
        <input
          name="arrivedTime"
          type="datetime-local"
          onChange={handleInputChange}
        />

        <label>Bielle (PDF):</label>
        <input
          type="file"
          name="bielle"
          accept="application/pdf"
          onChange={handleFileChange}
        />

        <label>Facture (PDF):</label>
        <input
          type="file"
          name="facture"
          accept="application/pdf"
          onChange={handleFileChange}
        />

        <label>Packing Liste (PDF):</label>
        <input
          type="file"
          name="packingListe"
          accept="application/pdf"
          onChange={handleFileChange}
        />

        <button type="submit">Ajouter</button>
      </form>
      <h4
        onClick={() => {
          dispatch(logout());
          navigate("/");
        }}
      >
        Logout
      </h4>
    </div>
  );
};

export default Dashboard;
