const express = require("express");
const router = express.Router();

const ChocolateRepository = require("../Repository/ChocolateRepository.js");
const chocolateRepository = new ChocolateRepository();
const Chocolate = require("../Model/Chocolate.js");

router.get("/", (req, res) => {
  const chocolates = chocolateRepository.getAll();
  return res.json(chocolates);
});

router.get("/:id", (req, res) => {
  const id = Number(req.params.id);
  const chocolate = chocolateRepository.getById(id);

  if (!chocolate) {
    return res.status(404).json({ error: "Chocolate not found" });
  }
  return res.json(chocolate);
});

router.post("/", (req, res) => {
  const {
    name,
    price,
    kind,
    factoryId,
    type,
    weight,
    description,
    image,
    status,
    quantity,
  } = req.body;

  const newChocolate = new Chocolate(
    null,
    name,
    price,
    kind,
    factoryId,
    type,
    weight,
    description,
    image,
    status,
    quantity
  );

  const addedChocolate = chocolateRepository.add(newChocolate);
  return res.json({
    message: "Chocolate added successfully",
    chocolate: addedChocolate,
  });
});

router.patch("/:id", (req, res) => {
  const id = Number(req.params.id);
  const updatedData = { id, ...req.body };
  const updatedChocolate = chocolateRepository.update(updatedData);
  if (!updatedChocolate) {
    return res.status(404).json({ error: "Chocolate not found" });
  }
  return res.json({
    message: "Chocolate updated successfully",
    chocolate: updatedChocolate,
  });
});

router.delete("/:id", (req, res) => {
  const id = Number(req.params.id);
  const deletedChocolate = chocolateRepository.delete(id);
  if (!deletedChocolate) {
    return res.status(404).json({ error: "Chocolate not found" });
  }
  return res.json({
    message: "Chocolate deleted successfully",
    chocolate: deletedChocolate,
  });
});

module.exports = router;
