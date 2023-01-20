const bcrypt = require("bcrypt");
const { Router } = require("express");
const { toJWT } = require("../auth/jwt");
const authMiddleware = require("../auth/middleware");
const Gallery = require("../models").gallery;
const Photo = require("../models").photo;
const User = require("../models/").user;
const { SALT_ROUNDS } = require("../config/constants");

const router = new Router();

//login
router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .send({ message: "Please provide both email and password" });
    }

    const user = await User.findOne({ where: { email } });

    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(400).send({
        message: "User with that email not found or password incorrect",
      });
    }

    //Logging in finds myGalleries
    const myGalleries = await Gallery.findAll({
      where: { userId: user.id },
      include: [Photo],
    });
    delete user.dataValues["password"]; // don't send back the password hash
    const token = toJWT({ userId: user.id });
    return res
      .status(200)
      .send({ token, user: user.dataValues, myGalleries: myGalleries });
  } catch (error) {
    console.log(error);
    return res.status(400).send({ message: "Something went wrong, sorry" });
  }
});

//signup
router.post("/signup", async (req, res) => {
  const { email, password, name } = req.body;
  if (!email || !password || !name) {
    return res.status(400).send("Please provide an email, password and a name");
  }

  try {
    //Signing up creates a user
    const newUser = await User.create({
      email,
      password: bcrypt.hashSync(password, SALT_ROUNDS),
      name,
    });

    //Create a new gallery on signup
    const newGallery = await Gallery.create({
      name: `${name}'s first gallery`,
      description: null,
      date: new Date(),
      userId: newUser.id,
    });

    //Find the new gallery
    const NewGallery = await Gallery.findByPk(newGallery.id, {
      include: [Photo],
    });

    delete newUser.dataValues["password"]; // don't send back the password hash

    const token = toJWT({ userId: newUser.id });

    res
      .status(201)
      .json({ token, user: newUser.dataValues, myGalleries: [NewGallery] });
  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") {
      return res
        .status(400)
        .send({ message: "There is an existing account with this email" });
    }

    return res.status(400).send({ message: "Something went wrong, sorry" });
  }
});

// The /me endpoint can be used to:
// - get the users email & name using only their token
// - checking if a token is (still) valid
router.get("/me", authMiddleware, async (req, res) => {
  // don't send back the password hash
  const myGalleries = await Gallery.findAll({
    where: { userId: req.user.id },
    include: [Photo],
  });
  delete req.user.dataValues["password"];
  res.status(200).send({ ...req.user.dataValues, myGalleries: myGalleries });
});

module.exports = router;
