const fs = require("fs");
const path = require("path");
const Cart = require("../Model/Cart");

class CartRepository {
  constructor() {
    this.filePath = path.join(__dirname, "..", "Database/carts.json");
    this.carts = this.loadCarts();
  }

  loadCarts() {
    if (fs.existsSync(this.filePath)) {
      const data = fs.readFileSync(this.filePath, "utf8");
      const json = JSON.parse(data);
      return json.map((cart) => Cart.fromJSON(cart));
    }
    return [];
  }

  getByUsername(username) {
    return this.carts.find((cart) => cart.username === username) || null;
  }

  getAll() {
    return this.carts;
  }

  save() {
    const json = this.carts.map((cart) => cart.toJSON());
    fs.writeFileSync(this.filePath, JSON.stringify(json, null, 4), "utf8");
  }

  add(cart) {
    this.carts.push(cart);
    this.save();
    return cart;
  }

  update(updatedCart) {
    const username = updatedCart.username;
    if (!username) {
      throw new Error("Username is required to update a cart");
    }
    const index = this.carts.findIndex((cart) => cart.username === username);
    if (index === -1) {
      return null;
    }
    this.carts[index] = updatedCart;
    this.save();
    return this.carts[index];
  }

  delete(username) {
    const index = this.carts.findIndex((cart) => cart.username === username);
    if (index === -1) {
      return false;
    }
    const deletedCart = this.carts.splice(index, 1);
    this.save();
    return deletedCart[0];
  }
}

module.exports = CartRepository;
