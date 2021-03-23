import mongoose, { Schema } from "mongoose";

class AuthorizationModel {
  init() {
    let ResourceSchema = new Schema({
      path: { type: String, unique: true },
      description: String,
      roles: [
        {
          role: String,
        },
      ],
    });
    mongoose.model("Authorization", ResourceSchema);
  }

  getModel() {
    this.init();
    return mongoose.model("Authorization");
  }
}

export default AuthorizationModel;
