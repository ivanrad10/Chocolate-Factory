const { v4: uuidv4 } = require('uuid');
const Chocolate = require("./Chocolate");

class Purchase {
  constructor(chocolates, factoryId, customerName, status) {
    this.id = uuidv4().slice(0, 10); // jedinstveni identifikator od 10 karaktera
    this.chocolates = chocolates.map(choc => {
      return choc instanceof Chocolate ? choc : Chocolate.fromJSON(choc);
    });
    this.factoryId = factoryId;
    this.purchaseDate = this.formatDate(new Date());
    this.totalPrice = this.calculateTotalPrice();
    this.customerName = customerName;
    this.status = status; //{Processing, Approved, Rejected, Canceled}
  }

  calculateTotalPrice(){
      if(!this.chocolates){
          return 0;
      }
      return this.chocolates.reduce((sum, choc) => 
          sum + choc.price * choc.quantity, 0);
  }

  static fromJSON(json) {
    const { id, chocolates, factoryId, purchaseDate, totalPrice, customerName, status } = json;
    const chocolateInstances = chocolates.map(Chocolate.fromJSON);
    const purchase = new Purchase(chocolateInstances, factoryId, customerName, status);
    purchase.id = id;
    purchase.purchaseDate = purchaseDate;
    purchase.totalPrice = totalPrice;
    return purchase;
  }

  toJSON() {
    return {
      id: this.id,
      chocolates: this.chocolates.map(choc => choc.toJSON()),
      factoryId: this.factoryId,
      purchaseDate: this.purchaseDate,
      totalPrice: this.totalPrice,
      customerName: this.customerName,
      status: this.status
    };
  }

  formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }
}

module.exports = Purchase;