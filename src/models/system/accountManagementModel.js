import mongoose, { Schema } from "mongoose";

class AccountManagement {
  init() {
    let AccountManagementSchema = new Schema({
      role: String,
      sameOffice: Boolean,
      isSuper: {
        type: Boolean,
        default: false,
      },
      canBeCreatedBy: [
        {
          createdBy: String,
        },
      ],
      canBeVerifiedBy: [
        {
          verifiedBy: String,
        },
      ],
      // log: [
      //   {
      //     actor: String,
      //     activity: String,
      //     activityDate: {
      //       type: Date,
      //       default: Date.now(),
      //     },
      //   },
      // ],
    });
    mongoose.model("AccountManagement", AccountManagementSchema);
  }

  getModel() {
    this.init();
    return mongoose.model("AccountManagement");
  }
}

export default AccountManagement;
