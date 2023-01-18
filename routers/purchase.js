const { Router } = require("express");
const authMiddleware = require("../auth/middleware");
const Gallery = require("../models").gallery;
const Photo = require("../models").photo;
const User = require("../models").user;
const Purchase = require("../models").purchase;

const router = new Router();

// HTTP GET :4000/purchases
router.get("/", async (req, res) => {
  try {
    const allPurchases = await Purchase.findAll({
      include: [
        {
          model: Photo,
          as: "photo",
        },
        {
          model: User,
          as: "users",
        },
      ],
    });

    console.log(allPurchases);
    res.send(allPurchases);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

//POST a new photo to the gallery with the userId and imageUrl from cloudinary
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { purchase } = req.body;
    const user = await User.findByPk(req.user.id);

    if (!purchase) {
      res.status(400).json({ message: "There wasn't a purchase" });
    }

    if (user.id !== req.user.id) {
      return res.status(403).send({
        message: "You are not authorized to post a photo in this gallery",
      });
    }
    const newPurchase = await Purchase.create({
    });
    console.log(photo);

    return res.status(201).send({ message: "New photo created", photo });
  } catch (e) {
    console.log(e);
  }
});

module.exports = router;
