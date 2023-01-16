//Import the router from express the authMiddleware
const { Router } = require("express");
const authMiddleware = require("../auth/middleware");
//Sequelize model imports
const Gallery = require("../models").gallery;
const Photo = require("../models").photo;
const User = require("../models").user;
const Purchase = require("../models").purchase;

//Cloudinary configuration
const cloudinary = require("cloudinary").v2;
cloudinary.config({
  cloud_name: "dpsnohshv",
  api_key: "243418457917617",
  api_secret: "B5P57UIr45eTbt50K5KPDSZd9ao",
});

//Multer config
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
upload.single("image");

const router = Router();

//TODOs

//Endpoints for /photomarket route

//Users

// GET all users :4000/users
router.get("/users", async (req, res) => {
  try {
    const photos = await Gallery.findAll({
      include: [
        {
          model: Photo,
          as: "photos",
        },
        {
          model: User,
          as: "users",
        },
      ],
    });
    res.send(photos);
  } catch (error) {
    res.status(500).send();
  }
});
// GET user by id :4000/users/:id
router.get("/users/:id", async (req, res) => {
  const id = req.user.id;
  try {
    const user = await User.findByPk(id);
    console.log(user);
    res.send(user);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});
// Post new user in /auth/signup
// Post login user in /auth/signup
router.put("/users/:id", async (req, res) => {
  const id = req.user.id;
  try {
    const user = await User.findByPk(id);
    if (!user) {
      res.status(404).send({ message: "User not found" });
    }
    console.log(user);
    res.send(user);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});
router.delete("/users/:id", async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).send("No user found");
    }
    // cloudinary.api.delete(req.params.folder, function (error, result) {
    //   if (error) {
    //     res.status(500).send(error);
    //   } else {
    //     res.sendStatus(204);
    //   }
    // });
    await user.destroy(); // This also deletes all the photos in the gallery
    res.send(gallery);
  } catch (error) {
    res.status(500).send();
  }
});

//Galleries

router.get("/galleries", async (req, res) => {
  try {
    const galleries = await Gallery.findAll({
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
    res.send(galleries);
  } catch (error) {
    res.status(500).send();
  }
});
router.get("/galleries/:id", async (req, res) => {
  try {
    const gallery = await Gallery.findByPk(req.params.id, {
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
    if (!gallery) {
      res.status(404).json({ message: "Gallery not found." });
      return;
    }
    // let public_ids = gallery.photos.map((photo) => photo.publicId);
    // let cloudinary_data = await cloudinary.api.resources_by_ids(public_ids, {
    //   metadata: true,
    //   context: true,
    //   transformations: true,
    // });
    // gallery.cloudinary_data = cloudinary_data.resources;
    res.send(gallery);
  } catch (error) {
    res.status(500).send("error: " + error.message);
  }
});
//get all galleries include users/photos and generate urls
router.get("/galleries/:galleryId/photos", async (req, res) => {
  //get all images from userId and galleryId and generate urls in response
  const photos = await Photo.findAll({
    where: {
      galleryId: req.params.galleryId,
      userId: req.params.userId,
    },
    include: { model: [Gallery], model: [User] },
  });

  // get the URLs for all the photos from Cloudinary
  const imageUrls = await Promise.all(
    photos.map(async (photo) => {
      const imageData = await cloudinary.uploader.explicit(photo.public_id, {
        type: "url",
        secure: true,
      });
      return imageData.secure_url;
    })
  );
  // Add image URLs to the photos
  const photosWithUrls = photos.map((photo, i) => ({
    ...photo,
    url: imageUrls[i],
  }));
  // return the photos with URLs
  res.status(200).send(photosWithUrls);
});
//creating a folder in the db
router.post("/galleries", async (req, res) => {
  try {
    const user = await user.findByPk(req.user.id);
    if (!user) {
      res.status(404).json({ message: "No user found" });
    }
    if (user.id === req.user.id) {
      let user_folder = req.user.name;
      let gallery_name = req.body.name;
      cloudinary.api.create_folder(
        `${user_folder}/${gallery_name}`,
        function (error, result) {
          if (error) {
            res.status(500).json({ error: error.message });
          } else {
            // Add the folder_id to the request body
            req.body.folder_id = result.folder_name;
          }
        }
      );
    }
    const { name, description, thumbnail, date } = req.body;
    // Create the new gallery in the database
    const gallery = await Gallery.create({
      name,
      description,
      thumbnail,
      date,
      userId: req.user.id,
    });
    res.status(201).send(gallery);
  } catch (error) {
    res.status(400).send(error);
  }
});
//done
router.put("/galleries/:id", async (req, res) => {
  try {
    const gallery = await Gallery.findByPk(req.params.id);
    if (!gallery) {
      return res.status(404).json({ message: "No gallery found" });
    }
    if (!gallery.userId === req.user.id) {
      return res
        .status(403)
        .json({ message: "You are not authorized to update this gallery." });
    }
    const { name, description, thumbnail, userId } = req.body;
    let old_folder_name = req.body.folder_id;
    let new_folder_name = req.body.name;
    //rename folder in cloudinary
    await cloudinary.api.rename_folder(old_folder_name, new_folder_name);

    // update gallery name
    await Gallery.update({
      name: new_folder_name,
      description,
      thumbnail,
      userId,
    });
    res
      .status(200)
      .json({ message: "Folder renamed in cloudinary and updated in the db" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
router.delete("/galleries/:id", async (req, res) => {
  try {
    const gallery = await Gallery.findByPk(req.params.id);

    if (!gallery) {
      return res.status(404).send("No gallery found");
    }
    //delete folder in cloudinary
    cloudinary.api.delete(req.params.folder, function (error, result) {
      if (error) {
        res.status(500).send(error);
      } else {
        res.sendStatus(204);
      }
    });
    await gallery.destroy(); // This also deletes all the photos in the gallery
    res.send(gallery);
  } catch (error) {
    res.status(500).send();
  }
});

router.post("/users/:userId/galleries/:galleryId/photo", (req, res) => {
  try {
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
router.delete("/users/:userId/galleries/:galleryId/photo", async (req, res) => {
  try {
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//Photos

router.get("/photos", async (req, res) => {
  try {
    const photos = await Gallery.findAll({
      include: [
        {
          model: Photo,
          as: "photos",
        },
        {
          model: User,
          as: "users",
        },
      ],
    });
    if (!photos) {
      res.status(404).json({ message: "No photos found" });
      return;
    }
    res.send(photos);
  } catch (error) {
    res.status(500).send();
  }
});
router.get("/photos/:id", async (req, res) => {
  try {
    const photo = await Photo.findByPk(req.params.id, {
      include: [
        {
          model: Gallery,
          as: "photo",
        },
        {
          model: User,
          as: "users",
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
router.post("/photos", upload.single("image"), async (req, res) => {
  try {
    const { name, description, thumbnail, date } = req.body;
    const photos = await Photo.findByPk(req.body.galleryId, {
      include: [{ model: Gallery }, { model: User }],
    });
    const gallery = photos.gallery;
    const user = photos.user;
    console.log(photos);
    if (!photos) {
      return res.status(404).json({ message: "Gallery not found" });
    }
    //Upload to cloudinary
    let result = await cloudinary.uploader.upload(req.file.buffer, {
      folder: `${user.name}/${photos.name}`,
      metadata: { userId: user.id, gallery_folder: photos.name },
    });

    // Create a new Photo model with the image URL and other fields
    const photo = await Photo.create({
      publicId: result.public_Id,
      galleryid: gallery,
      userId: req.user.id,
    });
    res.status(201).send(photo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
router.put("/photos/:id", upload.single("image"), async (req, res) => {
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

//random generate photo urls TODO

router.get("/users/:userId/galleries/:galleryId", async (req, res) => {
  // get all photos from postgres
  const photos = await Photo.findAll({
    where: {
      galleryId: req.params.galleryId,
    },
  });
  // get the URLs for all the photos from Cloudinary
  const imageUrls = await Promise.all(
    photos.map(async (photo) => {
      const imageData = await cloudinary.uploader.explicit(photo.public_id, {
        type: "url",
        secure: true,
      });
      return imageData.secure_url;
    })
  );
  // Add image URLs to the photos
  const photosWithUrls = photos.map((photo, i) => ({
    ...photo,
    url: imageUrls[i],
  }));
  // return the photos with URLs
  res.status(200).send(photosWithUrls);
});
router.get("/users/:userId/galleries/:galleryId", async (req, res) => {
  // get all photos from postgres
  const photos = await Photo.findAll({
    where: {
      galleryId: req.params.galleryId,
    },
  });
  // get the URLs for all the photos from Cloudinary
  const imageUrls = await Promise.all(
    photos.map(async (photo) => {
      const imageData = await cloudinary.uploader.explicit(photo.public_id, {
        type: "url",
        secure: true,
      });
      return imageData.secure_url;
    })
  );
  // Add image URLs to the photos
  const photosWithUrls = photos.map((photo, i) => ({
    ...photo,
    url: imageUrls[i],
  }));
  // return the photos with URLs
  res.status(200).send(photosWithUrls);
});

module.exports = router;
