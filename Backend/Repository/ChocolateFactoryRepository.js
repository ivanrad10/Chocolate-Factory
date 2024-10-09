const fs = require("fs");
const path = require("path");
const ChocolateFactory = require("../Model/ChocolateFactory");
const ChocolateRepository = require("./ChocolateRepository");

class ChocolateFactoryRepository {
  constructor() {
    this.filePath = path.join(
      __dirname,
      "..",
      "Database/chocolateFactories.json"
    );
    this.chocolateFactories = this.loadFactories();
    this.ChocolateDao = new ChocolateRepository();
  }

  loadFactories() {
    if (fs.existsSync(this.filePath)) {
      const data = fs.readFileSync(this.filePath, "utf8");
      const json = JSON.parse(data);
      return json.map((factory) => ChocolateFactory.fromJSON(factory));
    }
    return [];
  }

  saveFactories() {
    const json = this.chocolateFactories.map((factory) => factory.toJSON());
    fs.writeFileSync(this.filePath, JSON.stringify(json, null, 4), "utf8");
  }

  add(factory) {
    const id =
      this.chocolateFactories.length > 0
        ? this.chocolateFactories[this.chocolateFactories.length - 1].id + 1
        : 1;
    factory.id = id;
    this.chocolateFactories.push(factory);
    this.saveFactories();
    return factory;
  }

  getById(id) {
    return this.chocolateFactories.find((factory) => factory.id === id) || null;
  }

  getAll() {
    const openFactories = this.chocolateFactories.filter(
      (factory) => factory.status === "Open"
    );
    const closedFactories = this.chocolateFactories.filter(
      (factory) => factory.status === "Closed"
    );
    return openFactories.concat(closedFactories);
  }

  update(updatedFactory) {
    const id = updatedFactory.id;
    if (!id) {
      throw new Error("ID is required to update a factory");
    }
    const index = this.chocolateFactories.findIndex(
      (factory) => factory.id === id
    );
    if (index !== -1) {
      const existingFactory = this.chocolateFactories[index];
      this.chocolateFactories[index] = new ChocolateFactory(
        existingFactory.id,
        updatedFactory.name || existingFactory.name,
        updatedFactory.workingHours || existingFactory.workingHours,
        updatedFactory.status || existingFactory.status,
        updatedFactory.location || existingFactory.location,
        updatedFactory.logo || existingFactory.logo,
        updatedFactory.rating || existingFactory.rating,
        id
      );
      this.saveFactories();
      return this.chocolateFactories[index];
    }
    return null;
  }

  delete(id) {
    const index = this.chocolateFactories.findIndex(
      (factory) => factory.id === id
    );
    if (index !== -1) {
      const deletedFactory = this.chocolateFactories.splice(index, 1);
      this.saveFactories();
      return deletedFactory[0];
    }
    return false;
  }

  getChocolatesByFactory(factoryId) {
    return this.ChocolateDao.getAll().filter(
      (chocolate) => chocolate.factoryId === factoryId
    );
  }
}

module.exports = ChocolateFactoryRepository;
