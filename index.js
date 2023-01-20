//packages
const express = require("express");
const corsMiddleWare = require("cors");

//routers
const authRouter = require("./routers/auth");
const photoRouter = require("./routers/photos");
const galleryRouter = require("./routers/gallery");
const marketRouter = require("./routers/photomarket");
const userRouter = require("./routers/user");
const orderRouter = require("./routers/order");

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
app.use("/photos", photoRouter);
app.use("/galleries", galleryRouter);
app.use("/photomarket", marketRouter);
app.use("/users", userRouter);
app.use("/order", orderRouter);

//start listening
app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});
