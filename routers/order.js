const { Router, response } = require("express");
const authMiddleware = require("../auth/middleware");
const Gallery = require("../models").gallery;
const Photo = require("../models").photo;
const User = require("../models").user;
const Order = require("../models").order;

const router = new Router();

// HTTP GET :4000/purchases
router.get("/", async (req, res) => {
  try {
    const allOrders = await Order.findAll({
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

    console.log(allOrders);
    res.send(allOrders);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const { userId, totalPrice, address, cartItems } = req.body;
    // Create new order
    // if (req.user.id !== userId) {
    //   res.status(400).send("Not authorized to make this order");
    // }
    const order = await Order.create({ userId, totalPrice, address });
    // Create new orderPhotos for each item in the cart
    for (let i = 0; i < cartItems.length; i++) {
      const { photoId, quantity, price } = cartItems[i];
      await OrderPhoto.create({ orderId: order.id, photoId, quantity, price });
    }
    res.status(201).send(order);
  } catch (error) {
    res.status(500).json({ message: "Error creating order", error });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    // Find the order by its id
    const order = await Order.findByPk(id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    // Delete the order along with its associated orderPhotos
    await order.destroy({
      include: [
        {
          model: OrderPhoto,
          as: "orderPhotos",
        },
      ],
    });
    res.status(200).json({ message: "Order deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting order", error });
  }
});

module.exports = router;
