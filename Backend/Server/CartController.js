const express = require("express");
const router = express.Router();

const CartRepository = require("../Repository/CartRepository");
const cartDao = new CartRepository();
const Cart = require("../Model/Cart");
const Chocolate = require("../Model/Chocolate");

router.get("/", (req, res) => {
  const carts = cartDao.getAll();
  return res.json(carts);
});

router.get("/:username", (req, res) => {
  const username = req.params.username;
  let cart = cartDao.getByUsername(username);
  if (!cart) {
    cart = new Cart(username);
    cartDao.add(cart);
  }
  return res.json(cart.toJSON());
});

router.post("/", (req, res) => {
  const { username } = req.body;
  let cart = cartDao.getByUsername(username);
  if (cart) {
    return res.json(cart.toJSON());
  }
  cart = new Cart(username);
  const addedCart = cartDao.add(cart);
  return res.json({
    message: "Cart added successfully",
    chocolate: addedCart,
  });
});

router.post("/:username/chocolates", (req, res) => {
  const username = Number(req.params.username);
  const cart = cartDao.getByUsername(username);
  if (cart) {
    const chocolate = Chocolate.fromJSON(req.body);
    cart.addChocolate(chocolate);
    cartDao.update(cart);
    return res.json(cart);
  } else {
    return res.status(404).json({ message: "Cart not found" });
  }
});

router.patch("/:username/chocolates/add", (req, res) => {
  const username = req.params.username;
  const { chocolate, quantity } = req.body;
  let cart = cartDao.getByUsername(username);
  if (!cart) {
    cart = new Cart(username);
    cartDao.add(cart);
  }

  const existingChocolate = cart.chocolates.find(
    (choc) => choc.id === chocolate.id
  );
  if (!existingChocolate) {
    cart.addChocolate(chocolate, quantity);
  } else {
    cart.incrementChocolateQuantity(chocolate.id, quantity);
  }

  cartDao.update(cart);
  return res.json({
    cart: cart,
    message: "Successfully added to cart",
  });
});

//update chocolate quantity
router.patch("/:username/chocolates/:chocolateId", (req, res) => {
  const username = req.params.username;
  const chocolateId = Number(req.params.chocolateId);
  const { quantity } = req.body;

  const cart = cartDao.getByUsername(username);
  if (cart) {
    cart.updateChocolateQuantity(chocolateId, quantity);
    cartDao.update(cart);
    return res.json(cart);
  } else {
    return res.status(404).json({ message: "Cart not found" });
  }
});

router.delete("/:username", (req, res) => {
  const username = req.params.username;
  const deletedCart = cartDao.delete(username);
  if (!deletedCart) {
    return res.status(404).json({ error: "Cart not found" });
  }
  return res.json({
    message: "Cart deleted successfully",
    chocolate: deletedCart,
  });
});

router.delete("/:username/chocolates/:chocolateId", (req, res) => {
  const username = req.params.username;
  const chocolateId = Number(req.params.chocolateId);

  const cart = cartDao.getByUsername(username);
  if (cart) {
    cart.deleteChocolate(chocolateId);
    cartDao.update(cart);
    return res.json(cart);
  } else {
    return res.status(404).json({ message: "Cart not found" });
  }
});

module.exports = router;
