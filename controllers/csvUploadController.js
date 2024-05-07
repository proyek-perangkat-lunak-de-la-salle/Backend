import csv from "csv-parser";
import fs from "fs";
import multer from "multer";
import kuesioner from "../models/kuesionerModel.js";
import { spawn } from "child_process";
import history from "../models/historyModel.js";
import informasiPJK from "../models/informasiPJKModel.js";

const upload = multer({ dest: "uploads/" });

export const uploadCsv = async (req, res) => {
  try {
    // Check if user is authenticated and is an 'admin wilayah'
    if (!req.user || req.user.role !== "Admin Wilayah") {
      return res.status(403).json({ message: "Unauthorized" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    const columnMapping = {
      "Jenis Kelamin": "jenis_kelamin",
      "Tinggi Badan (cm)": "tinggi_badan",
      "Berat Badan (kg)": "berat_badan",
      "1. Seberapa paham anda tentang Penyakit Jantung Koroner (PJK)?":
        "paham_pjk",
      "2. Apakah anda sudah pernah melakukan check-up kesehatan jantung?":
        "checkup_rutin",
      "3. Apakah anda merasakan nyeri dada di sebelah kiri? (Nyeri seperti terbakar, menusuk tajam dan mungkin hingga mengalami penjalaran ke rahang atau ke lengan kiri)":
        "nyeri_dada",
      "4. Apakah anda merasakan mual saat melakukan aktivitas sehari-hari seperti saat jalan kaki atau saat naik tangga?":
        "mual",
      "5. Apakah anda mengalami sesak napas saat melakukan aktivitas sehari-hari seperti saat jalan kaki atau saat naik tangga?":
        "sesak_napas",
      "6. Apakah anda merasakan nyeri ulu hati saat melakukan aktivitas sehari-hari seperti saat jalan kaki atau saat naik tangga?":
        "nyeri_uluhati",
      "7. Apakah anda memiliki riwayat penyakit hipertensi?": "hipertensi",
      "8. Apakah anda memiliki berat badan berlebih? (Obesitas)": "obesitas",
      "9.  Apakah anda memiliki riwayat penyakit diabetes?": "diabetes",
      "10. Apakah ada riwayat penyakit jantung koroner (PJK) dalam keluarga anda?":
        "genetika",
    };
    
    const results = [];
    fs.createReadStream(req.file.path)
      .pipe(csv())
      .on("data", (data) => results.push(data))
      .on("end", async () => {
        fs.unlinkSync(req.file.path);

        const promises = results.map(async (row) => {
          const mappedRow = {};
          for (const column in row) {
            const dbField = columnMapping[column];
            if (dbField) {
              mappedRow[dbField] = row[column];
            }
          }

          await kuesioner.create(mappedRow);

          const clusteringData = {
            nyeri_dada: mappedRow["nyeri_dada"],
            mual: mappedRow["mual"],
            sesak_napas: mappedRow["sesak_napas"],
            nyeri_uluhati: mappedRow["nyeri_uluhati"],
            hipertensi: mappedRow["hipertensi"],
            obesitas: mappedRow["obesitas"],
            diabetes: mappedRow["diabetes"],
            genetika: mappedRow["genetika"],
          };
          const clusteringDataJson = JSON.stringify(clusteringData);

          const python = spawn("python", [
            "python_script/clustering.py",
            clusteringDataJson,
          ]);

          return new Promise((resolve, reject) => {
            python.stdout.on("data", async (data) => {
              const dataStr = data.toString();
              const dataObj = JSON.parse(dataStr);

              await history.create({
                cluster: dataObj.cluster,
                timestamp: new Date(),
              });

              const informasi = await informasiPJK.findOne({
                where: { cluster: dataObj.cluster },
              });

              resolve({
                predictedCluster: dataObj.cluster,
                informasi: informasi.info,
              });
            });

            python.stderr.on("data", (data) => {
              console.error(`Error: ${data}`);
              reject(`Error: ${data}`);
            });
          });
        });

        Promise.all(promises)
          .then((processedData) => {
            res.status(200).json({
              message: "CSV file processed successfully",
              data: processedData,
            });
          })
          .catch((error) => {
            res.status(500).json({ message: error.message });
          });
      });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
