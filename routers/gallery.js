const { Router } = require("express");
const authMiddleware = require("../auth/middleware");
const Gallery = require("../models").gallery;
const Photo = require("../models").photo;
const User = require("../models").user;
const Purchase = require("../models").purchase;

const router = Router();

// HTTP GET :4000/gallery
router.get("/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const allGalleries = await Gallery.findAll({
      include: [
        {
          model: Gallery,
          as: "gallery",
        },
        {
          model: User,
          as: "users",
        },
      ],
    });

    console.log(allGalleries);
    res.send(allGalleries);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

router.post("/:id", authMiddleware, async (req, res) => {
  const id = req.user.id;
  const { galleryId } = req.body;
  try {
    const newGallery = await Gallery.findByPk(id);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

router.put("/:id", async (req, res) => {
  const id = req.params.id;
  try {
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

module.exports = router;
