const { Router } = require("express");
const authMiddleware = require("../auth/middleware");
const Gallery = require("../models").gallery;
const Photo = require("../models").photo;
const User = require("../models").user;
const Purchase = require("../models").purchase;
const multer = require("multer");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const dotenv = require("dotenv");
dotenv.config();

const bucketName = process.env.BUCKET_NAME;
const bucketRegion = process.env.BUCKET_REGION;
const accessKey = process.env.ACCESS_KEY;
const secretAccessKey = process.env.SECRET_ACCESS_KEY;

const s3 = new S3Client({
  credentials: {
    accessKeyId: accessKey,
    secretAccessKey: secretAccessKey,
  },
  region: bucketRegion,
});

const router = new Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

upload.single("image");
upload.single("caption");

// HTTP GET :4000/photos
router.get("/", async (req, res) => {
  try {
    const allPhotos = await Photo.findAll({
      include: [
        {
          model: Gallery,
          include: {
            model: User,
          },
        },
      ],
    });

    console.log(allPhotos);
    res.send(allPhotos);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

// HTTP GET :4000/photos/:id for photoDetails.js
router.get("/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const photo = await Photo.findByPk(id, {
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

    console.log(photo);
    res.send(photo);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

router.post("/", upload.single("image"), async (req, res) => {
  console.log("req.body", req.body);
  console.log("req.file", req.file);
  req.file.buffer;

  const params = {
    Bucket: bucketName,
    Key: req.file.originalname,
    Body: req.file.buffer,
    ContentType: req.file.mimetype,
  };
  const command = new PutObjectCommand(params);

  await s3.send(command);

  // const { galleryId } = req.body;
  res.send({});
  try {
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
