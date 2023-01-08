const { Router } = require("express");
const authMiddleware = require("../auth/middleware");
const Gallery = require("../models").gallery;
const Photo = require("../models").photo;
const User = require("../models").user;
const Purchase = require("../models").purchase;

const router = Router();

// HTTP GET :4000/user
router.get("/:id", authMiddleware, async (req, res) => {
  const id = req.user.id;
  try {
    const user = await User.findByPk(id, {
      include: [
        {
          model: Gallery,
        },
      ],
    });
    console.log(user);
    res.send(user);
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
