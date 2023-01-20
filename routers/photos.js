const { Router } = require("express");
const authMiddleware = require("../auth/middleware");
const Gallery = require("../models").gallery;
const Photo = require("../models").photo;
const User = require("../models").user;
const Purchase = require("../models").purchase;
const cloudinary = require("cloudinary").v2;

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
    const {
      name,
      caption,
      metaData,
      price,
      imageUrl,
      publicId,
      galleryId,
      userId,
    } = req.body;
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
      price,
      publicId,
      galleryId,
      userId,
    });
    console.log(photo);

    return res.status(201).json(photo);
  } catch (e) {
    console.log(e);
  }
});

// PUT an updated photo
router.put("/:id", async (req, res) => {
  try {
    const { name, caption, metaData, price } = req.body;
    // Find the existing photo
    const photo = await Photo.findByPk(req.params.id);
    if (!photo) {
      return res.status(404).send("No photo found");
    }
    console.log(photo);
    await photo.update({ name, caption, metaData, price });
    res.status(200).send(photo);
  } catch (error) {
    res.status(400).send(error);
  }
});

// DELETE a photo
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    // Find the existing photo

    const photo = await Photo.findByPk(req.params.id);
    console.log(photo);
    if (!photo) {
      return res.status(404).send("No photo with that matching id found");
    }
    if (req.user.id !== photo.userId) {
      res.status(400).send("You are not authorized to delete this photo");
    }
    if (req.user.id === photo.userId) {
      // Delete the photo from the database
      await photo.destroy();
      // Delete the image from Cloudinary
      await cloudinary.uploader.destroy(photo.publicId);
      res.status(201).json(photo);
    }
  } catch (error) {
    res.status(500).send();
  }
});

module.exports = router;
