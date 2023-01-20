const { Router } = require("express");
const authMiddleware = require("../auth/middleware");
const Gallery = require("../models").gallery;
const Photo = require("../models").photo;
const User = require("../models").user;
const Purchase = require("../models").purchase;

const router = Router();

// GET all users :4000/users
router.get("/", async (req, res) => {
  try {
    const users = await User.findAll({
      include: [
        {
          model: Photo,
          as: "photos",
        },
        {
          model: Gallery,
          as: "galleries",
        },
      ],
    });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).send();
  }
});

// HTTP GET :4000/user
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findByPk(id, {
      include: [
        {
          model: Gallery,
        },
        { model: Photo },
      ],
    });
    console.log(user);
    res.status(200).json(user);
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

router.delete("/:id", async (req, res) => {
  const id = req.params.id;
  try {
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

module.exports = router;
