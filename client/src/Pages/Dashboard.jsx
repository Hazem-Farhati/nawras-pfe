import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import "../styles/dashcss.css";

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
      {/* Header مع Logout في الزاوية العلوية اليمنى */}
      <div className="header">
        <h2>Welcome, {user?.name}</h2>
        <h4
          className="logout"
          onClick={() => {
            dispatch(logout());
            navigate("/");
          }}
        >
          Logout
        </h4>
      </div>

  

      <form onSubmit={handleSubmit}>
        <input
          className="input"
          name="nom"
          placeholder="Nom"
          onChange={handleInputChange}
        />
        <input
          className="input"
          name="poid"
          placeholder="Poids"
          onChange={handleInputChange}
        />
        <input
          className="input"
          name="volume"
          placeholder="Volume"
          onChange={handleInputChange}
        />
        <input
          className="input"
          name="provenence"
          placeholder="Provenance"
          onChange={handleInputChange}
        />
        <input
          className="input"
          name="estimateTime"
          type="datetime-local"
          onChange={handleInputChange}
        />
        <input
          className="input"
          name="arrivedTime"
          type="datetime-local"
          onChange={handleInputChange}
        />

        <label className="label">Bielle (PDF):</label>
        <input
          className="file-input"
          type="file"
          name="bielle"
          accept="application/pdf"
          onChange={handleFileChange}
        />

        <label className="label">Facture (PDF):</label>
        <input
          className="file-input"
          type="file"
          name="facture"
          accept="application/pdf"
          onChange={handleFileChange}
        />

        <label className="label">Packing Liste (PDF):</label>
        <input
          className="file-input"
          type="file"
          name="packingListe"
          accept="application/pdf"
          onChange={handleFileChange}
        />

        <button type="submit">Ajouter</button>
      </form>
    </div>
  );
};

export default Dashboard;
