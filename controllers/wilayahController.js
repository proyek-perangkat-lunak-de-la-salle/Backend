import wilayah from "../models/wilayahModel.js";

export const getWilayah = async (req, res) => {
  try {
    const response = await wilayah.findAll();
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getWilayahById = async (req, res) => {
  try {
    const response = await wilayah.findOne({
      where: { id_wilayah: req.params.id_wilayah },
    });
    if (!wilayah) {
      return res.status(404).json({ message: "Wilayah not found" });
    }
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



export const createWilayah = async (req, res) => {
  const { nama_wilayah } = req.body;
  console.log(req.body);
  try {
    await wilayah.create({
      nama_wilayah: nama_wilayah,
    });
    res.status(201).json({ message: "Wilayah created" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const updateWilayah = async (req, res) => {
  try {
    const response = await wilayah.update(
      {
        nama_wilayah: req.body.nama_wilayah,
      },
      { where: { id_wilayah: req.params.id_wilayah } }
    );
    res.json(response);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const deleteWilayah = async (req, res) => {
  try {
    const response = await wilayah.destroy({
      where: { id_wilayah: req.params.id_wilayah },
    });
    res.json(response);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
