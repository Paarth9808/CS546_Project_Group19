import { comment } from "../config/mongoCollection";
import { ObjectId } from "mongodb"
import validation from '../validations/userValidation.js';
import bcrypt from "bcrypt";

let exportedMethods = {
    async createUser (userName, age, email, hashedPassword, avatar) {
        userName = validation.checkString(userName, "username");
        age = validation.checkAge(age);
        email = validation.checkMail(email);
        hashedPassword = validation.checkString(hashedPassword, "password");
        password = await bcrypt.hash(hashedPassword, 15);

        let newUser = {
            userName : userName,
            age : age,
            email : email,
            hashedPassword : password,
            avatar : avatar,
            reviewedIds : [],
            ratedIds : []
        }

        const userCollection = await user();
        const checkMailExist = await userCollection.findOne({email: email})
        if(checkMailExist) throw "Email already exists";

        let insertUser = await userCollection.insertOne(newUser);
        if (!insertUser.insertedId) throw 'Insert failed!';
        return await this.getUserById(newInsertInformation.insertedId.toString());
    },

    async getAllUsers (){
        const userCollection = await users();
        const userList = await userCollection.find({}).toArray();
        return userList;
    },

    async getUserById (id){
        id = validation.checkString(id, "ID");
        const userCollection = await user();
        const user = await userCollection.findOne({_id: ObjectId(id)});
        if (!user) throw 'Error: User not found';
        return user;
    },

    async deleteUser (id){
        id = validation.checkString(id, "ID");
        const userCollection = await user();
        const deleteInfo = await userCollection.findOneAndDelete({
            _id: ObjectId(id)
          });
        if (deleteInfo.lastErrorObject.n === 0)
            throw `Error: Could not delete user with id of ${id}`;
      
        return {...deleteInfo.value, deleted: true};
    },

    async updateAvatar (id, avatar){
        id = validation.checkString(id, "ID");
        const userCollection = await user();
        let userCheck = this.getUserById(id);
        let updatePhoto = {};
        updatePhoto.avatar =  avatar;
        const updateUserInfo = await userCollection.updateOne({ _id: ObjectId(id) }, { $set: updatePhoto});
        if (updateUserInfo.lastErrorObject.n === 0) throw 'Error: Update failed';

        return await updateUserInfo.value;
    },

    async updateUser (id, userName, age, email, hashedPassword, avatar){
        id = validation.checkId(id, "ID");
        let userCollection = await user();
        let updateUser =  this.getUserById(id);
        if(!userName){
            userName = updateUser.userName;
        }else{
            userName = validation.checkString(userName, "username");
        }

        if(!age){
            age = updateUser.age;
        }else{
            age = validation.checkAge(age);
        }

        if(!email){
            email = updateUser.email;
        }else{
            email = validation.checkMail(email);
        }
        
    },
    // WIP
    async addReviewsToUser(id, reviewId) {
        const userCollection = await users();
        const updateInfo = await userCollection.updateOne({ _id: ObjectId(id)}, { $addToSet: {reviewedId: reviewId}});
        if (!updateInfo.matchedCount && !updateInfo.modifiedCount) throw 'Update failed';
    
        return await this.getUser(id);
    },
    
    async addCommentsToUser(id, commentId) {
        
    }
};

export default exportedMethods 