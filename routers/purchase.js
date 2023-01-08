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

module.exports = router;
