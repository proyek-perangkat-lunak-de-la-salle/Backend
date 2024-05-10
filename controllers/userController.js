import kuesioner from "../models/kuesionerModel.js";
import user from "../models/userModel.js";
import bcrypt from "bcrypt";
import history from "../models/historyModel.js";
import wilayah from "../models/wilayahModel.js";

export const getUsers = async (req, res) => {
  try {
    const response = await user.findAll();
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUserById = async (req, res) => {
  try {
    const response = await user.findOne({
      where: { id_user: req.params.id_user },
    });
    if (!response) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUsersByWilayah = async (req, res) => {
  try {
    const { age, jenis_kelamin, risk_level } = req.query;

    let where = { id_wilayah: req.params.id_wilayah };
    if (age) where.age = age;
    const users = await user.findAll({
      where,
      include: [
        {
          model: kuesioner,
          where: jenis_kelamin ? { jenis_kelamin } : {},
          required: true,
        },
        {
          model: history,
          where: risk_level ? { cluster: risk_level } : {},
          required: true,
        },
      ],
    });

    if (!users.length) {
      return res
        .status(404)
        .json({ message: "No users found for this wilayah" });
    }

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllWilayah = async (req, res) => {
  const allWilayah = await wilayah.findAll();
  const wilayahNames = allWilayah.map((wilayah) => wilayah.nama_wilayah);
  res.json(wilayahNames);
};

export const getWilayahStats = async (req, res) => {
  const wilayahId = req.params.id_wilayah || req.user.id_wilayah;

  const foundWilayah = await wilayah.findOne({
    where: { id_wilayah: wilayahId },
  });

  if (!foundWilayah) {
    return res.status(404).json({ message: "Wilayah not found" });
  }

  const users = await user.findAll({
    where: { id_wilayah: foundWilayah.id_wilayah },
  });

  const totalUsers = users.length;
  const riskLevels = {
    Rendah: users.filter((user) => user.risk_level === "Rendah").length,
    Sedang: users.filter((user) => user.risk_level === "Sedang").length,
    Tinggi: users.filter((user) => user.risk_level === "Tinggi").length,
  };

  // Calculate the percentage of each risk level
  const percentages = {
    Rendah: (riskLevels.Rendah / totalUsers) * 100,
    Sedang: (riskLevels.Sedang / totalUsers) * 100,
    Tinggi: (riskLevels.Tinggi / totalUsers) * 100,
  };

  res.json({ wilayah: foundWilayah.nama_wilayah, riskLevels, percentages });
};

export const getSortedWilayahStats = async (req, res) => {
  const wilayahId = req.params.id_wilayah || req.user.id_wilayah;
  const sortKey = req.query.sortKey;

  const foundWilayah = await wilayah.findOne({
    where: { id_wilayah: wilayahId },
  });

  if (!foundWilayah) {
    return res.status(404).json({ message: "Wilayah not found" });
  }

  const users = await user.findAll({
    where: { id_wilayah: foundWilayah.id_wilayah },
    include: [
      {
        model: kuesioner,
        as: "kuesioner",
      },
    ],
  });

  let sortedData;
  switch (sortKey) {
    case "umur":
      sortedData = users.sort((a, b) => a.umur - b.umur);
      break;
    case "jenis_kelamin":
      sortedData = users.sort((a, b) => {
        if (a.kuesioner && b.kuesioner) {
          return a.kuesioner.jenis_kelamin.localeCompare(
            b.kuesioner.jenis_kelamin
          );
        } else {
          return 0;
        }
      });
      break;
    case "cluster_rendah":
      sortedData = users.filter((user) => user.risk_level === "Rendah");
      break;
    case "cluster_sedang":
      sortedData = users.filter((user) => user.risk_level === "Sedang");
      break;
    case "cluster_tinggi":
      sortedData = users.filter((user) => user.risk_level === "Tinggi");
      break;
    default:
      sortedData = users;
  }

  res.json({
    wilayah: foundWilayah.nama_wilayah,
    sortedData: sortedData.map((user) => ({
      id: user.id_user,
      name: user.nama,
      umur: user.age,
      jenis_kelamin: user.kuesioner ? user.kuesioner.jenis_kelamin : null,
      risk_level: user.risk_level,
    })),
  });
};

export const getClusterStatsByWilayah = async (req, res) => {
  try {
    const wilayahId = req.params.id_wilayah || req.user.id_wilayah;

    const foundWilayah = await wilayah.findOne({
      where: { id_wilayah: wilayahId },
    });

    if (!foundWilayah) {
      return res.status(404).json({ message: "Wilayah not found" });
    }

    const users = await user.findAll({
      where: { id_wilayah: foundWilayah.id_wilayah },
      include: [
        {
          model: history,
          as: "histories",
        },
      ],
    });

    const clusterCounts = users.reduce((counts, user) => {
      if (user.histories && user.histories.length > 0) {
        // Sort histories by date and pick the latest one
        const latestHistory = user.histories.sort((a, b) => b.date - a.date)[0];
        const cluster = latestHistory.cluster;
        counts[cluster] = (counts[cluster] || 0) + 1;
      } else {
        counts["Unknown"] = (counts["Unknown"] || 0) + 1;
      }
      return counts;
    }, {});

    const total = Object.values(clusterCounts).reduce((a, b) => a + b, 0);

    res.json({ wilayah: foundWilayah.nama_wilayah, clusterCounts, total });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getDetectionResultsByWilayah = async (req, res) => {
  try {
    const wilayahId = req.params.id_wilayah;

    const foundWilayah = await wilayah.findOne({
      where: { id_wilayah: wilayahId },
    });

    if (!foundWilayah) {
      return res.status(404).json({ message: "Wilayah not found" });
    }

    const users = await user.findAll({
      where: { id_wilayah: foundWilayah.id_wilayah },
      include: [
        {
          model: history,
          as: "histories",
        },
      ],
    });

    if (!users.length) {
      return res
        .status(404)
        .json({ message: "No users found for this wilayah" });
    }

    const detectionResults = users.map((user) => {
      const latestHistory = user.histories.sort((a, b) => b.date - a.date)[0];
      return {
        name: user.nama,
        cluster: latestHistory ? latestHistory.cluster : "Unknown",
      };
    });

    res.status(200).json(detectionResults);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createUser = async (req, res) => {
  const { nama, username, password, confirmPassword, email, role, age } =
    req.body;

  if (password !== confirmPassword) {
    return res.status(400).json({ message: "Passwords do not match" });
  }

  try {
    // Check if a user with the same email already exists
    const existingUser = await user.findOne({ where: { email: email } });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "A user with this email already exists" });
    }

    const response = await user.create({
      nama: nama,
      username: username,
      password: password, 
      email: email,
      age: age,
      role: role,
      id_wilayah: req.body.id_wilayah,
    });

    res.status(201).json({ message: "User created" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const updateUser = async (req, res) => {
  try {
    const response = await user.update(
      {
        nama: req.body.nama,
        username: req.body.username,
        password: req.body.password,
        email: req.body.email,
        role: req.body.role,
        age: req.body.age,
        id_wilayah: req.body.id_wilayah,
      },
      { where: { id_user: req.params.id_user } }
    );
    res.status(200).json(response);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const response = await user.findOne({
      where: { id_user: req.params.id_user },
    });
    if (!response) {
      return res.status(404).json({ message: "User not found" });
    }
    await user.destroy({
      where: { id_user: req.params.id_user },
    });
    res.status(200).json({ message: "User deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
