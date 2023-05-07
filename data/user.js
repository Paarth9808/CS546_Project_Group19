import { user } from "../config/mongoCollection.js";
import { ObjectId } from "mongodb";
import validation from "../validations/userValidation.js";
import bcrypt from "bcryptjs";

let exportedMethods = {
  async createUser(userName, age, email, hashedPassword, role) {
    // check username , mail lowercase if exists(all should be unique)
    userName = validation.checkString(userName, "username");
    age = validation.checkAge(age);
    email = email.toLowerCase();
    email = validation.checkMail(email);
    hashedPassword = validation.checkPass(hashedPassword);
    let password = await bcrypt.hash(hashedPassword, 10); //(password, rounds)

    role = validation.checkRole(role);

    let newUser = {
      userName: userName,
      age: age,
      email: email,
      hashedPassword: password,
      role: role,
      avatar: "default.png",
      reviewedIds: [],
      ratedIds: [],
    };

    const userCollection = await user();
    const user0 = await userCollection.findOne({ email: email });
    if (user0 !== null) throw "user already exists with that email";

    let insertUser = await userCollection.insertOne(newUser);
    if (!insertUser.insertedId) throw "Insert failed!";
    const newId = insertUser.insertedId.toString();

    const user_ret = await this.getUserById(newId);
    return user_ret;
  },

  async getAllUsers() {
    const userCollection = await user();
    const userList = await userCollection.find({}).toArray();
    return userList;
  },

  async getUserById(id) {
    validation.checkId(id);
    const userCollection = await user();
    let userId = await userCollection.findOne({ _id: new ObjectId(id) });
    if (userId === null) {
      throw "no user found with given ID";
    }

    return userId;
  },

  async deleteUser(id) {
    id = validation.checkId(id);
    const userCollection = await user();
    const deleteInfo = await userCollection.findOneAndDelete({
      _id: new ObjectId(id),
    });
    if (deleteInfo.lastErrorObject.n === 0)
      throw `Error: Could not delete user with id of ${id}`;

    return { deleted: true };
  },

  async updateAvatar(idp, avatar1) {
    let id = validation.checkId(idp);
    const userCollection = await user();
    let res = await this.getUserById(id);

    const updateUserInfo = await userCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { avatar: avatar1 } }
    );
    if (updateUserInfo.matchedCount === 0) throw "Error: Update failed";

    return { updated: true };
  },

  async updateRole(id, role) {
    id = validation.checkId(id);
    const userCollection = await user();
    await this.getUserById(id);

    const updateUserInfo = await userCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { role: role } }
    );
    if (updateUserInfo.modifiedCount === 0) throw "Error: Update failed";

    return { updated: true };
  },

  async updateUser(id, userName, age, hashedPassword, oldpassword) {
    id = validation.checkId(id, "ID");
    let userCollection = await user();
    let updateUser = await this.getUserById(id);

    userName = validation.checkString(userName, "username");
    age = validation.checkAge(age);
    hashedPassword = validation.checkPass(hashedPassword);
    let password1 = await bcrypt.hash(hashedPassword, 10);
    let match = await bcrypt.compare(oldpassword, updateUser.hashedPassword);
    // console.log(match, "match");
    if (!match) {
      throw "old password is incorrect";
    }
    const userUpdated = {
      userName: userName,
      age: age,
      hashedPassword: password1,
    };

    const updatedInfo = await userCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: userUpdated }
    );
    if (updatedInfo.modifiedCount === 0) {
      throw "could not update user successfully";
    }

    return await this.getUserById(id);
  },

  // functions works fine
  async addReviewsToUser(id, commentId) {
    const userCollection = await user();
    let userComment = this.getUserById(id);
    const updateInfo = await userCollection.updateOne(
      { _id: new ObjectId(id) },
      { $addToSet: { reviewedIds: commentId } }
    );
    if (!updateInfo.matchedCount && !updateInfo.modifiedCount)
      throw "Update failed";

    return { addedRev: true };
  },

  async addRatingsToUser(id, gameId) {
    const userCollection = await user();
    let userRating = this.getUserById(id);
    const updateInfo = await userCollection.updateOne(
      { _id: new ObjectId(id) },
      { $addToSet: { ratedIds: gameId } }
    );
    if (!updateInfo.matchedCount && !updateInfo.modifiedCount)
      throw "Update failed";

    return { addedRat: true };
  },
};

export default exportedMethods;
