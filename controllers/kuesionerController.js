import kuesioner from "../models/kuesionerModel.js";

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

export const createKuesioner = async (req, res) => {
  const {
    id_user,
    jenis_kelamin,
    tinggi_badan,
    berat_badan,
    paham_pjk,
    checkup_rutin,
    nyeri_dada,
    sesak_napas,
    mual,
    nyeri_ulu_hati,
    hipertensi,
    obesitas,
    diabetes,
    genetika,
  } = req.body;

  try {
    const response = await kuesioner.create({
      id_user: id_user,
      jenis_kelamin: jenis_kelamin,
      tinggi_badan: tinggi_badan,
      berat_badan: berat_badan,
      paham_pjk: paham_pjk,
      checkup_rutin: checkup_rutin,
      nyeri_dada: nyeri_dada,
      sesak_napas: sesak_napas,
      mual: mual,
      nyeri_ulu_hati: nyeri_ulu_hati,
      hipertensi: hipertensi,
      obesitas: obesitas,
      diabetes: diabetes,
      genetika: genetika,
    });

    res.status(201).json({ message: "Kuesioner created"});
  } catch (error) {
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
