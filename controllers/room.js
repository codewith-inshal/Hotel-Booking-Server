const Room = require("../models/Room");
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");

// CREATE ROOM
const createRoom = async (req, res) => {
  try {
    const room = new Room({
      title: req.body.title,
      desc: req.body.desc,
      price: req.body.price,
      rating: req.body.rating,
      review: req.body.review,
      image: req.file ? req.file.filename : "",
    });
    await room.save();
    res.status(201).json(room);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create room" });
  }
};

// GET ALL ROOMS
const getRooms = async (req, res) => {
  try {
    const rooms = await Room.find();
    res.status(200).json(rooms);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch rooms" });
  }
};

// GET SINGLE ROOM
const getRoom = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id))
      return res.status(400).json({ message: "Invalid Room ID" });

    const room = await Room.findById(req.params.id);
    if (!room) return res.status(404).json({ message: "Room not found" });

    res.status(200).json(room);
  } catch (error) {
    res.status(500).json({ message: "Error fetching room" });
  }
};

// DELETE ROOM
const deleteRoom = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) return res.status(404).json({ message: "Room not found" });

    // delete image if exists
    if (room.image) {
      const imgPath = path.join(__dirname, "../uploads", room.image);
      if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
    }

    await Room.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Room deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete room" });
  }
};

// EDIT ROOM
const editRoom = async (req, res) => {
  try {
    const { id } = req.params;
    const room = await Room.findById(id);

    if (!room) return res.status(404).json({ message: "Room not found" });

    // Create update object from body
    let updates = { ...req.body };

    // Handle Image Logic
    if (req.file) {
      // 1. If there was an old image, delete it from the folder
      if (room.image) {
        const oldImagePath = path.join(__dirname, "../uploads", room.image);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      // 2. Add the new image filename to the updates object
      updates.image = req.file.filename;
    }

    const updatedRoom = await Room.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    res.status(200).json(updatedRoom);
  } catch (err) {
    console.error("Update Error:", err);
    res.status(500).json({ message: "Failed to update room" });
  }
};

module.exports = { createRoom, getRooms, getRoom, deleteRoom, editRoom };
