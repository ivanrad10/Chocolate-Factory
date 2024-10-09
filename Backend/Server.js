const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.port || 3000;

app.use(cors());
app.use(express.json());

const chocolateRoute = require("./Server/ChocolateController");
const chocolateFactoryRoute = require("./Server/ChocolateFactoryController");
const usersRoute = require("./Server/UserController");
const cartsRoute = require("./Server/CartController");
const purchaseRoute = require("./Server/PurchaseController");

app.use("/chocolates", chocolateRoute);
app.use("/factories", chocolateFactoryRoute);
app.use("/users", usersRoute);
app.use("/carts", cartsRoute);
app.use("/purchases", purchaseRoute);

app.listen(port, (err) => {
  if (err) {
    console.error("Failed to start server:", err);
  } else {
    console.log("Server is running on port:", port);
  }
});
