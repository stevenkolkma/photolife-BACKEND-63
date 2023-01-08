//packages
const express = require("express");
const corsMiddleWare = require("cors");
const dotenv = require("dotenv");
// import dotenv from "dotenv";
dotenv.config();
//routers
const authRouter = require("./routers/auth");
const marketRouter = require("./routers/photomarket");
const photoRouter = require("./routers/photo");
const galleryRouter = require("./routers/gallery");
const userRouter = require("./routers/user");
const purchaseRouter = require("./routers/purchase");

//constants
const { PORT } = require("./config/constants");

// Create an express app
const app = express();

// CORS middleware:  * Since our api is hosted on a different domain than our client
// we are are doing "Cross Origin Resource Sharing" (cors)
// Cross origin resource sharing is disabled by express by default
app.use(corsMiddleWare());

// express.json() to be able to read request bodies of JSON requests a.k.a. body-parser
app.use(express.json());

//routes
app.use("/auth", authRouter);
app.use("/photomarket", marketRouter);
app.use("/photos", photoRouter);
app.use("/gallery", galleryRouter);
app.use("/user", userRouter);
app.use("/purchase", purchaseRouter);

//start listening
app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});
