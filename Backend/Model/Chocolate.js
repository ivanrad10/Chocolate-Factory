class Chocolate {
  constructor(
    id,
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
  ) {
    this.id = id;
    this.name = name; // Naziv
    this.price = price; // Cena
    this.kind = kind; // Vrsta (e.g., regular, for cooking, for drinking)
    this.factoryId = factoryId; // Fabrika kojoj pripada
    this.type = type; // Tip (e.g., dark, milk, white)
    this.weight = weight; // Gramaža
    this.description = description; // Opis
    this.image = image; // Slika
    this.status = status; // Status (e.g., In stock, Out of stock)
    this.quantity = quantity; // Količina (number of such chocolates in stock)
  }

  static fromJSON(json) {
    const {
      id,
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
    } = json;
    return new Chocolate(
      id,
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
  }

  toJSON() {
    return {
        id: this.id,
        name: this.name,
        price: this.price,
        kind: this.kind,
        factoryId: this.factoryId,
        type: this.type,
        weight: this.weight,
        description: this.description,
        image: this.image,
        status: this.status,
        quantity: this.quantity,
    };
}
}

module.exports = Chocolate;
