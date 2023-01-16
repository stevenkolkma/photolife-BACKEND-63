const { Router } = require("express");
const authMiddleware = require("../auth/middleware");
const Gallery = require("../models").gallery;
const Photo = require("../models").photo;
const User = require("../models").user;
const Purchase = require("../models").purchase;
const cloudinary = require("cloudinary").v2;
const multer = require("multer");

const router = new Router();

// Configure the Cloudinary client with your API keys
cloudinary.config({
  cloud_name: "dpsnohshv",
  api_key: "243418457917617",
  api_secret: "B5P57UIr45eTbt50K5KPDSZd9ao",
});

// const storage = multer.memoryStorage();
// const upload = multer({ storage: storage });
// upload.single("image");
// GET all photos

router.get("/", async (req, res) => {
  try {
    const photos = await Photo.findAll({
      include: [
        {
          model: Gallery,
          as: "gallery",
        },
        {
          model: User,
          as: "user",
        },
      ],
    });
    res.send(photos);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});
// GET a single photo by ID
router.get("/:id", async (req, res) => {
  try {
    const photo = await Photo.findByPk(req.params.id, {
      include: [
        {
          model: Gallery,
          as: "gallery",
        },
        {
          model: User,
          as: "user",
        },
      ],
    });
    if (!photo) {
      res.status(404).json({ message: "Photo not found in the db." });
      return;
    }
    res.send(photo);
  } catch (error) {
    res.status(500).send();
  }
});

//POST a new photo to the gallery with the userId and imageUrl from cloudinary
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { name, caption, metaData, imageUrl, publicId, galleryId, userId } =
      req.body;
    const user = await User.findByPk(req.user.id);

    if (!name) {
      res.status(400).json({ message: "A photo must have a name" });
    }

    if (user.id !== req.user.id) {
      return res.status(403).send({
        message: "You are not authorized to post a photo in this gallery",
      });
    }
    const photo = await Photo.create({
      name,
      caption,
      metaData,
      imageUrl,
      publicId,
      galleryId,
      userId,
    });
    console.log(photo);

    return res.status(201).send({ message: "New photo created", photo });
  } catch (e) {
    console.log(e);
  }
});

// PUT an updated photo
router.put("/photos/:id", async (req, res) => {
  try {
    // Find the existing photo
    const photo = await Photo.findByPk(req.params.id);
    if (!photo) {
      return res.status(404).send("No photo found");
    }
    // If the user has provided a new image file, upload it to Cloudinary
    if (req.file) {
      // Delete the old image from Cloudinary
      await cloudinary.uploader.destroy(photo.publicId);
      // Upload the new image
      const result = await cloudinary.uploader.upload(req.file.buffer, {
        folder: "my-app/photos",
      });
      // Update the imageUrl field of the photo model
      photo.imageUrl = result.secure_url;
    }
    // Update the other fields of the photo model
    Object.assign(photo, req.body);
    await photo.save();
    res.send(photo);
  } catch (error) {
    res.status(400).send(error);
  }
});

// DELETE a photo
router.delete("/photos/:id", async (req, res) => {
  try {
    // Find the existing photo
    const photo = await Photo.findByPk(req.params.id);
    if (!photo) {
      return res.status(404).send("No photo with that matching id found");
    }
    // Delete the image from Cloudinary
    await cloudinary.uploader.destroy(photo.publicId);
    // Delete the photo from the database
    await photo.destroy();
    res.send(photo);
  } catch (error) {
    res.status(500).send();
  }
});

module.exports = router;
