const fs = require("fs");
const path = require("path");
const Chocolate = require("../Model/Chocolate");

class ChocolateRepository {
  constructor() {
    this.filePath = path.join(__dirname, "..", "Database/chocolates.json");
    this.chocolates = this.loadChocolates();
  }

  loadChocolates() {
    if (fs.existsSync(this.filePath)) {
      const data = fs.readFileSync(this.filePath, "utf8");
      const json = JSON.parse(data);
      return json.map((chocolate) => Chocolate.fromJSON(chocolate));
    }
    return [];
  }

  saveChocolates() {
    const json = this.chocolates.map((chocolate) => chocolate.toJSON());
    fs.writeFileSync(this.filePath, JSON.stringify(json, null, 4), "utf8");
  }

  add(chocolate) {
    const id =
      this.chocolates.length > 0
        ? this.chocolates[this.chocolates.length - 1].id + 1
        : 1;
    chocolate.id = id;
    this.chocolates.push(chocolate);
    this.saveChocolates();
    return chocolate;
  }

  getById(id) {
    return this.chocolates.find((chocolate) => chocolate.id === id) || null;
  }

  getAll() {
    return this.chocolates;
  }

  update(updatedChocolate) {
    const id = updatedChocolate.id;
    if (!id) {
      throw new Error("ID is required to update a chocolate");
    }
    const index = this.chocolates.findIndex((chocolate) => chocolate.id === id);
    if (index !== -1) {
      const existingChocolate = this.chocolates[index];
      this.chocolates[index] = new Chocolate(
        existingChocolate.id,
        updatedChocolate.name || existingChocolate.name,
        updatedChocolate.price || existingChocolate.price,
        updatedChocolate.kind || existingChocolate.kind,
        updatedChocolate.factoryId || existingChocolate.factoryId,
        updatedChocolate.type || existingChocolate.type,
        updatedChocolate.weight || existingChocolate.weight,
        updatedChocolate.description || existingChocolate.description,
        updatedChocolate.image || existingChocolate.image,
        updatedChocolate.status || existingChocolate.status,
        updatedChocolate.quantity || existingChocolate.quantity
      );
      if (updatedChocolate.quantity === 0) {
        this.chocolates[index].quantity = 0;
      }
      this.chocolates[index].id = id;
      this.saveChocolates();
      return this.chocolates[index];
    }
    return null;
  }

  delete(id) {
    const index = this.chocolates.findIndex((chocolate) => chocolate.id === id);
    if (index !== -1) {
      const deletedChocolate = this.chocolates.splice(index, 1);
      this.saveChocolates();
      return deletedChocolate[0];
    }
    return false;
  }
}

module.exports = ChocolateRepository;
