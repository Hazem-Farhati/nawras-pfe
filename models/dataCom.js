const mongoose = require("mongoose");
const schema = mongoose.Schema;

const dataComSchema = new schema({
  nom: { type: String },
  poid: { type: String },
  user_id: { type: String },
  volume: { type: String },
  provenence: { type: String },
  bielle: { type: String },
  packingListe: { type: String },
  facture: { type: String },
  estimateTime: { type: Date },
  arrivedTime: { type: Date },

  preavisDarriver: { type: String, default: "" },
  avisDarriver: { type: String, default: "" },
  coments: { type: String, default: "" },
  statut: { type: String, default: "" },
});

const DataCom = mongoose.model("DataCom", dataComSchema);
module.exports = DataCom;
