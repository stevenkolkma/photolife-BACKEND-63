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
    // let public_ids = gallery.photos.map((photo) => photo.publicId);
    // let cloudinary_data = await cloudinary.api.resources_by_ids(public_ids, {
    //   metadata: true,
    //   context: true,
    //   transformations: true,
    // });
    // gallery.cloudinary_data = cloudinary_data.resources;
    res.send(gallery);
  } catch (error) {
    res.status(500).send("error: " + error.message);
  }
});

// POST a new gallery
router.post("/", async (req, res) => {
  try {
    const { name, userId, description, thumbnail, date } = req.body;

    const user = await User.findByPk(userId);

    // Create the new gallery in the database
    const gallery = await Gallery.create({
      name,
      description,
      thumbnail,
      date,
      userId: user.id,
    });
    res.status(201).send("New gallery was created", gallery);
  } catch (error) {
    res.status(400).send(error.message, error.details, error);
  }
});

// PUT an updated gallery
router.put("/:id", async (req, res) => {
  try {
    const gallery = await Gallery.findByPk(req.params.id);
    if (!gallery) {
      return res.status(404).json({ message: "No gallery found" });
    }

    let old_folder_name = req.body.folder_id;
    let new_folder_name = req.body.name;
    //rename folder in cloudinary
    await cloudinary.api.rename_folder(old_folder_name, new_folder_name);

    // update gallery name
    await Gallery.update({ name: new_folder_name });

    res
      .status(200)
      .json({ message: "Folder renamed in cloudinary and updated in the db" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE a gallery
router.delete("/:id", async (req, res) => {
  try {
    const gallery = await Gallery.findByPk(req.params.id);

    if (!gallery) {
      return res.status(404).send("No gallery found");
    }
    cloudinary.api.delete(req.params.folder, function (error, result) {
      if (error) {
        res.status(500).send(error);
      } else {
        res.sendStatus(204);
      }
    });
    await gallery.destroy(); // This also deletes all the photos in the gallery
    res.send(gallery);
  } catch (error) {
    res.status(500).send();
  }
});

// router.post("/:id", authMiddleware, async (req, res) => {
//   const id = req.user.id;
//   const { galleryId } = req.body;
//   try {
//     const newGallery = await Gallery.findByPk(id);
//   } catch (e) {
//     return res.status(500).json({ error: e.message });
//   }
// });

module.exports = router;
