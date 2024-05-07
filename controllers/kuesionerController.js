import kuesioner from "../models/kuesionerModel.js";
import { spawn } from "child_process";
import history from "../models/historyModel.js";
import informasiPJK from "../models/informasiPJKModel.js";
import user from "../models/userModel.js";
export const getKuesioner = async (req, res) => {
  try {
    const response = await kuesioner.findAll();
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getKuesionerById = async (req, res) => {
  try {
    const response = await kuesioner.findOne({
      where: { id_kuesioner: req.params.id_kuesioner },
    });
    if (!response) {
      return res.status(404).json({ message: "Kuesioner not found" });
    }
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getHistoryByUserId = async (req, res) => {
  try {
    const response = await history.findAll({
      where: { id_user: req.params.id_user },
      order: [['timestamp', 'DESC']]
    });
    if (!response) {
      return res.status(404).json({ message: "No history found for this user" });
    }
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



export const createKuesioner = async (req, res) => {
  const {
    id_user,
    jenis_kelamin,
    tinggi_badan,
    berat_badan,
    paham_pjk,
    checkup_rutin,
    nyeri_dada,
    mual,
    sesak_napas,
    nyeri_uluhati,
    hipertensi,
    obesitas,
    diabetes,
    genetika,
  } = req.body;

  try {
    await kuesioner.create({
      id_user: id_user,
      jenis_kelamin: jenis_kelamin,
      tinggi_badan: tinggi_badan,
      berat_badan: berat_badan,
      paham_pjk: paham_pjk,
      checkup_rutin: checkup_rutin,
      nyeri_dada: nyeri_dada,
      mual: mual,
      sesak_napas: sesak_napas,
      nyeri_uluhati: nyeri_uluhati,
      hipertensi: hipertensi,
      obesitas: obesitas,
      diabetes: diabetes,
      genetika: genetika,
    });

    // Create an object with the required data for clustering
    const clusteringData = {
      nyeri_dada: (nyeri_dada),
      mual: (mual),
      sesak_napas: (sesak_napas),
      nyeri_uluhati: (nyeri_uluhati),
      hipertensi: (hipertensi),
      obesitas: (obesitas),
      diabetes: (diabetes),
      genetika: (genetika),
    };
    const clusteringDataJson = JSON.stringify(clusteringData);

    // Run the Python script with the clustering data as an argument
    const python = spawn('python', ['python_script/clustering.py', clusteringDataJson]);
    
    // Collect data from script
    python.stdout.on('data', async (data) => {
      console.log('Pipe data from python script ...');
      const dataStr = data.toString();
      const dataObj = JSON.parse(dataStr);
      console.log("Predicted cluster:", dataObj.cluster);

      // Save the predicted cluster to the database
      await history.create({
        id_user: id_user,
        cluster: dataObj.cluster,
        timestamp: new Date(),
      });

      const foundUser = await user.findOne({ where: { id_user: id_user } });
    if (foundUser) {
      foundUser.risk_level = dataObj.cluster;
      await foundUser.save();
    }

      // Get the information for the predicted cluster
      const informasi = await informasiPJK.findOne({ where: { cluster: dataObj.cluster } });

      // Send a response back to the client with a success message and the predicted cluster
      res.status(200).json({ message: "Kuesioner created successfully", predictedCluster: dataObj.cluster, informasi: informasi.info });
    });

     // In case of error
     python.stderr.on('data', (data) => {
      console.error(`Error: ${data}`);
    });

  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: error.message });
  }
};

export const updateKuesioner = async (req, res) => {
  try {
    const response = await kuesioner.update(
      {
        jenis_kelamin: req.body.jenis_kelamin,
        tinggi_badan: req.body.tinggi_badan,
        berat_badan: req.body.berat_badan,
        paham_pjk: req.body.paham_pjk,
        checkup_rutin: req.body.checkup_rutin,
        nyeri_dada: req.body.nyeri_dada,
        sesak_napas: req.body.sesak_napas,
        mual: req.body.mual,
        nyeri_ulu_hati: req.body.nyeri_ulu_hati,
        hipertensi: req.body.hipertensi,
        obesitas: req.body.obesitas,
        diabetes: req.body.diabetes,
        genetika: req.body.genetika,
      },
      { where: { id_kuesioner: req.params.id_kuesioner } }
    );
    res.status(200).json(response);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const deleteKuesioner = async (req, res) => {
  try {
    const response = await kuesioner.findOne({
      where: { id_kuesioner: req.params.id_kuesioner },
    });
    if (!response) {
      return res.status(404).json({ message: "Kuesioner not found" });
    }
    await response.destroy();
    res.status(200).json({ message: "Kuesioner deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
