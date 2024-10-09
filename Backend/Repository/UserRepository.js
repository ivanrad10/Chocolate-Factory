const fs = require("fs");
const path = require("path");
const User = require("../Model/User");

class UserRepository {
  constructor() {
    this.filePath = path.join(__dirname, "..", "Database/users.json");
    this.users = this.loadUsers();
  }

  loadUsers() {
    if (fs.existsSync(this.filePath)) {
      const data = fs.readFileSync(this.filePath, "utf8");
      const json = JSON.parse(data);
      return json.map((user) => User.fromJSON(user));
    }
    return [];
  }

  save() {
    const json = this.users.map((user) => user.toJSON());
    fs.writeFileSync(this.filePath, JSON.stringify(json, null, 4), "utf8");
  }

  add(user) {
    const id =
      this.users.length > 0 ? this.users[this.users.length - 1].id + 1 : 1;
    user.id = id;
    this.users.push(user);
    this.save();
    return user;
  }

  getByUsername(username) {
    return this.users.find((user) => user.username === username) || null;
  }

  getAll() {
    return this.users;
  }

  getById(id) {
    return this.users.find((user) => user.id === id) || null;
  }

  update(updatedUser) {
    const id = updatedUser.id;
    if (!id) {
      throw new Error("ID is required to update a user");
    }
    const index = this.users.findIndex((user) => user.id === id);
    if (index === -1) {
      return null;
    }

    const existingUser = this.users[index];
    this.users[index] = new User(
      existingUser.id,
      updatedUser.username || existingUser.username,
      updatedUser.password || existingUser.password,
      updatedUser.name || existingUser.name,
      updatedUser.lastname || existingUser.lastname,
      updatedUser.gender || existingUser.gender,
      updatedUser.birthDate || existingUser.birthDate,
      updatedUser.role || existingUser.role,
      updatedUser.purchases || existingUser.purchases,
      updatedUser.cart || existingUser.cart,
      updatedUser.factory || existingUser.factory,
      updatedUser.points || existingUser.points,
      updatedUser.customerType || existingUser.customerType
    );

    this.users[index].points = updatedUser.points || existingUser.points;

    if (updatedUser.purchases) {
      this.users[index].purchases = [
        ...existingUser.purchases,
        ...updatedUser.purchases,
      ];
    }

    if (this.users[index].points >= 100) {
      this.users[index].customerType = "Gold";
    } else if (this.users[index].points >= 50) {
      this.users[index].customerType = "Silver";
    } else {
      this.users[index].customerType = "Bronze";
    }

    this.save();
    return this.users[index];
  }

  delete(id) {
    const index = this.users.findIndex((user) => user.id === id);
    if (index !== -1) {
      const deletedUser = this.users.splice(index, 1);
      this.save();
      return deletedUser[0];
    }
    return false;
  }
}

module.exports = UserRepository;
