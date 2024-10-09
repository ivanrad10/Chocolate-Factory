class Factory {
  constructor(id, name, workingHours, status, location, logo, rating) {
    this.id = id;
    this.name = name; // Naziv
    this.workingHours = workingHours; // Radno vreme objekta
    this.status = status; // Status (e.g., Radi, Ne radi)
    this.location = location; // Lokacija
    this.logo = logo; // Logo (slika)
    this.rating = rating; // Ocena
  }

  static fromJSON(json) {
    const { id, name, workingHours, status, location, logo, rating } = json;
    return new Factory(id, name, workingHours, status, location, logo, rating);
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      workingHours: this.workingHours,
      status: this.status,
      location: this.location,
      logo: this.logo,
      rating: this.rating,
    };
  }
}

module.exports = Factory;
