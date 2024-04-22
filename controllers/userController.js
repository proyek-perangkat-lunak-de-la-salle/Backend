import user from "../models/userModel.js";
import bcrypt from "bcrypt";

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
    const users = await user.findAll({
      where: { id_wilayah: req.params.id_wilayah },
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

export const createUser = async (req, res) => {
  const { nama, username, password, confirmPassword, email, role } = req.body;

  if (password !== confirmPassword) {
    return res.status(400).json({ message: "Passwords do not match" });
  }

  try {
    // Check if a user with the same email already exists
    const existingUser = await user.findOne({ email: email });
    if (existingUser) {
      return res.status(400).json({ message: "A user with this email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const response = await user.create({
      nama: nama,
      username: username,
      password: hashedPassword,
      email: email,
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
        id_wilayah: req.body.id_wilayah,
      },
      { where: { id_user: req.params.id } }
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
