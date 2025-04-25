const express = require("express");
const dataComRouter = express.Router();
const DataCom = require("../models/dataCom");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Create uploads directory if not exist
const uploadDir = "./uploads";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Multer config
const storage = multer.diskStorage({
  destination: uploadDir,
  filename: (req, file, cb) => {
    cb(null, `file_${Date.now()}${path.extname(file.originalname)}`);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    // Accept only PDF files
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Only PDF files are allowed"));
    }
  },
});
//get all dataComs
// GET ALL DataComs
dataComRouter.get("/all", async (req, res) => {
  try {
    const result = await DataCom.find();
    res.send({ dataComs: result, msg: "All dataComs" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ msg: "Server Error" });
  }
});

///get  dataComs by id
dataComRouter.get("/getbyid/:id", async (req, res) => {
  try {
    let result = await DataCom.findById(req.params.id);
    res.send({
      dataComs: result,
      msg: "this is dataCom by id",
    });
  } catch (error) {
    console.log(error);
  }
});

//update dataCom by id
dataComRouter.put("/update/:id", async (req, res) => {
  try {
    const result = await DataCom.findByIdAndUpdate(
      { _id: req.params.id },
      { $set: { ...req.body } },
      { new: true }
    );
    res.send({ newDataCom: result, msg: "Cours updated" });
  } catch (error) {
    console.log(error);
  }
});
// dataCom.routes.js
dataComRouter.put(
  "/update-files/:id",
  upload.fields([
    { name: "preavisDarriver", maxCount: 1 },
    { name: "avisDarriver", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const { id } = req.params;
      const updateData = {};

      if (req.files?.preavisDarriver) {
        updateData.preavisDarriver = `/uploads/${req.files.preavisDarriver[0].filename}`;
      }
      if (req.files?.avisDarriver) {
        updateData.avisDarriver = `/uploads/${req.files.avisDarriver[0].filename}`;
      }

      const updatedDataCom = await DataCom.findByIdAndUpdate(id, updateData, {
        new: true,
      });

      res.status(200).json({
        success: true,
        dataCom: updatedDataCom,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Erreur serveur",
      });
    }
  }
);

//delete dataCom

dataComRouter.delete("/delete/:id", async (req, res) => {
  try {
    let result = await DataCom.findByIdAndDelete(req.params.id);
    res.send({ msg: "dataCom is delete" });
  } catch (error) {
    console.log(error);
  }
});

//post dataCom

// POST with files
dataComRouter.post(
  "/add",
  upload.fields([
    { name: "bielle", maxCount: 1 },
    { name: "facture", maxCount: 1 },
    { name: "packingListe", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const {
        nom,
        poid,
        user_id,
        volume,
        provenence,
        estimateTime,
        arrivedTime,
      } = req.body;

      const newDataCom = new DataCom({
        nom,
        poid,
        user_id,
        volume,
        provenence,
        estimateTime,
        arrivedTime,
        bielle: req.files.bielle
          ? `/uploads/${req.files.bielle[0].filename}`
          : "",
        facture: req.files.facture
          ? `/uploads/${req.files.facture[0].filename}`
          : "",
        packingListe: req.files.packingListe
          ? `/uploads/${req.files.packingListe[0].filename}`
          : "",
      });

      const result = await newDataCom.save();
      res.status(201).send({ dataCom: result, msg: "DataCom is added" });
    } catch (error) {
      console.error(error);
      res.status(500).send({ msg: "Server error" });
    }
  }
);

module.exports = dataComRouter;
