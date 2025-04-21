import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllDataComs, updateDataComFiles } from "../redux/dataCom/dataCom";

const DataComList = () => {
  const dispatch = useDispatch();
  const { allDataComs, status, error } = useSelector((state) => state.dataCom);

  const [editingRow, setEditingRow] = useState(null);
  const [files, setFiles] = useState({
    preavisDarriver: null,
    avisDarriver: null,
  });

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
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleEdit = (id) => {
    setEditingRow(id);
    setFiles({ preavisDarriver: null, avisDarriver: null });
  };

  const handleCancel = () => {
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
      setEditingRow(null);
    } catch (error) {
      console.error("Update failed:", error);
    }
  };

  const handleFileChange = (e) => {
    const { name, files: selectedFiles } = e.target;
    setFiles((prev) => ({
      ...prev,
      [name]: selectedFiles[0],
    }));
  };

  if (status === "loading") return <p>Chargement...</p>;
  if (status === "failed") return <p>Erreur: {error}</p>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Liste des DataComs</h2>
      {allDataComs.length === 0 ? (
        <p>Aucun DataCom trouvé.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-4 py-2">Nom</th>
                <th className="border px-4 py-2">Poids</th>
                <th className="border px-4 py-2">Volume</th>
                <th className="border px-4 py-2">Provenance</th>
                <th className="border px-4 py-2">Date Estimée</th>
                <th className="border px-4 py-2">Date Arrivée</th>
                <th className="border px-4 py-2">Bielle</th>
                <th className="border px-4 py-2">Facture</th>
                <th className="border px-4 py-2">Packing Liste</th>
                <th className="border px-4 py-2">Préavis</th>
                <th className="border px-4 py-2">Avis</th>
                <th className="border px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {allDataComs.map((item) => (
                <tr key={item._id} className="text-center">
                  <td className="border px-4 py-2">{item.nom}</td>
                  <td className="border px-4 py-2">{item.poid}</td>
                  <td className="border px-4 py-2">{item.volume}</td>
                  <td className="border px-4 py-2">{item.provenence}</td>
                  <td className="border px-4 py-2">
                    {new Date(item.estimateTime).toLocaleDateString()}
                  </td>
                  <td className="border px-4 py-2">{item.arrivedTime}</td>

                  {/* Bielle PDF */}
                  <td className="border px-2 py-2 space-x-1">
                    {item.bielle && (
                      <>
                        <a
                          href={`http://localhost:5000${item.bielle}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 underline mr-2"
                        >
                          Voir
                        </a>
                        <button
                          onClick={() =>
                            handleDownload(
                              `http://localhost:5000${item.bielle}`,
                              `bielle_${item.nom}.pdf`
                            )
                          }
                          className="text-green-600 underline"
                        >
                          Télécharger
                        </button>
                      </>
                    )}
                  </td>

                  {/* Facture PDF */}
                  <td className="border px-2 py-2 space-x-1">
                    {item.facture && (
                      <>
                        <a
                          href={`http://localhost:5000${item.facture}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 underline mr-2"
                        >
                          Voir
                        </a>
                        <button
                          onClick={() =>
                            handleDownload(
                              `http://localhost:5000${item.facture}`,
                              `facture_${item.nom}.pdf`
                            )
                          }
                          className="text-green-600 underline"
                        >
                          Télécharger
                        </button>
                      </>
                    )}
                  </td>

                  {/* Packing Liste PDF */}
                  <td className="border px-2 py-2 space-x-1">
                    {item.packingListe && (
                      <>
                        <a
                          href={`http://localhost:5000${item.packingListe}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 underline mr-2"
                        >
                          Voir
                        </a>
                        <button
                          onClick={() =>
                            handleDownload(
                              `http://localhost:5000${item.packingListe}`,
                              `packing-list_${item.nom}.pdf`
                            )
                          }
                          className="text-green-600 underline"
                        >
                          Télécharger
                        </button>
                      </>
                    )}
                  </td>

                  {/* Préavis Upload */}
                  <td className="border px-2 py-2">
                    {editingRow === item._id ? (
                      <input
                        type="file"
                        name="preavisDarriver"
                        onChange={handleFileChange}
                      />
                    ) : item.preavisDarriver ? (
                      <>
                        <a
                          href={`http://localhost:5000${item.preavisDarriver}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 underline"
                        >
                          Voir
                        </a>
                        <button
                          onClick={() =>
                            handleDownload(
                              `http://localhost:5000${item.preavisDarriver}`,
                              `preavisDarriver${item.preavisDarriver}.pdf`
                            )
                          }
                          className="text-green-600 underline"
                        >
                          Télécharger
                        </button>
                      </>
                    ) : (
                      "-"
                    )}
                  </td>

                  {/* Avis Upload */}
                  <td className="border px-2 py-2">
                    {editingRow === item._id ? (
                      <input
                        type="file"
                        name="avisDarriver"
                        onChange={handleFileChange}
                      />
                    ) : item.avisDarriver ? (
                      <>
                        <a
                          href={`http://localhost:5000${item.avisDarriver}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 underline"
                        >
                          Voir
                        </a>
                        <button
                          onClick={() =>
                            handleDownload(
                              `http://localhost:5000${item.avisDarriver}`,
                              `avisDarriver${item.avisDarriver}.pdf`
                            )
                          }
                          className="text-green-600 underline"
                        >
                          Télécharger
                        </button>
                      </>
                    ) : (
                      "-"
                    )}
                  </td>

                  {/* Actions */}
                  <td className="border px-2 py-2 space-x-2">
                    {editingRow === item._id ? (
                      <>
                        <button
                          onClick={() => handleSave(item._id)}
                          className="text-white bg-green-600 px-2 py-1 rounded"
                        >
                          Enregistrer
                        </button>
                        <button
                          onClick={handleCancel}
                          className="text-white bg-gray-500 px-2 py-1 rounded"
                        >
                          Annuler
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => handleEdit(item._id)}
                        className="text-white bg-blue-600 px-2 py-1 rounded"
                      >
                        Update
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default DataComList;
