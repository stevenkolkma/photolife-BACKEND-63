const { Router } = require("express");
const authMiddleware = require("../auth/middleware");
const Gallery = require("../models").gallery;
const Photo = require("../models").photo;
const User = require("../models").user;
const Purchase = require("../models").purchase;

const router = Router();

// HTTP GET :/4000/market
router.get("/", async (req, res) => {
  try {
    const allData = await Gallery.findAll({
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

    console.log(allData);
    res.send(allData);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

module.exports = router;
