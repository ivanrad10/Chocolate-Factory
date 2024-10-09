const fs = require("fs");
const path = require("path");
const Purchase = require("../Model/Purchase");

class PurchaseRepository {
  constructor() {
    this.filePath = path.join(__dirname, "..", "Database/purchases.json");
    this.purchases = this.loadPurchases();
  }

  loadPurchases() {
    if (fs.existsSync(this.filePath)) {
      const data = fs.readFileSync(this.filePath, "utf8");
      const json = JSON.parse(data);
      return json.map((purchase) => Purchase.fromJSON(purchase));
    }
    return [];
  }

  savePurchases() {
    const json = this.purchases.map((purchase) => purchase.toJSON());
    fs.writeFileSync(this.filePath, JSON.stringify(json, null, 4), "utf8");
  }

  add(purchase) {
    this.purchases.push(purchase);
    this.savePurchases();
    return purchase;
  }

  getByFactoryId(factoryId) {
    return this.purchases.filter(
      (purchase) => purchase.factoryId === factoryId
    );
  }

  getAll() {
    return this.purchases;
  }

  update(updatedPurchase) {
    const id = updatedPurchase.id;
    if (!id) {
      throw new Error("ID is required to update a purchase");
    }
    const index = this.purchases.findIndex((purchase) => purchase.id === id);
    if (index !== -1) {
      const existingPurchase = this.purchases[index];
      this.purchases[index] = new Purchase(
        updatedPurchase.chocolates || existingPurchase.chocolates,
        updatedPurchase.factoryId || existingPurchase.factoryId,
        updatedPurchase.customerName || existingPurchase.customerName,
        updatedPurchase.status || existingPurchase.status
      );
      this.purchases[index].id = id;
      this.purchases[index].purchaseDate = existingPurchase.purchaseDate;
      this.purchases[index].totalPrice =
        updatedPurchase.totalPrice || existingPurchase.totalPrice;
      this.savePurchases();
      return this.purchases[index];
    }
    return null;
  }

  delete(id) {
    const index = this.purchases.findIndex((purchase) => purchase.id === id);
    if (index !== -1) {
      const deletedPurchase = this.purchases.splice(index, 1);
      this.savePurchases();
      return deletedPurchase[0];
    }
    return false;
  }
}

module.exports = PurchaseRepository;
