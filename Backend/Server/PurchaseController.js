const express = require("express");
const router = express.Router();

const PurchaseRepository = require("../Repository/PurchaseRepository");
const purchaseRepository = new PurchaseRepository();
const Purchase = require("../Model/Purchase");

router.get("/", (req, res) => {
  const purchases = purchaseRepository.getAll();
  return res.json(purchases);
});

router.get("/:factoryId", (req, res) => {
  const factoryId = Number(req.params.factoryId);
  const purchases = purchaseRepository.getByFactoryId(factoryId);

  if (!purchases || purchases.length === 0) {
    return res.status(404).json({ error: "No purchases found" });
  }
  return res.json(purchases);
});

router.post("/", (req, res) => {
  const { chocolates, factoryId, customerName, status } = req.body;
  const newPurchase = new Purchase(chocolates, factoryId, customerName, status);

  const addedPurchase = purchaseRepository.add(newPurchase);
  return res.json({
    message: "Purchase added successfully",
    purchase: addedPurchase,
  });
});

router.patch("/:id", (req, res) => {
  const id = Number(req.params.id);
  const updatedData = { id, ...req.body };
  const updatedPurchase = purchaseRepository.update(updatedData);
  if (!updatedPurchase) {
    return res.status(404).json({ error: "Purchase not found" });
  }
  return res.json({
    message: "Purchase updated successfully",
    purchase: updatedPurchase,
  });
});

router.delete("/:id", (req, res) => {
  const id = Number(req.params.id);
  const deletedPurchase = purchaseRepository.delete(id);
  if (!deletedPurchase) {
    return res.status(404).json({ error: "Purchase not found" });
  }
  return res.json({
    message: "Purchase deleted successfully",
    purchase: deletedPurchase,
  });
});

module.exports = router;
