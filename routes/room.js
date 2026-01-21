const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const {
  createRoom,
  getRooms,
  getRoom,
  deleteRoom,
  editRoom,
} = require("../controllers/room");

// CREATE ROOM
router.post("/", upload.single("image"), createRoom);

// GET ROOMS
router.get("/", getRooms);
router.get("/:id", getRoom);

// DELETE ROOM
router.delete("/:id", deleteRoom);

// EDIT ROOM
router.patch("/:id", upload.single("image"), editRoom);

module.exports = router;
