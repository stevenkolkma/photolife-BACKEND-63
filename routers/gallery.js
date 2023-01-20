const { Router } = require("express");
const authMiddleware = require("../auth/middleware");
const Gallery = require("../models").gallery;
const Photo = require("../models").photo;
const User = require("../models").user;
const Purchase = require("../models").purchase;
const cloudinary = require("cloudinary").v2;

const router = Router();

// Configure the Cloudinary client with your API keys
cloudinary.config({
  cloud_name: "dpsnohshv",
  api_key: "243418457917617",
  api_secret: "B5P57UIr45eTbt50K5KPDSZd9ao",
});

// GET all galleries
router.get("/", async (req, res) => {
  try {
    const galleries = await Gallery.findAll({
      include: [
        {
          model: Photo,
          as: "photos",
        },
        {
          model: User,
          as: "user",
        },
      ],
    });
    res.send(galleries);
  } catch (error) {
    res.status(500).send();
  }
});

// GET a single gallery by ID
router.get("/:id", async (req, res) => {
  try {
    const gallery = await Gallery.findByPk(req.params.id, {
      include: [
        {
          model: Photo,
          as: "photos",
        },
        {
          model: User,
          as: "user",
        },
      ],
    });
    if (!gallery) {
      res.status(404).json({ message: "Gallery not found." });
      return;
    }
    res.send(gallery);
  } catch (error) {
    res.status(500).send("error: " + error.message);
  }
});

// POST a new gallery
router.post("/", async (req, res) => {
  try {
    const { name, description, date, thumbnail, userId } = req.body;

    // Create the new gallery in the database
    const gallery = await Gallery.create({
      name,
      description,
      thumbnail,
      date,
      userId: userId,
    });
    res.status(201).send(gallery);
  } catch (error) {
    res.status(400).send(error.message, error.details, error);
  }
});

// PUT an updated gallery
router.put("/:id", async (req, res) => {
  try {
    const { name, description, thumbnail, date } = req.body;
    const gallery = await Gallery.findByPk(req.params.id);
    if (!gallery) {
      return res.status(404).json({ message: "No gallery found" });
    }
    // update gallery name
    await gallery.update({ name, description, thumbnail, date });

    res.status(200).json(gallery);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE a gallery
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const gallery = await Gallery.findByPk(req.params.id);

    if (!gallery) {
      return res.status(404).send("No gallery found");
    }
    if (!gallery === req.user.id) {
      await gallery.destroy(); // This also deletes all the photos in the gallery
    }
    res.status(201).send(gallery);
  } catch (error) {
    res.status(500).send("Error: " + error.message);
  }
});

module.exports = router;
