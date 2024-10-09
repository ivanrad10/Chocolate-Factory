const Chocolate = require("./Chocolate");

class Cart{
    constructor(username, chocolates=[]){
        this.username = username;
        this.chocolates = chocolates;
        this.totalPrice = this.calculateTotalPrice();
    }

    calculateTotalPrice(){
        if(!this.chocolates){
            return 0;
        }
        return this.chocolates.reduce((sum, choc) => 
            sum + choc.price * choc.quantity, 0);
    }
    
    updateChocolateQuantity(chocolateId, quantity) {
        const chocolate = this.chocolates.find((choc) => choc.id === chocolateId);
        if (chocolate) {
          chocolate.quantity = quantity;
          this.totalPrice = this.calculateTotalPrice();
        }
    }

    incrementChocolateQuantity(chocolateId, quantity) {
        const chocolate = this.chocolates.find((choc) => choc.id === chocolateId);
        if (chocolate) {
          chocolate.quantity += quantity;
          this.totalPrice = this.calculateTotalPrice();
        }
    }

    addChocolate(chocolate, quantity) {
        const chocolateInstance = Chocolate.fromJSON(chocolate);
        chocolateInstance.quantity = quantity;
        this.chocolates.push(chocolateInstance);
        console.log(chocolateInstance);
        this.totalPrice = this.calculateTotalPrice();
    }

    deleteChocolate(chocolateId) {
        this.chocolates = this.chocolates.filter((choc) => choc.id !== chocolateId);
        this.totalPrice = this.calculateTotalPrice();
    }

    static fromJSON(json){
        const{username, chocolates, totalPrice} = json;
        const chocolateInstances = chocolates.map(Chocolate.fromJSON);
        return new Cart(username, chocolateInstances, totalPrice);
    }

    toJSON(){
        return{
            username: this.username,
            chocolates: this.chocolates.map((choc)=> choc.toJSON()),
            totalPrice: this.totalPrice,
        };
    }
}

module.exports = Cart;