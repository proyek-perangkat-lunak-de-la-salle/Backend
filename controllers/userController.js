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

export const getWilayahStats = async (req, res) => {
  // check if the user is an admin wilayah or admin paroki
  if (req.user.role !== "Admin Wilayah" && req.user.role !== "Admin Paroki") {
    return res.status(403).json({ message: "Forbidden"});
  }

  // If the user is an admin paroki, fetch all Wilayah
  if (req.user.role === "Admin Paroki") {
    const allWilayah = await wilayah.findAll();

    const allStats = await Promise.all(allWilayah.map(async (wilayah) => {
      const users = await user.findAll({ where: { id_wilayah: wilayah.id_wilayah } });

      const clusters = {
        Rendah: users.filter(user => user.risk_level === 'Rendah').length,
        Sedang: users.filter(user => user.risk_level === 'Sedang').length,
        Tinggi: users.filter(user => user.risk_level === 'Tinggi').length,
      };

      return { wilayah: wilayah.nama_wilayah, clusters };
    }));

    return res.json(allStats);
  }

  // If the user is an admin wilayah, fetch the Wilayah managed by the user
  const managedWilayah = await wilayah.findOne({ where: { id_wilayah: req.user.id_wilayah } });

  if (!managedWilayah) {
    return res.status(404).json({ message: "Wilayah not found"});
  }

  // Fetch the users in the managedWilayah
  const users = await user.findAll({ where: { id_wilayah: managedWilayah.id_wilayah } });

  // Calculate the number of users in each cluster
  const clusters = {
    Rendah: users.filter(user => user.risk_level === 'Rendah').length,
    Sedang: users.filter(user => user.risk_level === 'Sedang').length,
    Tinggi: users.filter(user => user.risk_level === 'Tinggi').length,
  };

  // Send the statistics back to the client
  res.json({ wilayah: managedWilayah.nama_wilayah, clusters });
}

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

    const hashedPassword = await bcrypt.hash(password, 10);

    const response = await user.create({
      nama: nama,
      username: username,
      password: hashedPassword,
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
