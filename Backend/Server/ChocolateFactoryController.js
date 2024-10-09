const express = require("express");
const router = express.Router();

const ChocolateFactoryRepository = require("../Repository/ChocolateFactoryRepository.js");
const chocolateFactoryRepository = new ChocolateFactoryRepository();
const ChocolateFactory = require("../Model/ChocolateFactory.js");

router.get("/", (req, res) => {
  const factories = chocolateFactoryRepository.getAll();
  return res.json(factories);
});

router.get("/:id", (req, res) => {
  const id = Number(req.params.id);
  const factory = chocolateFactoryRepository.getById(id);

  if (!factory) {
    return res.status(404).json({ error: "Factory not found" });
  }
  return res.json(factory);
});

router.post("/", (req, res) => {
  const { name, workingHours, status, location, logo, rating } = req.body;

  const newFactory = new ChocolateFactory(
    null,
    name,
    workingHours,
    status,
    location,
    logo,
    rating
  );

  const addedFactory = chocolateFactoryRepository.add(newFactory);
  return res.json({
    message: "Factory added successfully",
    factory: addedFactory,
  });
});

router.patch("/:id", (req, res) => {
  const id = Number(req.params.id);
  const updatedData = { id, ...req.body };
  const updatedFactory = chocolateFactoryRepository.update(updatedData);
  if (!updatedFactory) {
    return res.status(404).json({ error: "Factory not found" });
  }
  return res.json({
    message: "Factory updated successfully",
    factory: updatedFactory,
  });
});

router.delete("/:id", (req, res) => {
  const id = Number(req.params.id);
  const deletedFactory = chocolateFactoryRepository.delete(id);
  if (!deletedFactory) {
    return res.status(404).json({ error: "Factory not found" });
  }
  return res.json({
    message: "Factory deleted successfully",
    factory: deletedFactory,
  });
});

// Route to get all chocolates produced by a specific factory
router.get("/:id/chocolates", (req, res) => {
  const factoryId = Number(req.params.id);
  const chocolates =
    chocolateFactoryRepository.getChocolatesByFactory(factoryId);
  if (!chocolates) {
    return res
      .status(404)
      .json({ error: "No chocolates found for this factory" });
  }
  return res.json(chocolates);
});

module.exports = router;
